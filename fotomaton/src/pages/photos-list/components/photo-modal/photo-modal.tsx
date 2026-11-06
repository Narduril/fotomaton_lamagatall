import React, { useEffect } from "react"

import type { PhotoModalProps } from '@pages/photos-list/components/photo-modal/utils/types';

import '@pages/photos-list/components/photo-modal/photo-modal.css'

const PhotoModal: React.FC<PhotoModalProps> = ({ isVisible, photo, closeModal }) => {
  useEffect(() => {
    if (!isVisible) {
      return
    }

    const previousBodyOverflow = document.body.style.overflow
    const previousDocumentOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousDocumentOverflow
    }
  }, [isVisible])

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
