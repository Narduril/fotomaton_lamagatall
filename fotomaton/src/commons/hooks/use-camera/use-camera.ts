import { RefObject, useState } from "react";


const useCamera = () => {
  const [picture, setPicture] = useState<string>("");
  const [isCameraAvailable, setIsCameraAvailable] = useState<boolean>(true)

  const startCamera = async (videoRef: RefObject<HTMLVideoElement>) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
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
    const imageData = canvasRef.current.toDataURL("image/png");
    setPicture(imageData);
  }

   return { startCamera, takePicture, setPicture, isCameraAvailable, picture };
}

export default useCamera;