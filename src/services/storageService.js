// Storage Service - Handles file uploads to Supabase Storage
import { supabase } from './supabase/client';

class StorageService {
  constructor() {
    this.bucketName = 'client-photos';
  }

  /**
   * Upload a file to Supabase Storage
   * @param {File} file - The file to upload
   * @param {string} userId - The user ID (for folder organization)
   * @param {string} clientId - The client ID (for file naming)
   * @returns {Promise<{success: boolean, data?: {url: string, path: string}, error?: string}>}
   */
  async uploadClientPhoto(file, userId, clientId) {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return { success: false, error: 'Apenas arquivos de imagem são permitidos' };
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return { success: false, error: 'Arquivo muito grande. Máximo 5MB permitido' };
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${clientId}_${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Upload file
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        return { success: false, error: 'Erro ao fazer upload da imagem' };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      return {
        success: true,
        data: {
          url: publicUrl,
          path: filePath
        }
      };

    } catch (error) {
      console.error('Storage service error:', error);
      return { success: false, error: 'Erro interno do servidor' };
    }
  }

  /**
   * Delete a file from Supabase Storage
   * @param {string} filePath - The path of the file to delete
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async deleteClientPhoto(filePath) {
    try {
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        return { success: false, error: 'Erro ao deletar imagem' };
      }

      return { success: true };

    } catch (error) {
      console.error('Storage service error:', error);
      return { success: false, error: 'Erro interno do servidor' };
    }
  }

  /**
   * Get public URL for a file
   * @param {string} filePath - The path of the file
   * @returns {string} - The public URL
   */
  getPublicUrl(filePath) {
    const { data } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  /**
   * Compress image before upload (optional utility)
   * @param {File} file - The image file
   * @param {number} maxWidth - Maximum width in pixels
   * @param {number} quality - JPEG quality (0-1)
   * @returns {Promise<File>} - Compressed file
   */
  async compressImage(file, maxWidth = 800, quality = 0.8) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }
}

export const storageService = new StorageService();
