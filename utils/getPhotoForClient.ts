import { PhotoData } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getPhotoForClient = async (
  clientId: string,
  photoType: string,
  subType: string
) => {
  const photos = JSON.parse(
    (await AsyncStorage.getItem(`photos_${clientId}`)) || "[]"
  );
  return photos.find(
    (p: PhotoData) =>
      p.photoType === photoType &&
      p.subType === subType &&
      p.clientId === clientId
  );
};
