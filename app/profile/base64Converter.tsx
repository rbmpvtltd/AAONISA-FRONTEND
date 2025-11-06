import * as FileSystem from "expo-file-system";

/**
 * Convert an image (data:, file://, http(s)://) to a data URL base64 string.
 * Returns: "data:image/jpeg;base64,...." (keeps mime type if possible)
 */
export async function convertToBase64Expo(uri: string): Promise<string> {
  if (!uri) throw new Error("No uri provided");

  // already data url
  if (uri.startsWith("data:")) return uri;

  // remote http(s) -> fetch and read as base64
  if (uri.startsWith("http://") || uri.startsWith("https://")) {
    // download to cache then read as base64 (safer on mobile)
    const dest = FileSystem.cacheDirectory + `tmp_${Date.now()}`;
    const download = await FileSystem.downloadAsync(uri, dest);
    const mime = download.headers?.["Content-Type"] || "image/jpeg";
    const base64 = await FileSystem.readAsStringAsync(download.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:${mime};base64,${base64}`;
  }

  // file:// local uri or content uri
  // On Expo, readAsStringAsync supports file URIs
  const guessedMime = "image/jpeg";
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return `data:${guessedMime};base64,${base64}`;
}

export default convertToBase64Expo;
