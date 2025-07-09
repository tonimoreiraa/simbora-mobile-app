import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  PropsWithChildren,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AXIOS_INSTANCE } from '../services/axios';
import { usePostAuthSignIn } from '../services/client/authentication/authentication';
import { PostAuthSignIn200User } from '../services/client/models/postAuthSignIn200User';

interface APIError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

interface TokenResponse {
  type: string;
  name: string;
  token: string;
  abilities: string[];
  lastUsedAt: string | null;
  expiresAt: string | null;
}

export interface AuthContextData {
  user: PostAuthSignIn200User | null;
  loading: boolean;
  signed: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithToken: (token: string, userData: PostAuthSignIn200User) => void;
  loginMutation: ReturnType<typeof usePostAuthSignIn>;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<PostAuthSignIn200User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const loginMutation = usePostAuthSignIn();

  async function signOut() {
    await AsyncStorage.removeItem('@simbora-user');
    await AsyncStorage.removeItem('@simbora-token');
    delete AXIOS_INSTANCE.defaults.headers.Authorization;
    setUser(null);
  }

  useEffect(() => {
    async function loadStoredData() {
      const storedUser = await AsyncStorage.getItem('@simbora-user');
      const storedToken = await AsyncStorage.getItem('@simbora-token');
      
      if (storedUser && storedToken) {
        try {
          const parsedUser = JSON.parse(storedUser);
          AXIOS_INSTANCE.defaults.headers.Authorization = `Bearer ${storedToken}`;
          setUser(parsedUser);
        } catch (error) {
          console.error('Erro ao parsear dados do usuário:', error);
        }
      }
      setLoading(false);
    }
    
    loadStoredData();
    
    // Interceptor do Axios modificado
    const interceptor = AXIOS_INSTANCE.interceptors.response.use(
      // Mantém a resposta em caso de sucesso
      (response) => response,
      // Apenas rejeita a promessa em caso de erro, sem fazer signOut
      (error) => {
        return Promise.reject(error);
      }
    );
    
    // Limpa o interceptor quando o componente é desmontado
    return () => {
      AXIOS_INSTANCE.interceptors.response.eject(interceptor);
    };
  }, []);

  async function signIn(email: string, password: string) {
    try {
      const response = await loginMutation.mutateAsync({
        data: { email, password }
      });
      
      const { token, user: userData } = response;
      
      if (!token || !userData) {
        throw new Error('Resposta inválida do servidor');
      }
      
      const tokenData = token as TokenResponse;
      
      AXIOS_INSTANCE.defaults.headers.Authorization = `Bearer ${tokenData.token}`;
      
      await AsyncStorage.setItem('@simbora-user', JSON.stringify(userData));
      await AsyncStorage.setItem('@simbora-token', tokenData.token);
      
      setUser(userData);
    } catch (error) {
      const apiError = error as APIError;
      throw new Error(apiError.response?.data?.message || apiError.message || 'Erro na autenticação');
    }
  }

  async function signInWithToken(token: string, userData: PostAuthSignIn200User) {
    await AsyncStorage.setItem('@simbora-user', JSON.stringify(userData));
    await AsyncStorage.setItem('@simbora-token', token);
    AXIOS_INSTANCE.defaults.headers.Authorization = `Bearer ${token}`;
    setUser(userData);
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
        loginMutation,
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