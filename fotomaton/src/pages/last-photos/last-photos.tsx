import React, { useEffect } from "react";

import usePhotosStore from '@app/store/use-photos-store'

import useCustomNavigate from '@commons/hooks/use-custom-navigate';

import { ROUTE_PATHS } from '@app/components/routes/utils/route-paths';

import "./last-photos.css"

const LastPhotosPage: React.FC = () => {
  const { photos } = usePhotosStore()
  const { customNavigate } = useCustomNavigate()

  const lastPhotos = photos.slice(-2);

  useEffect(() => {
    const redirect  = setTimeout(() => customNavigate(ROUTE_PATHS.CAMERA), 3_000);

    return () => clearTimeout(redirect);
  }, [customNavigate]);

  return (
    <main className="last-photos">
      <header className="last-photos__header">
        <p className="last-photos__eyebrow">Recuerdo guardado</p>
        <h1 className="last-photos__title">¡Qué buena compañía!</h1>
        <p className="last-photos__description">Tus fotos ya están listas.</p>
      </header>
      <div className="last-photos__container">
        {lastPhotos.map((photo: string, index: number) => (
          <div className="last-photos__frame" key={`${index}-${photo.slice(0, 24)}`}>
            <img className="last-photo__img" src={photo} alt={`Foto de la sessió ${index + 1}`} />
          </div>
        ))}
      </div>
      <p className="last-photos__hint">Volvemos a empezar en un momento…</p>
    </main>
  )
}

export default LastPhotosPage