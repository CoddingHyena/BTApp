import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import type { User } from '@/types';
import { updateUser } from './authSlice';

interface UserState {
  users: User[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  isLoading: false,
  error: null,
};

// Получение всех пользователей
export const fetchAllUsers = createAsyncThunk('users/fetchAll', async () => {
  const response = await api.users.getAll();
  return response.data;
});

// Получение пользователя по ID
export const fetchUserById = createAsyncThunk('users/fetchById', async (id: string) => {
  const response = await api.users.getById(id);
  return response.data;
});

export const updateUserProfile = createAsyncThunk(
  'users/updateProfile',
  async ({ id, data }: { id: string; data: { username?: string } }) => {
    const response = await api.users.updateProfile(id, data);
    return response.data;
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
                   .addCase(fetchAllUsers.pending, (state) => {
               state.isLoading = true;
               state.error = null;
             })
             .addCase(fetchAllUsers.fulfilled, (state, action) => {
               state.isLoading = false;
               state.users = action.payload;
             })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        // Обновляем пользователя в списке или добавляем его
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        } else {
          state.users.push(action.payload);
        }
      })
                   .addCase(fetchUserById.rejected, (state, action) => {
               state.isLoading = false;
               state.error = action.error.message || 'Failed to fetch user';
             })
             .addCase(updateUserProfile.pending, (state) => {
               state.isLoading = true;
               state.error = null;
             })
             .addCase(updateUserProfile.fulfilled, (state, action) => {
               state.isLoading = false;
               // Обновляем пользователя в списке
               const index = state.users.findIndex(user => user.id === action.payload.id);
               if (index !== -1) {
                 state.users[index] = action.payload;
               }
             })
             .addCase(updateUserProfile.rejected, (state, action) => {
               state.isLoading = false;
               state.error = action.error.message || 'Failed to update profile';
             });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
