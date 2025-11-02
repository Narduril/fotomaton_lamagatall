import { RefObject, useRef, useState } from "react";


const useCamera = () => {
  const [picture, setPicture] = useState<string>("");
  const [isCameraAvailable, setIsCameraAvailable] = useState<boolean>(true)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = async (videoRef: RefObject<HTMLVideoElement | null>) => {
    if (!videoRef?.current) return;

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
  }

  const takePicture = async (canvasRef: RefObject<HTMLCanvasElement | null>, videoRef: RefObject<HTMLVideoElement | null>) => {
    if (!canvasRef.current || !videoRef.current) return;

    const context = canvasRef.current.getContext("2d");
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;

    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const imageData = canvasRef.current.toDataURL("image/jpeg", 1.0);
    setPicture(imageData);

    if (!window.electronAPI) {
      console.error('❌ Electron API no disponible');
      return;
    }

    const filename = `photo_${Date.now()}.jpeg`;
    await window.electronAPI.savePhoto(imageData, filename);

    setTimeout(() => setPicture(""), 5000)
  }

   return { startCamera, takePicture, setPicture, isCameraAvailable, picture };
}

export default useCamera;