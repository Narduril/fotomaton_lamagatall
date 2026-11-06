import React from "react"

import type { PhotoModaProps } from '@pages/photos-list/components/photo-modal/utils/types';

import '@pages/photos-list/components/photo-modal/photo-modal.css'

const PhotoModal: React.FC<PhotoModaProps> = ({ isVisible, photo, closeModal }) => {
  return (
    <>
      {isVisible && (
        <div className="photo-modal" onClick={closeModal}>
          <div
            className="photo-modal__container"
            role="dialog"
            aria-modal="true"
            aria-label="Foto ampliada"
            onClick={(event) => event.stopPropagation()}
          >
            <img className="photo-modal__img" src={photo} alt="Foto ampliada" />
            <button
              className="photo-modal__close"
              type="button"
              aria-label="Cerrar foto ampliada"
              onClick={closeModal}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default PhotoModal;