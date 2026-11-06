import React, { useMemo, useState } from 'react'

import usePhotosStore from '@app/store/use-photos-store'

import PhotoModal from './components/photo-modal'

import BackButton from '@commons/components/presentational/back-button'

import './photos-list.css'

type PhotoGroup = {
  date: string
  photos: string[]
}

const getDateFromPath = (photoPath: string): string => {
  const match = photoPath.match(/(?:^|[\\/])(\d{4}-\d{2}-\d{2})(?:[\\/]|$)/)
  return match?.[1] ?? 'Sin fecha'
}

const PhotosListPage: React.FC = () => {
  const { photos } = usePhotosStore()

  const [showModal, setShowModal] = useState<boolean>(false)
  const [currentPhoto, setCurrentPhoto] = useState<string>('')
  const [selectedDates, setSelectedDates] = useState<string[]>([])

  const photoGroups = useMemo<PhotoGroup[]>(() => {
    const grouped = photos.reduce<Record<string, string[]>>((acc, photoPath) => {
      const date = getDateFromPath(photoPath)
      if (!acc[date]) {
        acc[date] = []
      }

      acc[date].push(photoPath)
      return acc
    }, {})

    return Object.entries(grouped)
      .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
      .map(([date, groupPhotos]) => ({
        date,
        photos: [...groupPhotos].sort((a, b) => b.localeCompare(a)),
      }))
  }, [photos])

  const availableDates = useMemo(() => photoGroups.map((group) => group.date), [photoGroups])

  const filteredGroups = selectedDates.length
    ? photoGroups.filter((group) => selectedDates.includes(group.date))
    : photoGroups

  const handleDateFilter = (date: string) => {
    setSelectedDates((prevDates) => {
      if (prevDates.includes(date)) {
        return prevDates.filter((selectedDate) => selectedDate !== date)
      }

      return [...prevDates, date]
    })
  }

  const handleResetFilters = () => setSelectedDates([])

  const handleClickImg = (photo: string) => {
    setShowModal(true)
    setCurrentPhoto(photo)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setCurrentPhoto('')
  }

  return (
    <main className="photos-list">
      <BackButton />
      <header className="photos-list__header">
        <p className="photos-list__eyebrow">Galería de fotos</p>
        <h1 className="photos-list__title">Momentos</h1>
        <p className="photos-list__description">
          {selectedDates.length > 0
            ? `Mostrando fotos de ${selectedDates.length} fecha${selectedDates.length > 1 ? 's' : ''}`
            : photos.length === 1
              ? '1 foto guardada'
              : `${photos.length} fotos guardadas`}
        </p>
      </header>

      {availableDates.length > 0 && (
        <div className="photos-list__filters" aria-label="Filtrar por fecha">
          {availableDates.map((date) => {
            const isSelected = selectedDates.includes(date)

            return (
              <button
                key={date}
                type="button"
                className={`photos-list__filter${isSelected ? ' photos-list__filter--active' : ''}`}
                onClick={() => handleDateFilter(date)}
                aria-pressed={isSelected}
              >
                {date}
              </button>
            )
          })}

          {selectedDates.length > 0 && (
            <button type="button" className="photos-list__filter photos-list__filter--reset" onClick={handleResetFilters}>
              Ver todas
            </button>
          )}
        </div>
      )}

      {filteredGroups.length ? (
        <div className="photos-list__container">
          {filteredGroups.map((group) => (
            <div key={group.date} className="photos-list__group">
              <h2 className="photos-list__date">{group.date}</h2>
              <div className="photos-list__group-grid">
                {group.photos.map((photo: string, index: number) => (
                  <button
                    className="photos-list__item"
                    type="button"
                    key={`${group.date}-${index}-${photo.slice(0, 24)}`}
                    aria-label={`Ampliar foto ${index + 1} de ${group.date}`}
                    onClick={() => handleClickImg(photo)}
                  >
                    <img className="photos-list__img" src={photo} alt={`Foto ${index + 1} de ${group.date}`} />
                    <span className="photos-list__number">Foto {String(index + 1).padStart(2, '0')}</span>
                  </button>
                ))}
              </div>
            </div>
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
