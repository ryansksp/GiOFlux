import React, { createContext, useContext, useEffect, useState } from 'react';
import { databaseService } from '../services/database';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = databaseService.auth.onAuthStateChange(async (authUser) => {
      if (authUser && authUser.success) {
        setUser(authUser.data);

        try {
          // Aguarda o perfil existir antes de continuar
          let profileResult = await databaseService.getUser(authUser.data.uid);
          if (!profileResult.success) {
            console.warn('Perfil não encontrado, aguardando criação...');
            let retries = 0;
            while (!profileResult.success && retries < 5) {
              await new Promise(res => setTimeout(res, 500)); // espera 500ms
              profileResult = await databaseService.getUser(authUser.data.uid);
              retries++;
            }
          }

          if (profileResult.success) {
            const profile = profileResult.data;

            // Verificar se usuário está aprovado
            if (profile.role === 'pending') {
              console.warn('🚨 User authenticated but account is pending approval');
              // Não faz logout, mas marca como não aprovado
              setUserProfile({ ...profile, isApproved: false });
            } else if (['consultora', 'gerente', 'admin'].includes(profile.role)) {
              setUserProfile({ ...profile, isApproved: true });
            } else {
              console.error('🚨 SECURITY ALERT: Invalid user role!');
              await databaseService.signOut();
              setUser(null);
              setUserProfile(null);
            }
          } else {
            console.error('🚨 SECURITY ALERT: User authenticated but no Firestore profile found!');
            await databaseService.signOut();
            setUser(null);
            setUserProfile(null);
          }
        } catch (error) {
          console.error('Erro ao buscar perfil:', error);
          await databaseService.signOut();
          setUser(null);
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    const result = await databaseService.signIn(email, password);
    if (!result.success) {
      const error = new Error(result.error);
      error.code = result.code;
      throw error;
    }
    return result;
  };

  const signUp = async (email, password, userData = {}) => {
    try {
      const result = await databaseService.signUp(email, password, userData);
      if (!result.success) {
        const error = new Error(result.error);
        error.code = result.code;
        throw error;
      }
      return result;
    } catch (error) {
      console.error('Erro no signup:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await databaseService.signOut();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Erro ao sair:', error);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      const result = await databaseService.resetPassword(email);
      return result;
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      throw error;
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user || !userProfile) throw new Error('Usuário não autenticado');
      const result = await databaseService.updateUser(user.uid, updates);
      if (result.success) setUserProfile(result.data);
      return result;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  };

  const refreshProfile = async () => {
    try {
      if (!user) throw new Error('Usuário não autenticado');
      const profileResult = await databaseService.getUser(user.uid);
      if (profileResult.success) {
        setUserProfile(profileResult.data);
        return { success: true, data: profileResult.data };
      } else {
        throw new Error('Erro ao atualizar perfil');
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
