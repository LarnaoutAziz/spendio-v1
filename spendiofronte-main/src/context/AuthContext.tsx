import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

interface User {
  id: number;
  name: string;
  email?: string;
  role?: string;
}

const normalizeUser = (user: Partial<User> | null | undefined): User | null => {
  if (!user || typeof user !== 'object') return null;
  if (!user.id) return null;

  return {
    id: Number(user.id),
    name: user.name || 'Utilisateur',
    email: user.email || '',
    role: user.role || 'user',
  };
};

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🧪 Mode développement - Utilisateur de test
const DEV_MODE = false; // Mets à true quand tu veux utiliser l'utilisateur de test
const DEV_USER: User = {
  id: 1,
  name: 'Israa Hamdi',
  email: 'test@example.com',
  role: 'user',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEV_MODE ? DEV_USER : null);
  const [token, setToken] = useState<string | null>(DEV_MODE ? 'dev-token-test' : null);
  const [loading, setLoading] = useState(true);

  // 🔄 Charger le token et l'utilisateur au démarrage
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        if (DEV_MODE) {
          console.log('🧪 Mode développement activé - Utilisateur de test chargé');
          setLoading(false);
          return;
        }

        const storedToken = await AsyncStorage.getItem('authToken');
        const storedUser = await AsyncStorage.getItem('user');

        console.log('🔍 Vérification des données stockées...');
        console.log('📦 Token stocké:', storedToken ? '✅ Oui' : '❌ Non');
        console.log('📦 User stocké:', storedUser ? '✅ Oui' : '❌ Non');

        if (storedToken && storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            const normalizedUser = normalizeUser(parsedUser);

            if (!normalizedUser) {
              throw new Error('Stored user is invalid');
            }

            console.log('✅ Token trouvé, reconnexion automatique...');
            setToken(storedToken);
            setUser(normalizedUser);
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          } catch (parseError) {
            console.error('❌ Erreur parsing user JSON:', parseError);
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('user');
            setToken(null);
            setUser(null);
          }
        } else {
          console.log('❌ Aucun token trouvé - Affichage du login');
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Error loading auth data:', error);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadStoredAuth();
  }, []);

  // 🔑 Fonction de login
  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log(`🔓 [LOGIN] Tentative de connexion: ${email}`);
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
      const { token, user } = response.data;
      const normalizedUser = normalizeUser(user);

      if (!normalizedUser) {
        throw new Error('Login response user is invalid');
      }

      console.log(`✅ [LOGIN] Connexion réussie pour: ${normalizedUser.email || normalizedUser.name}`);
      console.log(`🎫 [LOGIN] Token reçu, sauvegarde...`);

      setToken(token);
      setUser(normalizedUser);

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(normalizedUser));

      console.log(`✅ [LOGIN] Token et utilisateur sauvegardés`);
    } catch (error: any) {
      console.error('❌ Login error:', error.response?.data?.message || error.message);
      console.error('❌ Erreur complète:', error);
      throw error;
    }
  }, []);

  // 📝 Fonction de register
  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', { name, email, password });
      const { token, user } = response.data;
      const normalizedUser = normalizeUser(user);

      if (!normalizedUser) {
        throw new Error('Register response user is invalid');
      }

      setToken(token);
      setUser(normalizedUser);

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(normalizedUser));
    } catch (error: any) {
      console.error('❌ Register error:', error.response?.data?.message || error.message);
      throw error;
    }
  }, []);

  // 🔒 Déconnexion
  const logout = useCallback(async () => {
    try {
      setToken(null);
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🧩 Hook pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
