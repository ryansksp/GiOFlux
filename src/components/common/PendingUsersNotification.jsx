import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, AlertCircle, LogOut } from 'lucide-react';

export default function PendingUsersNotification() {
  const { userProfile, signOut } = useAuth();
  const navigate = useNavigate();

  console.log('PendingUsersNotification - userProfile:', userProfile);

  // Só mostrar para usuários com role 'pending' E status 'pending'
  if (!userProfile) {
    console.log('PendingUsersNotification - not showing, userProfile:', userProfile);
    return null;
  }

  if (userProfile.role !== 'pending' || userProfile.status !== 'pending') {
    console.log('PendingUsersNotification - not showing, userProfile:', userProfile);
    // Redirecionar para dashboard se usuário estiver aprovado
    if (userProfile.isApproved) {
      window.location.href = '/dashboard';
      return null;
    }
    return null;
  }

  console.log('PendingUsersNotification - showing pending screen');

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

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
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
              <AlertCircle className="w-4 h-4" />
              <span>Verifique seu email regularmente</span>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair da Conta
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
