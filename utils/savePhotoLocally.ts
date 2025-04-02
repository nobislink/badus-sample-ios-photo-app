import { PhotoData } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

export const savePhotoLocally = async (
  photoData: PhotoData,
  imageUri: string
) => {
  const fileName = `${photoData.photoType}-${photoData.subType}`;

  const newPath = `${FileSystem.documentDirectory}${fileName}`;

  await FileSystem.copyAsync({ from: imageUri, to: newPath });

  const photos = JSON.parse(
    (await AsyncStorage.getItem(`photos_${photoData.clientId}`)) || "[]"
  );
  const updatedPhotos = [
    ...photos.filter(
      (p: PhotoData) =>
        p.clientId !== photoData.clientId ||
        p.dealFolderId !== photoData.dealFolderId ||
        p.photoType !== photoData.photoType ||
        p.subType !== photoData.subType
    ),
    { ...photoData, localUri: newPath, uploaded: false },
  ];
  await AsyncStorage.setItem(
    `photos_${photoData.clientId}`,
    JSON.stringify(updatedPhotos)
  );
  return newPath;
};
