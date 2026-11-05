import { useCallback, useRef, useState, type RefObject } from "react";

const useCamera = () => {
  const [isCameraAvailable, setIsCameraAvailable] = useState<boolean>(true)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = useCallback(async (videoRef: RefObject<HTMLVideoElement | null>) => {
    if (!videoRef.current) return;
    try {
      if (streamRef.current) {
        videoRef.current.srcObject = streamRef.current
        await videoRef.current.play().catch(() => {})
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        }
      })

      streamRef.current = stream
      videoRef.current.srcObject = stream
      await videoRef.current.play().catch(() => {})
    } catch (error) {
      console.error("Error accessing camera: ", error)
      setIsCameraAvailable(false)
    }
  }, [])

  const takePicture = useCallback(async (
    canvasRef: RefObject<HTMLCanvasElement | null>,
    videoRef: RefObject<HTMLVideoElement | null>,
  ): Promise<string> => {
    if (!canvasRef.current || !videoRef.current) {
      throw new Error("La cámara todavía no está lista.")
    }

    if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
      throw new Error("La cámara todavía no está enviando imagen.")
    }

    const context = canvasRef.current.getContext("2d");
    if (!context) {
      throw new Error("No se pudo preparar la imagen.")
    }

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;

    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const imageData = canvasRef.current.toDataURL("image/jpeg", 1.0);
    const filename = `photo_${Date.now()}.jpeg`;

    if (window.electronAPI) {
      const result = await window.electronAPI.savePhoto(imageData, filename);
      if (!result.success) {
        throw new Error(result.error ?? "No se pudo guardar la foto.")
      }
    } else {
      if (navigator.userAgent.includes('Electron')) {
        throw new Error("La aplicación Electron no ha cargado su API de guardado.")
      }

      const downloadLink = document.createElement('a')
      downloadLink.href = imageData
      downloadLink.download = filename
      document.body.appendChild(downloadLink)
      downloadLink.click()
      downloadLink.remove()
    }

    return imageData
  }, [])

  return { startCamera, takePicture, isCameraAvailable };
}

export default useCamera;