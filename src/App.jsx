import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Components
import PendingUsersNotification from './components/common/PendingUsersNotification';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import PrivacyPolicy from './pages/PrivacyPolicy';
import UserManagement from './pages/UserManagement';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Agenda from './pages/Agenda';
import Procedimentos from './pages/Tratamentos';
import Procedimento from './pages/Tratamento';
import Financeiro from './pages/Financeiro';
import Campanhas from './pages/Campanhas';
import Perfil from './pages/Perfil';

// Components
import Layout from './components/Layout';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Pending Approval Component
function PendingApproval() {
  return <PendingUsersNotification />;
}

// ====================================================================
// NOVA ROTA PÚBLICA (Correção)
// ====================================================================
// Este componente protege rotas públicas (como /login e /register)
// de usuários que JÁ ESTÃO autenticados e aprovados.
function PublicRoute({ children }) {
  const { userProfile, loading } = useAuth();

  // Só redirecionar quando não estiver carregando e tiver perfil aprovado
  if (!loading && userProfile && userProfile.isApproved) {
    return <Navigate to="/dashboard" replace />;
  }

  // Mostrar loading ou children
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#823a80]"></div>
      </div>
    );
  }

  return children;
}
// ====================================================================


// Protected Route Component (Seu componente, sem alterações)
function PrivateRoute({ children }) {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#823a80]"></div>
      </div>
    );
  }

  // Verificar se usuário está autenticado
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Aguardar carregamento do perfil
  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#823a80]"></div>
      </div>
    );
  }

  // Verificar se usuário tem isApproved: true para acessar o sistema
  if (!userProfile.isApproved) {
    // Usuário não aprovado - redirecionar para login com notificação
    return <Navigate to="/login" />;
  }

  return children;
}

// App Routes Component (Atualizado para usar PublicRoute)
function AppRoutes() {
  return (
    <Routes>
      {/* Rotas Públicas agora usam <PublicRoute> */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      
      {/* Outras rotas públicas que não precisam de proteção */}
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/pending" element={<PendingApproval />} />

      {/* Rotas Privadas (como estava antes) */}
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Routes>
              <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
              <Route path="/clientes" element={<Layout><Clientes /></Layout>} />
              <Route path="/agenda" element={<Layout><Agenda /></Layout>} />
              <Route path="/procedimentos" element={<Layout><Procedimentos /></Layout>} />
              <Route path="/procedimento" element={<Layout><Procedimento /></Layout>} />
              <Route path="/procedimento/:id" element={<Layout><Procedimento /></Layout>} />
              <Route path="/financeiro" element={<Layout><Financeiro /></Layout>} />
              <Route path="/campanhas" element={<Layout><Campanhas /></Layout>} />
              <Route path="/perfil" element={<Layout><Perfil /></Layout>} />
              <Route path="/usermanagement" element={<Layout><UserManagement /></Layout>} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

// Main App Component (Sem alterações)
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

