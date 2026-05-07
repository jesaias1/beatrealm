export const AUDIO_MAX_BYTES = 50 * 1024 * 1024;
export const COVER_MAX_BYTES = 10 * 1024 * 1024;

export const allowedAudioTypes = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/m4a",
  "audio/aac",
  "audio/ogg",
]);

export const allowedCoverTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const audioExtensions = new Set(["mp3", "wav", "m4a", "ogg"]);
export const coverExtensions = new Set(["jpg", "jpeg", "png", "webp"]);

export function getSafeExtension(fileName: string, mimeType: string) {
  const extension = fileName.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (extension) {
    return extension;
  }

  if (mimeType === "audio/mpeg" || mimeType === "audio/mp3") {
    return "mp3";
  }
  if (mimeType === "audio/wav" || mimeType === "audio/x-wav") {
    return "wav";
  }
  if (mimeType === "audio/mp4" || mimeType === "audio/m4a") {
    return "m4a";
  }
  if (mimeType === "audio/ogg") {
    return "ogg";
  }
  if (mimeType === "image/jpeg") {
    return "jpg";
  }
  if (mimeType === "image/png") {
    return "png";
  }
  if (mimeType === "image/webp") {
    return "webp";
  }

  return "bin";
}

export function validateAudioFile(file: File) {
  const extension = getSafeExtension(file.name, file.type);
  if (!file.type.startsWith("audio/") || !allowedAudioTypes.has(file.type)) {
    return "Upload an MP3, WAV, M4A, or OGG audio file.";
  }
  if (!audioExtensions.has(extension)) {
    return "Audio filename must end in .mp3, .wav, .m4a, or .ogg.";
  }
  if (file.size > AUDIO_MAX_BYTES) {
    return "Audio file must be 50MB or smaller for this local MVP.";
  }
  return null;
}

export function validateCoverFile(file: File) {
  const extension = getSafeExtension(file.name, file.type);
  if (!file.type.startsWith("image/") || !allowedCoverTypes.has(file.type)) {
    return "Upload a JPG, PNG, or WEBP cover image.";
  }
  if (!coverExtensions.has(extension)) {
    return "Cover filename must end in .jpg, .jpeg, .png, or .webp.";
  }
  if (file.size > COVER_MAX_BYTES) {
    return "Cover image must be 10MB or smaller for this local MVP.";
  }
  return null;
}
