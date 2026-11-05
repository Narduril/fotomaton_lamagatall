import React, { useState } from "react"

import usePhotosStore from '@app/store/use-photos-store'

import PhotoModal from './components/photo-modal'

import BackButton from '@commons/components/presentational/back-button'

import "./photos-list.css"

const PhotosListPage: React.FC = () => {
  const { photos } = usePhotosStore()

  const [showModal, setShowModal] = useState<boolean>(false)
  const [currentPhoto, setCurrentPhoto] = useState<string>("")

  const handleClickImg = (photo: string) => {
    setShowModal(true)
    setCurrentPhoto(photo)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setCurrentPhoto("")
  }

  return (
    <main className="photos-list">
      <BackButton />
      <header className="photos-list__header">
        <p className="photos-list__eyebrow">Tus recuerdos</p>
        <h1 className="photos-list__title">La galería</h1>
        <p className="photos-list__description">
          {photos.length === 1 ? '1 foto guardada en esta sesión' : `${photos.length} fotos guardadas en esta sesión`}
        </p>
      </header>
      {photos.length ? (
        <div className="photos-list__container">
          {photos.map((photo: string, index: number) => (
            <button
              className="photos-list__item"
              type="button"
              key={`${index}-${photo.slice(0, 24)}`}
              aria-label={`Ampliar foto ${index + 1}`}
              onClick={() => handleClickImg(photo)}
            >
              <img className="photos-list__img" src={photo} alt={`Foto ${index + 1}`} />
              <span className="photos-list__number">Foto {String(index + 1).padStart(2, '0')}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="photos-list__empty">
          <span className="photos-list__empty-icon" aria-hidden="true">⌁</span>
          <h2>Aún no hay fotos</h2>
          <p>Cuando hagas una captura, la encontrarás aquí.</p>
        </div>
      )}
      <PhotoModal isVisible={showModal} photo={currentPhoto} closeModal={handleCloseModal} />
    </main>
  )
}

export default PhotosListPage