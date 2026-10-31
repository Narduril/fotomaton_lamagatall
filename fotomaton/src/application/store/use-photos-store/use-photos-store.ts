import { create } from 'zustand';

import { defaultPhotosState } from '@app/store/use-photos-store/utils/default-photos-state';
import type { PhotosActions, PhotosState } from '@app/store/use-photos-store/utils/interfaces';

const usePhotosStore = create<PhotosState & PhotosActions>((set) => ({
  ...defaultPhotosState,
  setPhoto: (photo: string) =>
    set((state) => ({
      ...state,
      photos: [
        ...state.photos,
        photo
      ]
    }))
}))

export default usePhotosStore