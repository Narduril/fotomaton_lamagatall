import React from "react"

import usePhotosStore from "../../application/store/use-photos-store"

import BackButton from "../../commons/components/presentational/back-button"

import "./photos-list.css"

const PhotosListPage: React.FC = () => {
  const { photos } = usePhotosStore()

  return (
    <section className="photos-list">
      <BackButton />
      <div className="photos-list__container">
        {photos.map((photo: string) => (
          <img className="photos-list__img" src={photo} />
        ))}
      </div>
    </section>)
}

export default PhotosListPage