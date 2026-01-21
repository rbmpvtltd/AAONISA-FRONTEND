import * as FileSystem from "expo-file-system";

const VIDEO_DIR = FileSystem.cacheDirectory + "stories/";

export async function getCachedVideo(url: string) {
  await FileSystem.makeDirectoryAsync(VIDEO_DIR, { intermediates: true });

  const filename = url.split("/").pop() || "video.mp4";
  const localPath = VIDEO_DIR + filename;

  const info = await FileSystem.getInfoAsync(localPath);
  if (info.exists) {
    return localPath;
  }

  await FileSystem.downloadAsync(url, localPath);
  return localPath;
}
