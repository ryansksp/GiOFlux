import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata
} from 'firebase/storage';
import { initializeApp, getApps } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

// Initialize Firebase app if not already initialized
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const storage = getStorage(app);
export { app };

export class FirebaseStorage {
  constructor() {
    this.storage = storage;
  }

  // Upload file
  async uploadFile(path, file, metadata = {}) {
    try {
      const storageRef = ref(this.storage, path);
      const uploadResult = await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(uploadResult.ref);

      return {
        success: true,
        url: downloadURL,
        path: uploadResult.ref.fullPath,
        metadata: uploadResult.metadata
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  // Upload user avatar
  async uploadAvatar(userId, file) {
    const path = `avatars/${userId}/${Date.now()}_${file.name}`;
    const metadata = {
      contentType: file.type,
      customMetadata: {
        userId: userId,
        type: 'avatar'
      }
    };

    return this.uploadFile(path, file, metadata);
  }

  // Upload treatment photos
  async uploadTreatmentPhoto(treatmentId, file) {
    const path = `treatments/${treatmentId}/${Date.now()}_${file.name}`;
    const metadata = {
      contentType: file.type,
      customMetadata: {
        treatmentId: treatmentId,
        type: 'treatment_photo'
      }
    };

    return this.uploadFile(path, file, metadata);
  }

  // Get download URL
  async getDownloadURL(path) {
    try {
      const storageRef = ref(this.storage, path);
      const url = await getDownloadURL(storageRef);
      return {
        success: true,
        url
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  // Delete file
  async deleteFile(path) {
    try {
      const storageRef = ref(this.storage, path);
      await deleteObject(storageRef);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  // List files in a directory
  async listFiles(path) {
    try {
      const storageRef = ref(this.storage, path);
      const result = await listAll(storageRef);

      const files = await Promise.all(
        result.items.map(async (itemRef) => {
          const metadata = await getMetadata(itemRef);
          const url = await getDownloadURL(itemRef);
          return {
            name: itemRef.name,
            path: itemRef.fullPath,
            url,
            metadata
          };
        })
      );

      return {
        success: true,
        files,
        prefixes: result.prefixes
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  // Get file metadata
  async getFileMetadata(path) {
    try {
      const storageRef = ref(this.storage, path);
      const metadata = await getMetadata(storageRef);
      return {
        success: true,
        metadata
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }
}

// Export singleton instance
export const firebaseStorage = new FirebaseStorage();
