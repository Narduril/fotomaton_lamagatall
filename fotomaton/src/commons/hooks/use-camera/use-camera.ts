import { RefObject, useState } from "react";
import usePhotosStore from "../../../application/store/use-photos-store";


const useCamera = () => {
  const { photos } = usePhotosStore()
  const [picture, setPicture] = useState<string>("");
  const [isCameraAvailable, setIsCameraAvailable] = useState<boolean>(true)

  const startCamera = async (videoRef: RefObject<HTMLVideoElement>) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        }
      })

      if (videoRef.current) videoRef.current.srcObject = stream
    } catch (error) {
      console.error("Error accessing camera: ", error)
      setIsCameraAvailable(false)
    }
  }

  const takePicture = (canvasRef: RefObject<HTMLCanvasElement>, videoRef: RefObject<HTMLVideoElement>) => {
    if (!canvasRef.current || !videoRef.current) return;

    const context = canvasRef.current.getContext("2d");

    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;

    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const imageData = canvasRef.current.toDataURL("image/jpeg", 1.0);
    setPicture(imageData);

    const link = document.createElement("a")
    link.download = `photo_${photos.length}.jpeg`
    link.href = imageData
    link.click()
  }

   return { startCamera, takePicture, setPicture, isCameraAvailable, picture };
}

export default useCamera;