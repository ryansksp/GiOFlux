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
    // Listen to auth state changes
    const unsubscribe = databaseService.auth.onAuthStateChange(async (authUser) => {
      if (authUser && authUser.success) {
        setUser(authUser.data);

        // Always fetch the latest user profile from Firestore on login
        try {
          const profileResult = await databaseService.getUser(authUser.data.uid);
          if (profileResult.success) {
            setUserProfile(profileResult.data);
          } else {
            // User exists in Auth but no profile in Firestore
            // This shouldn't happen for properly registered users
            console.warn('User profile not found in Firestore:', authUser.data.uid);
            setUserProfile(null);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
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
    try {
      const result = await databaseService.signIn(email, password);
      // Temporarily disable email verification for testing
      // if (result.success && !result.user.emailVerified) {
      //   throw new Error('Por favor, verifique seu email antes de fazer login.');
      // }
      return result;
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email, password, userData = {}) => {
    try {
      const result = await databaseService.signUp(email, password, userData.displayName || '');

      if (result.success) {
        // Create user profile in Firestore
        const profileData = {
          uid: result.data.uid,
          email: result.data.email,
          displayName: result.data.displayName || userData.displayName || '',
          role: userData.role || 'consultora',
          createdAt: new Date(),
          emailVerified: false
        };

        await databaseService.createUser(profileData);
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await databaseService.signInWithGoogle();

      if (result.success) {
        // Check if user profile exists, create if not
        const profileResult = await databaseService.getUser(result.data.uid);
        if (!profileResult.success) {
          const profileData = {
            uid: result.data.uid,
            email: result.data.email,
            displayName: result.data.displayName || '',
            role: 'consultora', // Default role for Google sign-in
            createdAt: new Date(),
            emailVerified: result.data.emailVerified
          };

          await databaseService.createUser(profileData);
        }
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await databaseService.signOut();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      const result = await databaseService.resetPassword(email);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user || !userProfile) {
        throw new Error('Usuário não autenticado');
      }

      const result = await databaseService.updateUser(user.uid, updates);
      if (result.success) {
        setUserProfile(result.data);
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  const refreshProfile = async () => {
    try {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const profileResult = await databaseService.getUser(user.uid);
      if (profileResult.success) {
        setUserProfile(profileResult.data);
        return { success: true, data: profileResult.data };
      } else {
        throw new Error('Erro ao atualizar perfil');
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
