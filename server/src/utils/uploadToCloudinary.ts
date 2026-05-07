import { cloudinary } from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";

export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `emu-shop/${folder}`,
        resource_type: "image",
        transformation: [
          { width: 1200, crop: "limit" }, // max width 1200px
          { quality: "auto" }, // auto quality
          { fetch_format: "auto" }, // auto format (webp if supported)
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Upload failed"));
        resolve(result);
      },
    );
    stream.end(buffer);
  });
};

export const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
  try {
    // Extract public_id from URL
    const parts = imageUrl.split("/");
    const filename = parts[parts.length - 1].split(".")[0];
    const folder = parts[parts.length - 2];
    const publicId = `emu-shop/${folder}/${filename}`;
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
};
