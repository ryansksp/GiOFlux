import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import PrivacyPolicy from './pages/PrivacyPolicy';
import UserManagement from './pages/UserManagement';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Agenda from './pages/Agenda';
import Tratamentos from './pages/Tratamentos';
import Tratamento from './pages/Tratamento';
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
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#823a80] via-[#c43c8b] to-[#e91e63] p-4">
      <div className="w-full max-w-md">
        <Card className="backdrop-blur-sm bg-white/95 border-0 shadow-2xl">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Conta Pendente de Aprovação</h2>
            <p className="text-gray-600 mb-6">
              Sua conta foi criada com sucesso, mas precisa ser aprovada por um administrador do sistema.
              Você receberá um email quando sua conta for ativada.
            </p>
            <Button
              onClick={() => signOut()}
              variant="outline"
              className="w-full"
            >
              Sair da Conta
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Protected Route Component
function PrivateRoute({ children }) {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#823a80]"></div>
      </div>
    );
  }

  // Verificar se usuário está autenticado e aprovado
  if (!user || !userProfile) {
    return <Navigate to="/login" />;
  }

  // Se usuário tem role 'pending', redirecionar para página de aprovação pendente
  if (userProfile.role === 'pending' || !userProfile.isApproved) {
    return <PendingApproval />;
  }

  return children;
}

// App Routes Component
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/agenda" element={<Agenda />} />
                <Route path="/tratamentos" element={<Tratamentos />} />
                <Route path="/tratamento" element={<Tratamento />} />
                <Route path="/tratamento/:id" element={<Tratamento />} />
                <Route path="/financeiro" element={<Financeiro />} />
                <Route path="/campanhas" element={<Campanhas />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Routes>
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

// Main App Component
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
