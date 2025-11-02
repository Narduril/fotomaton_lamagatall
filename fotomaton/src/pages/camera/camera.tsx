import React, { useEffect, useRef } from "react"

import useCamera from "../../commons/hooks/use-camera"

import "./camera.css"

const CameraPage: React.FC = () => {
  const { startCamera, takePicture, setPicture, picture, isCameraAvailable } = useCamera()

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  console.log(picture)

  useEffect(() => {
    startCamera(videoRef);

    return () => setPicture("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="attach-photo-container">
      {isCameraAvailable ? (
        <>
        {picture ? (
          <div className="camera-preview">
            <img src={picture} alt="Captured" className="camera-preview__image" />
          </div>
        ) : (
          <div className="camera">
            <video data-testid="camera-video" ref={videoRef} autoPlay playsInline muted className="camera__video" />
            <canvas data-testid="camera-canvas" ref={canvasRef} style={{ display: "none" }} />

            <button className="camera__controls" onClick={() => takePicture(canvasRef, videoRef)} />
          </div>
        )}
        </>
      ) : null}
    </section>
  )
}

export default CameraPage