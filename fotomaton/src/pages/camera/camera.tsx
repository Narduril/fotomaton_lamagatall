import React, { useEffect, useRef, useState } from "react"

import useCamera from '@commons/hooks/use-camera'
import usePhotosStore from '@app/store/use-photos-store'

import useCustomNavigate from '@commons/hooks/use-custom-navigate'

import BackButton from '@commons/components/presentational/back-button'

import { ROUTE_PATHS } from '@app/components/routes/utils/route-paths'

import cowabungaImg from '@app/assets/img/cowabunga.png'

import "./camera.css"

const CameraPage: React.FC = () => {
  const { startCamera, takePicture, setPicture, picture, isCameraAvailable } = useCamera()
  const { customNavigate } = useCustomNavigate()
  const { setPhoto } = usePhotosStore()

  const [isTakingPicture, setIsTakingPicture] = useState<boolean>(false)
  const [photoTimer, setPhotoTimer] = useState<number>(4)
  const [photoCount, setPhotoCount] = useState<number>(0)
  const [isInit, setIsInit] = useState<boolean>(true)
  const [hideCameraButton, setHideCameraButton] = useState<boolean>(false)

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef(0);

  useEffect(() => {
    startCamera(videoRef);

    return () => setPicture("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (picture) {
      setPhoto(picture)
      setIsInit(false)
    } else if (!picture && photoCount < 2 && !isInit) {
      startCamera(videoRef)
      handleTakePicture()
    } else if (!picture && !isInit) {
      customNavigate(ROUTE_PATHS.LAST_PHOTOS)
    }
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
      setTimeout(() => {
        takePicture(canvasRef, videoRef)
        setIsTakingPicture(false)
        setPhotoTimer(4)
        setPhotoCount((prev) => prev + 1)
        clearInterval(intervalRef.current)
      }, 1_000)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoTimer])

  const handleTakePicture = () => {
    setIsTakingPicture(true)
    setHideCameraButton(true)
  }

  return (
    <section className="attach-photo-container">
      <BackButton />
      {isCameraAvailable ? (
        <>
        {picture ? (
          <div className="camera-preview">
            <img src={picture} alt="Captured" className="camera-preview__image camera__border" />
          </div>
        ) : (
          <div className="camera">
            {isTakingPicture && photoTimer < 4 && photoTimer > 0 &&  (
              <div className="camera__timer">
                <h2 className="timer-font">{photoTimer}</h2>
              </div>
            )}
            {isTakingPicture && photoTimer === 0 && (
              <img src={cowabungaImg} alt="cowabunga" className="camera__cowabunga-img" />
            )}
            <video data-testid="camera-video" ref={videoRef} autoPlay playsInline muted className="camera__video camera__border" />
            <canvas data-testid="camera-canvas" ref={canvasRef} style={{ display: "none" }} />

            {!hideCameraButton && (
              <button className="camera__controls" onClick={handleTakePicture} />
            )}
          </div>
        )}
        </>
      ) : null}
    </section>
  )
}

export default CameraPage