export interface PhotosState {
  photos: string[];
}

export interface PhotosActions {
  setPhoto: (photo: string) => void;
}