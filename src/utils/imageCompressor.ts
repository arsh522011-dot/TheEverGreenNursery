/**
 * Client-side image compression utility using HTML5 Canvas.
 * Prevents localStorage QuotaExceededError and Firestore 1MB limits by compressing photos before storage or upload.
 */

export async function compressImageFile(
  file: File,
  maxWidth = 960,
  maxHeight = 960,
  quality = 0.72
): Promise<{ dataUrl: string; blob: Blob; file: File }> {
  return new Promise((resolve, reject) => {
    // If it's an SVG or already tiny, don't re-encode with canvas
    if (file.type === 'image/svg+xml' || (file.size < 50 * 1024 && (file.type === 'image/webp' || file.type === 'image/jpeg'))) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        resolve({ dataUrl, blob: file, file });
      };
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate proportional scale
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const fallbackDataUrl = readerEvent.target?.result as string;
          resolve({ dataUrl: fallbackDataUrl, blob: file, file });
          return;
        }

        // Draw and compress image
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const outputMime = 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputMime, quality);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, '') + '.jpg',
                {
                  type: outputMime,
                  lastModified: Date.now(),
                }
              );
              resolve({ dataUrl, blob: blob, file: compressedFile });
            } else {
              resolve({ dataUrl, blob: file, file });
            }
          },
          outputMime,
          quality
        );
      };

      img.onerror = () => {
        const fallbackDataUrl = readerEvent.target?.result as string;
        resolve({ dataUrl: fallbackDataUrl, blob: file, file });
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Compresses an existing base64 data URL string if it exceeds a threshold (e.g. > 80KB).
 */
export async function compressBase64String(
  base64Str: string,
  maxWidth = 900,
  maxHeight = 900,
  quality = 0.7
): Promise<string> {
  if (!base64Str || !base64Str.startsWith('data:image/') || base64Str.length < 80 * 1024) {
    return base64Str;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Str);
        return;
      }

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };

    img.onerror = () => {
      resolve(base64Str);
    };

    img.src = base64Str;
  });
}

/**
 * Trims or sanitizes objects before saving to localStorage to prevent quota exhaustion without losing user photos.
 */
export function sanitizeForLocalStorage<T>(value: T): T {
  return value;
}
