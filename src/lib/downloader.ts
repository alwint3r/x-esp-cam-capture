export async function downloadImage(cameraAddress: string) {
  const url = `http://${cameraAddress}/capture`;

  const res = await fetch(url);
  const blob = await res.blob();

  return blob;
}
