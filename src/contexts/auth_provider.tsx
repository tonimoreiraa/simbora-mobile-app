import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  PropsWithChildren,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api} from '../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextData {
  user: User | null;
  loading: boolean;
  signed: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithToken: (token: string, userData: User) => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface AuthResponse {
  token: {token: string};
  user: User;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

export function AuthProvider({children}: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoredData() {
      const storedUser = await AsyncStorage.getItem('@simbora-user');
      const storedToken = await AsyncStorage.getItem('@simbora-token');

      if (storedUser && storedToken) {
        api.defaults.headers.Authorization = `Bearer ${storedToken}`;
        setUser(JSON.parse(storedUser));
      }

      setLoading(false);
    }

    loadStoredData();
  }, []);

  async function signIn(email: string, password: string) {
    try {
      const response = await api.post<AuthResponse>('/auth/sign-in', {
        email,
        password,
      });
      const {token, user: userData} = response.data;

      api.defaults.headers.Authorization = `Bearer ${token.token}`;
      setUser(user);

      await AsyncStorage.setItem('@simbora-user', JSON.stringify(userData));
      await AsyncStorage.setItem('@simbora-token', token.token);

      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erro na autenticação');
    }
  }

  async function signInWithToken(token: string, userData: User) {
    await AsyncStorage.setItem('@simbora-user', JSON.stringify(userData));
    await AsyncStorage.setItem('@simbora-token', token);
    api.defaults.headers.Authorization = `Bearer ${token}`;
    setUser(userData);
  }

  async function signOut() {
    await AsyncStorage.removeItem('@simbora-user');
    await AsyncStorage.removeItem('@simbora-token');

    delete api.defaults.headers.Authorization;

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        signIn,
        signOut,
        signInWithToken,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}
