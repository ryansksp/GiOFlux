import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
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
        // Map Supabase user data to match Firebase structure
        const mappedUser = {
          uid: authUser.user.id,
          email: authUser.user.email,
          displayName: authUser.user.user_metadata?.display_name || '',
          emailVerified: authUser.user.email_confirmed_at ? true : false
        };

        setUser(mappedUser);

        try {
          // Aguarda o perfil existir antes de continuar
          let profileResult = await databaseService.getUser(authUser.user.id);
          if (!profileResult.success) {
            console.warn('Perfil não encontrado, aguardando criação...');
            let retries = 0;
            while (!profileResult.success && retries < 5) {
              await new Promise(res => setTimeout(res, 500)); // espera 500ms
              profileResult = await databaseService.getUser(authUser.user.id);
              retries++;
            }
          }

          if (profileResult.success) {
            const profile = profileResult.data;

            // Verificar se usuário está aprovado - verificar tanto role quanto status
            if (profile.role === 'pending' && profile.status === 'pending') {
              console.warn('🚨 User authenticated but account is pending approval');
              // Não faz logout, mas marca como não aprovado
              setUserProfile({ ...profile, isApproved: false });
            } else if (['consultora', 'gerente', 'admin'].includes(profile.role) && profile.status === 'approved') {
              console.warn('✅ User approved and authenticated');
              setUserProfile({ ...profile, isApproved: true });
            } else if (profile.role === 'rejected' || profile.status === 'rejected') {
              console.warn('🚨 User account was rejected');
              await databaseService.signOut();
              setUser(null);
              setUserProfile(null);
            } else {
              console.error('🚨 SECURITY ALERT: Invalid user role!');
              await databaseService.signOut();
              setUser(null);
              setUserProfile(null);
            }
          } else {
            console.error('🚨 SECURITY ALERT: User authenticated but no Supabase profile found!');
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

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email, password) => {
    const result = await databaseService.signIn(email, password);
    if (!result.success) {
      const error = new Error(result.error);
      error.code = result.code;
      throw error;
    }
    return result;
  }, []);

  const signUp = useCallback(async (email, password, userData = {}) => {
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
  }, []);

  const signOut = useCallback(async () => {
    try {
      await databaseService.signOut();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Erro ao sair:', error);
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (email) => {
    try {
      const result = await databaseService.resetPassword(email);
      return result;
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      throw error;
    }
  }, []);

  const updateProfile = useCallback(async (updates) => {
    try {
      if (!user || !userProfile) throw new Error('Usuário não autenticado');
      const result = await databaseService.updateUser(user.uid, updates);
      if (result.success) setUserProfile(result.data);
      return result;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  }, [user, userProfile]);

  const refreshProfile = useCallback(async () => {
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
  }, [user]);

  const value = useMemo(() => ({
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile
  }), [user, userProfile, loading, signIn, signUp, signOut, resetPassword, updateProfile, refreshProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
