import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

// Initialize Firebase app if not already initialized
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const db = getFirestore(app);
export { app };

export class FirebaseFirestore {
  constructor() {
    this.db = db;
  }

  // Generic CRUD operations
  async create(collectionName, data) {
    try {
      const docRef = await addDoc(collection(this.db, collectionName), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return {
        success: true,
        id: docRef.id,
        data: { ...data, id: docRef.id }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  async read(collectionName, id) {
    try {
      const docRef = doc(this.db, collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          success: true,
          data: { id: docSnap.id, ...docSnap.data() }
        };
      } else {
        return {
          success: false,
          error: 'Document not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  async update(collectionName, id, data) {
    try {
      const docRef = doc(this.db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
      return {
        success: true,
        id,
        data: { ...data, id }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  async delete(collectionName, id) {
    try {
      await deleteDoc(doc(this.db, collectionName, id));
      return { success: true, id };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  async list(collectionName, options = {}) {
    try {
      const {
        where: whereClause = [],
        orderBy: orderByClause = [],
        limit: limitCount,
        startAfter: startAfterDoc
      } = options;

      let q = collection(this.db, collectionName);

      // Apply where clauses
      whereClause.forEach(([field, operator, value]) => {
        q = query(q, where(field, operator, value));
      });

      // Apply order by
      orderByClause.forEach(([field, direction = 'asc']) => {
        q = query(q, orderBy(field, direction));
      });

      // Apply limit
      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      // Apply start after for pagination
      if (startAfterDoc) {
        q = query(q, startAfter(startAfterDoc));
      }

      const querySnapshot = await getDocs(q);
      const results = [];

      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });

      return {
        success: true,
        data: results
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  // Real-time listener
  listenToCollection(collectionName, callback, options = {}) {
    try {
      const {
        where: whereClause = [],
        orderBy: orderByClause = []
      } = options;

      let q = collection(this.db, collectionName);

      // Apply where clauses
      whereClause.forEach(([field, operator, value]) => {
        q = query(q, where(field, operator, value));
      });

      // Apply order by
      orderByClause.forEach(([field, direction = 'asc']) => {
        q = query(q, orderBy(field, direction));
      });

      return onSnapshot(q, (querySnapshot) => {
        const results = [];
        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });
        callback({ success: true, data: results });
      }, (error) => {
        callback({
          success: false,
          error: error.message,
          code: error.code
        });
      });
    } catch (error) {
      callback({
        success: false,
        error: error.message,
        code: error.code
      });
    }
  }

  // Batch operations
  async batchWrite(operations) {
    try {
      const batch = writeBatch(this.db);

      operations.forEach(({ type, collection: collectionName, id, data }) => {
        const docRef = doc(this.db, collectionName, id);

        switch (type) {
          case 'create':
            batch.set(docRef, {
              ...data,
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now()
            });
            break;
          case 'update':
            batch.update(docRef, {
              ...data,
              updatedAt: Timestamp.now()
            });
            break;
          case 'delete':
            batch.delete(docRef);
            break;
          default:
            throw new Error(`Unknown operation type: ${type}`);
        }
      });

      await batch.commit();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  // Specific collection methods for the app
  // Users
  async createUser(userData) {
    return this.create('users', userData);
  }

  async getUser(userId) {
    return this.read('users', userId);
  }

  async updateUser(userId, userData) {
    return this.update('users', userId, userData);
  }

  // Clients
  async createClient(clientData) {
    return this.create('clients', clientData);
  }

  async getClients(userId, options = {}) {
    return this.list('clients', {
      ...options,
      where: [['userId', '==', userId]]
    });
  }

  async updateClient(clientId, clientData) {
    return this.update('clients', clientId, clientData);
  }

  async deleteClient(clientId) {
    return this.delete('clients', clientId);
  }

  // Appointments
  async createAppointment(appointmentData) {
    return this.create('appointments', appointmentData);
  }

  async getAppointments(userId, options = {}) {
    return this.list('appointments', {
      ...options,
      where: [['userId', '==', userId]]
    });
  }

  async updateAppointment(appointmentId, appointmentData) {
    return this.update('appointments', appointmentId, appointmentData);
  }

  async deleteAppointment(appointmentId) {
    return this.delete('appointments', appointmentId);
  }

  // Treatments
  async createTreatment(treatmentData) {
    return this.create('treatments', treatmentData);
  }

  async getTreatments(userId, options = {}) {
    return this.list('treatments', {
      ...options,
      where: [['userId', '==', userId]]
    });
  }

  async updateTreatment(treatmentId, treatmentData) {
    return this.update('treatments', treatmentId, treatmentData);
  }

  async deleteTreatment(treatmentId) {
    return this.delete('treatments', treatmentId);
  }

  // Financial transactions
  async createTransaction(transactionData) {
    return this.create('transactions', transactionData);
  }

  async getTransactions(userId, options = {}) {
    return this.list('transactions', {
      ...options,
      where: [['userId', '==', userId]]
    });
  }

  async updateTransaction(transactionId, transactionData) {
    return this.update('transactions', transactionId, transactionData);
  }

  async deleteTransaction(transactionId) {
    return this.delete('transactions', transactionId);
  }

  // Campaigns
  async createCampaign(campaignData) {
    return this.create('campaigns', campaignData);
  }

  async getCampaigns(userId, options = {}) {
    return this.list('campaigns', {
      ...options,
      where: [['userId', '==', userId]]
    });
  }

  async updateCampaign(campaignId, campaignData) {
    return this.update('campaigns', campaignId, campaignData);
  }

  async deleteCampaign(campaignId) {
    return this.delete('campaigns', campaignId);
  }
}

// Export singleton instance
export const firebaseFirestore = new FirebaseFirestore();
