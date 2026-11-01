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
    <section className="last-photos">
      <div className="last-photos__container">
        {lastPhotos.map((photo: string) => (
          <img className="last-photo__img" src={photo} />
        ))}
      </div>
    </section>
  )
}

export default LastPhotosPage