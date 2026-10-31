import React from 'react';

import usePhotosStore from '@app/store/use-photos-store';
import BackButton from '@commons/components/presentational/back-button';

import '@pages/photos-list/photos-list.css';

const PhotosListPage: React.FC = () => {
  const { photos } = usePhotosStore();

  return (
    <section className="photos-list">
      <BackButton />

      <div className="photos-list__container">
        {photos.map((photo: string) => (
          <img key={photo} className="photos-list__img" src={photo} alt="Fotografía guardada" />
        ))}
      </div>
    </section>
  );
};

export default PhotosListPage;