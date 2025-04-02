import AsyncStorage from "@react-native-async-storage/async-storage";
import { uploadPhoto } from "./uploadPhoto";

export const uploadQueuedPhotos = async (
  authToken: string,
  clientId: string
) => {
  const photos = JSON.parse(
    (await AsyncStorage.getItem(`photos_${clientId}`)) || "[]"
  );
  const queuedPhotos = photos.filter((p: PhotoData) => !p.uploaded);
  for (const photoData of queuedPhotos) {
    try {
      await uploadPhoto(
        photoData.dealFolderId,
        photoData.photoType,
        photoData.subType,
        photoData.localUri!,
        authToken
      );
      const updatedPhotos = photos.map((p: PhotoData) =>
        p.photoType === photoData.photoType && p.subType === photoData.subType
          ? { ...p, uploaded: true }
          : p
      );
      await AsyncStorage.setItem(
        `photos_${clientId}`,
        JSON.stringify(updatedPhotos)
      );
    } catch (error) {
      console.log("Upload failed, will retry later", error);
    }
  }
};
