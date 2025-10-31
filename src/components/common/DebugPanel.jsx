import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { databaseService } from '../../services/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bug, RefreshCw, Eye, EyeOff } from 'lucide-react';

export default function DebugPanel() {
  const { user, userProfile } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});

  const loadDebugInfo = async () => {
    try {
      const usersResult = await databaseService.getAllUsers();
      const currentUserProfile = await databaseService.getUser(user?.uid);

      setDebugInfo({
        timestamp: new Date().toISOString(),
        user: {
          uid: user?.uid,
          email: user?.email,
          displayName: user?.displayName
        },
        userProfile: userProfile,
        firestoreProfile: currentUserProfile.success ? currentUserProfile.data : currentUserProfile.error,
        allUsers: usersResult.success ? {
          count: usersResult.data.length,
          users: usersResult.data.slice(0, 3) // primeiros 3 usuários
        } : usersResult.error,
        authState: {
          isAuthenticated: !!user,
          hasProfile: !!userProfile,
          isApproved: userProfile?.isApproved,
          role: userProfile?.role
        }
      });
    } catch (error) {
      setDebugInfo({
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => {
            setIsVisible(true);
            loadDebugInfo();
          }}
          size="sm"
          variant="outline"
          className="bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
        >
          <Bug className="w-4 h-4 mr-1" />
          Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Card className="bg-yellow-50 border-yellow-300">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-yellow-800 flex items-center gap-2">
              <Bug className="w-4 h-4" />
              Debug Panel
            </CardTitle>
            <div className="flex gap-1">
              <Button
                onClick={loadDebugInfo}
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-yellow-700 hover:bg-yellow-100"
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
              <Button
                onClick={() => setIsVisible(false)}
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-yellow-700 hover:bg-yellow-100"
              >
                <EyeOff className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 text-xs">
            <div>
              <strong>Timestamp:</strong> {debugInfo.timestamp}
            </div>

            <div>
              <strong>Auth State:</strong>
              <div className="ml-2">
                <Badge variant={debugInfo.authState?.isAuthenticated ? 'default' : 'destructive'} className="text-xs">
                  {debugInfo.authState?.isAuthenticated ? 'Autenticado' : 'Não autenticado'}
                </Badge>
                {debugInfo.authState?.isApproved && (
                  <Badge variant="secondary" className="text-xs ml-1">
                    Aprovado
                  </Badge>
                )}
              </div>
            </div>

            {debugInfo.user && (
              <div>
                <strong>Usuário Atual:</strong>
                <div className="ml-2">
                  <div>UID: {debugInfo.user.uid}</div>
                  <div>Email: {debugInfo.user.email}</div>
                  <div>Nome: {debugInfo.user.displayName}</div>
                </div>
              </div>
            )}

            {debugInfo.userProfile && (
              <div>
                <strong>Perfil:</strong>
                <div className="ml-2">
                  <div>Role: {debugInfo.userProfile.role}</div>
                  <div>Aprovado: {debugInfo.userProfile.isApproved ? 'Sim' : 'Não'}</div>
                </div>
              </div>
            )}

            {debugInfo.allUsers && (
              <div>
                <strong>Usuários no Sistema:</strong>
                <div className="ml-2">
                  <div>Total: {debugInfo.allUsers.count}</div>
                  {debugInfo.allUsers.users && (
                    <div className="mt-1">
                      <div className="text-xs text-gray-600">Primeiros usuários:</div>
                      {debugInfo.allUsers.users.map((u, i) => (
                        <div key={i} className="text-xs">
                          {u.displayName} ({u.role})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {debugInfo.error && (
              <div>
                <strong className="text-red-600">Erro:</strong>
                <div className="ml-2 text-red-600">{debugInfo.error}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
