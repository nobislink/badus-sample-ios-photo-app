/* export const uploadPhoto = async (
  dealFolderId: string,
  photoType: string,
  subType: string,
  imageUri: string,
  authToken: string
) => {
  const fileName = `${photoType}-${subType}.jpg`;
  const response = await fetch(
    "https://your-firebase-function-url/uploadFiles",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        fileData: {
          src: imageUri,
          name: fileName,
          mimeType: "image/jpeg",
        },
        parentFolderId: dealFolderId,
        subfolderPath: "2. Labeled Photos",
      }),
    }
  );
  return response.json();
}; */

export const uploadPhoto = async (
  dealFolderId: string,
  photoType: string,
  subType: string,
  imageUri: string,
  authToken: string
) => {
  if (!imageUri) return;
  console.log("Uploading photo:", imageUri);
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/photos",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo: imageUri }),
      }
    );

    if (!response.ok) throw new Error("Network response was not ok");
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
