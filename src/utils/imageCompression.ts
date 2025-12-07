/**
 * Compress image before upload
 * Uses browser's Canvas API to compress images
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  maxSizeMB?: number; // Target max size in MB
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.8,
  maxSizeMB: 2,
};

/**
 * Compress an image file
 */
export const compressImage = async (
  file: File,
  options: CompressionOptions = {}
): Promise<File> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;

        if (width > opts.maxWidth! || height > opts.maxHeight!) {
          const ratio = Math.min(
            opts.maxWidth! / width,
            opts.maxHeight! / height
          );
          width = width * ratio;
          height = height * ratio;
        }

        // Create canvas
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        // Try to compress to target size
        let quality = opts.quality!;
        let compressedBlob: Blob | null = null;

        const tryCompress = (q: number): void => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Failed to compress image"));
                return;
              }

              const sizeMB = blob.size / (1024 * 1024);

              // If size is acceptable or quality is too low, use this blob
              if (sizeMB <= opts.maxSizeMB! || q <= 0.1) {
                compressedBlob = blob;
                const compressedFile = new File(
                  [blob],
                  file.name,
                  {
                    type: file.type || "image/jpeg",
                    lastModified: Date.now(),
                  }
                );
                resolve(compressedFile);
              } else {
                // Try lower quality
                tryCompress(Math.max(0.1, q - 0.1));
              }
            },
            file.type || "image/jpeg",
            q
          );
        };

        tryCompress(quality);
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      if (typeof e.target?.result === "string") {
        img.src = e.target.result;
      } else {
        reject(new Error("Invalid file data"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Check if image needs compression
 */
export const shouldCompress = (file: File, maxSizeMB: number = 2): boolean => {
  const sizeMB = file.size / (1024 * 1024);
  return sizeMB > maxSizeMB;
};


