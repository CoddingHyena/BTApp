import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean; // Флаг инициализации
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
  isInitialized: false, // Начинаем с false
};

// Логируем инициализацию токена
console.log('AuthSlice initialized with token:', localStorage.getItem('token'));

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await api.auth.login(credentials);
    return response.data;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { username: string; email: string; password: string }) => {
    const response = await api.auth.register(userData);
    return response.data;
  }
);

export const getMe = createAsyncThunk('auth/me', async () => {
  console.log('getMe called');
  const response = await api.auth.me();
  console.log('getMe response:', response.data);
  return response.data;
});

// Инициализация аутентификации при загрузке приложения
export const initializeAuth = createAsyncThunk('auth/initialize', async (_, { dispatch }) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    try {
      // Пытаемся получить профиль пользователя
      const response = await api.auth.me();
      return response.data;
    } catch (error) {
      console.log('Token validation failed:', error);
      // Если токен недействителен, очищаем его
      localStorage.removeItem('token');
      return null;
    }
  }
  
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isInitialized = true;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize auth cases
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = localStorage.getItem('token');
        } else {
          state.user = null;
          state.token = null;
        }
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
      })
      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.isInitialized = true;
        localStorage.setItem('token', action.payload.access_token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Register cases
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.isInitialized = true;
        localStorage.setItem('token', action.payload.access_token);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      })
      // GetMe cases
      .addCase(getMe.fulfilled, (state, action) => {
        console.log('getMe fulfilled:', action.payload);
        state.user = action.payload.user;
      })
      .addCase(getMe.rejected, (state, action) => {
        console.log('getMe rejected:', action.error);
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
      });
  },
});

export const { logout, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;