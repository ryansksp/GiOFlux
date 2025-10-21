import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Agenda from './pages/Agenda';
import Tratamentos from './pages/Tratamentos';
import Financeiro from './pages/Financeiro';
import Campanhas from './pages/Campanhas';

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

  return user && userProfile ? children : <Navigate to="/login" />;
}

// App Routes Component
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
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
                <Route path="/financeiro" element={<Financeiro />} />
                <Route path="/campanhas" element={<Campanhas />} />
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
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
