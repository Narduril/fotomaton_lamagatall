import React from "react"

import type { PhotoModaProps } from './utils/types';

import "./photo-modal.css"

const PhotoModal: React.FC<PhotoModaProps> = ({ isVisible, photo, closeModal }) => {
  return (
    <>
      {isVisible && (
        <div className="photo-modal">
          <div className="photo-modal__container">
            <img className="photo-modal__img" src={photo} />
            <p className="photo-modal__cross" onClick={closeModal}>X</p>
          </div>
        </div>
      )}
    </>
  )
}

export default PhotoModal;