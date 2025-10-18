import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse, UploadStream } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width?: number;
  height?: number;
  format?: string;
  resource_type?: string;
}

export interface CloudinaryDeleteResult {
  result: string;
}

export const uploadToCloudinary = async (file: string): Promise<CloudinaryUploadResult> => {
  try {
    // Check if it's a base64 string
    if (!file.startsWith('data:')) {
      throw new Error('Invalid file format. Expected base64 string.');
    }

    // Extract the base64 data part (after the comma)
    const base64Data = file.split(',')[1];
    if (!base64Data) {
      throw new Error('Invalid base64 format');
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64');
    
    return new Promise((resolve, reject) => {
      const uploadStream: UploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'products',
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
          } else if (result) {
            resolve({
              public_id: result.public_id,
              secure_url: result.secure_url,
              width: result.width,
              height: result.height,
              format: result.format,
              resource_type: result.resource_type,
            });
          } else {
            reject(new Error('Unknown error during Cloudinary upload'));
          }
        }
      );
      
      uploadStream.end(buffer);
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to upload image to Cloudinary: ${error.message}`);
    }
    throw new Error('Failed to upload image to Cloudinary: Unknown error');
  }
};

export const deleteFromCloudinary = async (publicId: string): Promise<CloudinaryDeleteResult> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result as CloudinaryDeleteResult;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete image from Cloudinary: ${error.message}`);
    }
    throw new Error('Failed to delete image from Cloudinary: Unknown error');
  }
};

// Additional utility functions you might find useful

export const uploadMultipleToCloudinary = async (files: string[]): Promise<CloudinaryUploadResult[]> => {
  try {
    const uploadPromises = files.map(file => uploadToCloudinary(file));
    return await Promise.all(uploadPromises);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to upload multiple images: ${error.message}`);
    }
    throw new Error('Failed to upload multiple images: Unknown error');
  }
};

export const getCloudinaryUrl = (publicId: string, transformations?: string): string => {
  const baseUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
  
  if (transformations) {
    return `${baseUrl}/${transformations}/${publicId}`;
  }
  
  return `${baseUrl}/${publicId}`;
};

export default cloudinary;