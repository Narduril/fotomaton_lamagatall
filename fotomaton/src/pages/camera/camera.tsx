import React, { useEffect, useRef, useState } from "react"

import useCamera from '@commons/hooks/use-camera'
import usePhotosStore from '@app/store/use-photos-store'

import useCustomNavigate from '@commons/hooks/use-custom-navigate'

import BackButton from '@commons/components/presentational/back-button'

import { ROUTE_PATHS } from '@app/components/routes/utils/route-paths'

import cowabungaImg from '@app/assets/img/cowabunga.png'

import '@pages/camera/camera.css'

const CameraPage: React.FC = () => {
  const { startCamera, takePicture, isCameraAvailable } = useCamera()
  const { customNavigate } = useCustomNavigate()
  const { setPhoto } = usePhotosStore()

  const [phase, setPhase] = useState<'ready' | 'countdown' | 'preview'>('ready')
  const [photoTimer, setPhotoTimer] = useState<number>(3)
  const [photoCount, setPhotoCount] = useState<number>(0)
  const [picture, setPicture] = useState<string>('')
  const [captureError, setCaptureError] = useState<string>('')

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    void startCamera(videoRef)
  }, [startCamera])

  useEffect(() => {
    if (phase !== 'countdown') return

    if (photoTimer === 0) {
      const captureTimeout = window.setTimeout(() => {
        void takePicture(canvasRef, videoRef).then((imageData) => {
          setPhoto(imageData)
          setPicture(imageData)
          setPhotoCount((count) => count + 1)
          setPhase('preview')
        }).catch((error: unknown) => {
          console.error('Error al capturar la foto:', error)
          setCaptureError('No se pudo guardar la foto. Comprueba la cámara e inténtalo de nuevo.')
          setPhase('ready')
          setPhotoTimer(3)
        })
      }, 700)

      return () => window.clearTimeout(captureTimeout)
    }

    const countdownTimeout = window.setTimeout(() => {
      setPhotoTimer((timer) => timer - 1)
    }, 1_000)

    return () => window.clearTimeout(countdownTimeout)
  }, [phase, photoTimer, setPhoto, takePicture])

  useEffect(() => {
    if (phase !== 'preview') return

    const previewTimeout = window.setTimeout(() => {
      setPicture('')
      if (photoCount >= 2) {
        customNavigate(ROUTE_PATHS.LAST_PHOTOS)
        return
      }

      setPhotoTimer(3)
      setPhase('countdown')
    }, 2_000)

    return () => window.clearTimeout(previewTimeout)
  }, [customNavigate, phase, photoCount])

  const handleTakePicture = () => {
    setCaptureError('')
    setPhotoTimer(3)
    setPhase('countdown')
  }

  return (
    <main className="camera-page">
      <BackButton />
      {isCameraAvailable ? (
        <div className="camera-page__content">
          <header className="camera-page__header">
            <p className="camera-page__eyebrow">Sonríe, por favor</p>
            <h1 className="camera-page__title">Tu momento</h1>
            <p className="camera-page__description">
              {phase === 'countdown' ? 'Mira a cámara y prepara tu mejor sonrisa.' : 'Pulsa el botón y deja que empiece la magia.'}
            </p>
          </header>

          <div className="camera-stage">
            <div className="camera">
              <video
                data-testid="camera-video"
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="camera__video"
                aria-label="Vista previa de la cámara"
              />
              <canvas data-testid="camera-canvas" ref={canvasRef} style={{ display: 'none' }} />
              {picture && (
                <div className="camera-preview">
                  <img src={picture} alt={`Foto ${photoCount} de la sesión`} className="camera-preview__image" />
                </div>
              )}
              {phase === 'countdown' && photoTimer > 0 && (
                <div className="camera__timer" aria-live="assertive" aria-label={`Foto en ${photoTimer}`}>
                  <span>{photoTimer}</span>
                </div>
              )}
              {phase === 'countdown' && photoTimer === 0 && (
                <img src={cowabungaImg} alt="Cowabunga" className="camera__cowabunga-img" />
              )}
              {phase === 'ready' && (
                <button
                  className="camera__controls"
                  type="button"
                  aria-label="Hacer dos fotos"
                  onClick={handleTakePicture}
                >
                  <span aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
          <p className="camera-page__progress">Foto {Math.min(photoCount + 1, 2)} <span aria-hidden="true">/</span> 2</p>
          {!window.electronAPI && !navigator.userAgent.includes('Electron') && (
            <p className="camera-page__storage-note">Modo navegador: las fotos se descargan en tu dispositivo.</p>
          )}
          {captureError && <p className="camera-page__error" role="alert">{captureError}</p>}
        </div>
      ) : (
        <section className="camera-error" role="alert">
          <span className="camera-error__icon" aria-hidden="true">!</span>
          <h1>No encontramos la cámara</h1>
          <p className="camera-error__message">
            Comprueba que esté conectada y que hayas permitido el acceso a la cámara.
          </p>
        </section>
      )}
    </main>
  )
}

export default CameraPage
