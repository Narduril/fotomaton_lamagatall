import React, { useEffect, useRef, useState } from "react"

import useCamera from "../../commons/hooks/use-camera"
import usePhotosStore from "../../application/store/use-photos-store"

import BackButton from "../../commons/components/presentational/back-button"

import "./camera.css"

const CameraPage: React.FC = () => {
  const { startCamera, takePicture, setPicture, picture, isCameraAvailable } = useCamera()
  const { setPhoto } = usePhotosStore()

  const [isTakingPicture, setIsTakingPicture] = useState<boolean>(false)
  const [photoTimer, setPhotoTimer] = useState<number>(3)

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef(0);

  useEffect(() => {
    startCamera(videoRef);

    return () => setPicture("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (picture) setPhoto(picture)
    else if (!picture) startCamera(videoRef)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picture])

  useEffect(() => {
    if (isTakingPicture) {
      intervalRef.current = setInterval(() => {
        setPhotoTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1_000);
    }
  }, [isTakingPicture]);

  useEffect(() => {
    if (photoTimer === 0) {
      takePicture(canvasRef, videoRef)
      setIsTakingPicture(false)
      setPhotoTimer(3)
      clearInterval(intervalRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoTimer])

  const handleTakePicture = () => setIsTakingPicture(true)

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
            {isTakingPicture && (
              <div className="camera__timer">
                <h2 className="timer-font">{photoTimer}</h2>
              </div>
            )}
            <video data-testid="camera-video" ref={videoRef} autoPlay playsInline muted className="camera__video" />
            <canvas data-testid="camera-canvas" ref={canvasRef} style={{ display: "none" }} />

            <button className="camera__controls" onClick={handleTakePicture} />
          </div>
        )}
        </>
      ) : null}
    </section>
  )
}

export default CameraPage