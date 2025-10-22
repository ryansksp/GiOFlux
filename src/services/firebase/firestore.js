import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp
} from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

// Inicializa Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const db = getFirestore(app);

export class FirebaseFirestore {
  constructor() {
    this.db = db;
  }

  // CRUD genérico
  async create(collectionName, data) {
    try {
      const docRef = await addDoc(collection(this.db, collectionName), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return { success: true, id: docRef.id, data: { ...data, id: docRef.id } };
    } catch (error) {
      return { success: false, error: error.message, code: error.code };
    }
  }

  async read(collectionName, id) {
    try {
      const docRef = doc(this.db, collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: 'Document not found' };
      }
    } catch (error) {
      return { success: false, error: error.message, code: error.code };
    }
  }

  async update(collectionName, id, data) {
    try {
      const docRef = doc(this.db, collectionName, id);
      await updateDoc(docRef, { ...data, updatedAt: Timestamp.now() });
      return { success: true, id, data: { ...data, id } };
    } catch (error) {
      return { success: false, error: error.message, code: error.code };
    }
  }

  async delete(collectionName, id) {
    try {
      await deleteDoc(doc(this.db, collectionName, id));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message, code: error.code };
    }
  }

  async list(collectionName, options = {}) {
    try {
      let q = collection(this.db, collectionName);

      // Filtros
      if (options.where) {
        options.where.forEach(([field, operator, value]) => {
          q = query(q, where(field, operator, value));
        });
      }

      // Ordenação
      if (options.orderBy) {
        if (Array.isArray(options.orderBy)) {
          const [field, direction] = options.orderBy;
          q = query(q, orderBy(field, direction || 'asc'));
        } else {
          q = query(q, orderBy(options.orderBy, 'desc'));
        }
      }

      // Limite
      if (options.limit) {
        q = query(q, limit(options.limit));
      }

      // Paginação
      if (options.startAfter) {
        q = query(q, startAfter(options.startAfter));
      }

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return {
        success: true,
        data,
        lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1]
      };
    } catch (error) {
      return { success: false, error: error.message, code: error.code };
    }
  }

  // ===== Usuários =====
  async createUser(userData) {
    try {
      console.log('Firestore createUser called with:', userData);
      const docRef = doc(this.db, 'users', userData.uid);
      console.log('Doc ref created for path:', docRef.path);
      await setDoc(docRef, {
        ...userData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      console.log('setDoc completed successfully');
      return { success: true, id: userData.uid, data: { ...userData, id: userData.uid } };
    } catch (error) {
      console.error('Firestore createUser error:', error);
      return { success: false, error: error.message, code: error.code };
    }
  }

  async getUser(userId) {
    return this.read('users', userId);
  }

  async updateUser(userId, userData) {
    return this.update('users', userId, userData);
  }

  // ===== Clientes =====
  async getClients(userId, options = {}) {
    return this.list('clients', {
      ...options,
      where: [['userId', '==', userId]]
    });
  }

  async createClient(clientData) {
    return this.create('clients', clientData);
  }

  async updateClient(clientId, clientData) {
    return this.update('clients', clientId, clientData);
  }

  async deleteClient(clientId) {
    return this.delete('clients', clientId);
  }

  // ===== Agendamentos =====
  async getAppointments(userId, options = {}) {
    return this.list('appointments', {
      ...options,
      where: [['userId', '==', userId]]
    });
  }

  async createAppointment(appointmentData) {
    return this.create('appointments', appointmentData);
  }

  async updateAppointment(appointmentId, appointmentData) {
    return this.update('appointments', appointmentId, appointmentData);
  }

  async deleteAppointment(appointmentId) {
    return this.delete('appointments', appointmentId);
  }

  // ===== Tratamentos =====
  async getTreatments(userId, options = {}) {
    return this.list('treatments', {
      ...options,
      where: [['userId', '==', userId]]
    });
  }

  async createTreatment(treatmentData) {
    return this.create('treatments', treatmentData);
  }

  async updateTreatment(treatmentId, treatmentData) {
    return this.update('treatments', treatmentId, treatmentData);
  }

  async deleteTreatment(treatmentId) {
    return this.delete('treatments', treatmentId);
  }

  // ===== Transações financeiras =====
  async getTransactions(userId, options = {}) {
    // Primeiro tenta buscar na coleção 'transactions'
    let result = await this.list('transactions', {
      ...options,
      where: [['userId', '==', userId]]
    });

    // Se não encontrou, tenta na coleção 'transacoes' (português)
    if (!result.success || (result.data && result.data.length === 0)) {
      result = await this.list('transacoes', {
        ...options,
        where: [['userId', '==', userId]]
      });
    }

    return result;
  }

  // Método alternativo sem filtros para casos onde índices não existem
  async getAllTransactions(collectionName = 'transactions') {
    try {
      const q = collection(this.db, collectionName);
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async createTransaction(transactionData) {
    // Convert date string to Firestore Timestamp
    const data = {
      ...transactionData,
      data_transacao: Timestamp.fromDate(new Date(transactionData.data_transacao))
    };
    return this.create('transactions', data);
  }

  async updateTransaction(transactionId, transactionData) {
    // Convert date string to Firestore Timestamp if present
    const data = transactionData.data_transacao ?
      {
        ...transactionData,
        data_transacao: Timestamp.fromDate(new Date(transactionData.data_transacao))
      } : transactionData;
    return this.update('transactions', transactionId, data);
  }

  async deleteTransaction(transactionId) {
    return this.delete('transactions', transactionId);
  }

  // ===== Campanhas =====
  async getCampaigns(userId, options = {}) {
    return this.list('campaigns', {
      ...options,
      where: [['userId', '==', userId]]
    });
  }

  async createCampaign(campaignData) {
    return this.create('campaigns', campaignData);
  }

  async updateCampaign(campaignId, campaignData) {
    return this.update('campaigns', campaignId, campaignData);
  }

  async deleteCampaign(campaignId) {
    return this.delete('campaigns', campaignId);
  }
}

// Export singleton
export const firebaseFirestore = new FirebaseFirestore();
