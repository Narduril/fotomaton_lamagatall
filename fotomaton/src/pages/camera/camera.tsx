import React, { useEffect, useRef } from "react"

import useCamera from "../../commons/hooks/use-camera"
import usePhotosStore from "../../application/store/use-photos-store"

import BackButton from "../../commons/components/presentational/back-button"

import "./camera.css"

const CameraPage: React.FC = () => {
  const { startCamera, takePicture, setPicture, picture, isCameraAvailable } = useCamera()
  const { setPhoto } = usePhotosStore()

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera(videoRef);

    return () => setPicture("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (picture) setPhoto(picture)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picture])

  return (
    <section className="attach-photo-container">
      <BackButton />
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