import { create } from "zustand";

import { defaultPhotosState } from '@app/store/use-photos-store/utils/default-photos-state';

import type { PhotosActions, PhotosState } from '@app/store/use-photos-store/utils/interfaces';

const usePhotosStore = create<PhotosState & PhotosActions>((set) => ({
  ...defaultPhotosState,
  setPhoto: (photo: string) =>
    set((state) => ({
      ...state,
      photos: [...new Set([...state.photos, photo])]
    })),
  setPhotos: (photos: string[]) =>
    set(() => ({
      photos: [...new Set(photos)]
    }))
}))

export default usePhotosStore