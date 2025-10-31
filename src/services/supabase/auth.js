import { supabase } from './client';

export class SupabaseAuth {
  constructor() {
    this.supabase = supabase;
  }

  // Login
  async signIn(email, password) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Handle specific Supabase Auth errors
        if (error.message.includes('Invalid login credentials')) {
          return { success: false, error: 'Email ou senha incorretos. Tente novamente.', code: error.message };
        } else if (error.message.includes('Email not confirmed')) {
          return { success: false, error: 'Email não confirmado. Verifique sua caixa de entrada.', code: error.message };
        } else {
          return { success: false, error: error.message, code: error.message };
        }
      }

      return { success: true, user: data.user, session: data.session };
    } catch (error) {
      return { success: false, error: error.message, code: error.message };
    }
  }

  // Cadastro
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: userData.displayName || '',
            role: 'pending',
            status: 'pending'
          }
        }
      });

      if (error) {
        // Handle specific Supabase Auth errors for signup
        if (error.message.includes('User already registered')) {
          return { success: false, error: 'Este email já está sendo usado. Tente fazer login.', code: error.message };
        } else if (error.message.includes('Password should be at least')) {
          return { success: false, error: 'A senha é muito fraca. Use pelo menos 6 caracteres.', code: error.message };
        } else {
          return { success: false, error: error.message, code: error.message };
        }
      }

      // O perfil será criado automaticamente pelo trigger no banco de dados
      // Não precisamos criar manualmente aqui

      return { success: true, user: data.user, session: data.session };
    } catch (error) {
      return { success: false, error: error.message, code: error.message };
    }
  }

  // Logout
  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) {
        return { success: false, error: error.message, code: error.message };
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message, code: error.message };
    }
  }

  // Update profile
  async updateProfile(updates) {
    try {
      const { data, error } = await this.supabase.auth.updateUser({
        data: updates
      });

      if (error) {
        return { success: false, error: error.message, code: error.message };
      }

      // Atualizar também na tabela users se necessário
      if (updates.display_name) {
        const { error: profileError } = await this.supabase
          .from('users')
          .update({
            display_name: updates.display_name,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.user.id);

        if (profileError) {
          console.error('Erro ao atualizar perfil na tabela users:', profileError);
        }
      }

      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message, code: error.message };
    }
  }

  // Reset de senha
  async resetPassword(email) {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        // Handle specific Supabase Auth errors for password reset
        if (error.message.includes('User not found')) {
          return { success: false, error: 'Este email não está cadastrado.', code: error.message };
        } else {
          return { success: false, error: error.message, code: error.message };
        }
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message, code: error.message };
    }
  }

  // Auth state change
  onAuthStateChange(callback) {
    const { data: { subscription } } = this.supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user ? { success: true, user: session.user, session } : { success: false, user: null });
    });
    return () => subscription.unsubscribe();
  }

  // Get current user
  getCurrentUser() {
    return this.supabase.auth.getUser();
  }

  // Get current session
  getCurrentSession() {
    return this.supabase.auth.getSession();
  }
}

export const supabaseAuth = new SupabaseAuth();
