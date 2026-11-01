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
    <section className="photos-list">
      <BackButton />
      <div className="photos-list__container">
        {photos.map((photo: string) => (
          <img className="photos-list__img" src={photo} onClick={() => handleClickImg(photo)} />
        ))}
      </div>
      <PhotoModal isVisible={showModal} photo={currentPhoto} closeModal={handleCloseModal} />
    </section>
  )
}

export default PhotosListPage