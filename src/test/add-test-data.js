import {
  collection,
  doc,
  addDoc,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getAuth } from 'firebase/auth';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAI-Ymb0r01q681y-sOHGFu820PwY_hY58",
  authDomain: "gioflux-83e8b.firebaseapp.com",
  projectId: "gioflux-83e8b",
  storageBucket: "gioflux-83e8b.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Inicializa Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);
const auth = getAuth(app);

async function addTestData() {
  try {
    // Usar o UID fixo do usuário atual - sem login, direto no Firestore
    const userId = 'DOX0G8U9tYZ5rTEtQ4aiUBJuQGV2'; // UID do usuário pendente

    console.log('Aprovando usuário:', userId);

    // Aprovar o usuário pendente
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role: 'admin',
      status: 'approved',
      approvedAt: Timestamp.now(),
      approvedBy: userId, // auto-aprovação para teste
      updatedAt: Timestamp.now()
    });

    console.log('Usuário aprovado com sucesso!');

    // Adicionar cliente de teste
    const clientData = {
      userId: userId,
      nome: 'Cliente Teste',
      email: 'cliente@teste.com',
      telefone: '(11) 99999-9999',
      status: 'ativo',
      data_cadastro: new Date(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const clientRef = await addDoc(collection(db, 'clients'), clientData);
    console.log('Cliente criado com ID:', clientRef.id);

    // Adicionar agendamento de teste
    const appointmentData = {
      userId: userId,
      clientId: clientRef.id,
      data: new Date(),
      hora: '10:00',
      servico: 'Tratamento de Teste',
      status: 'confirmado',
      valor: 150,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const appointmentRef = await addDoc(collection(db, 'appointments'), appointmentData);
    console.log('Agendamento criado com ID:', appointmentRef.id);

    // Adicionar transação de teste
    const transactionData = {
      userId: userId,
      tipo: 'receita',
      categoria: 'Tratamento',
      descricao: 'Tratamento de Teste',
      valor: 150,
      data_transacao: Timestamp.fromDate(new Date()),
      status: 'confirmado',
      forma_pagamento: 'dinheiro',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const transactionRef = await addDoc(collection(db, 'transactions'), transactionData);
    console.log('Transação criada com ID:', transactionRef.id);

    // Adicionar tratamento de teste
    const treatmentData = {
      userId: userId,
      clientId: clientRef.id,
      appointmentId: appointmentRef.id,
      tipo_tratamento: 'Tratamento de Teste',
      data_tratamento: new Date(),
      valor: 150,
      status: 'concluido',
      observacoes: 'Tratamento de teste realizado com sucesso',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const treatmentRef = await addDoc(collection(db, 'treatments'), treatmentData);
    console.log('Tratamento criado com ID:', treatmentRef.id);

    console.log('Dados de teste adicionados com sucesso!');
    console.log('Agora recarregue o dashboard para ver os valores.');

  } catch (error) {
    console.error('Erro ao adicionar dados de teste:', error);
  }
}

// Executar diretamente
addTestData();

export { addTestData };
