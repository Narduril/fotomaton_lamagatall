import { create } from "zustand";

import { defaultPhotosState } from "./utils/default-photos-state";

import { PhotosActions, PhotosState } from "./utils/interfaces";

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