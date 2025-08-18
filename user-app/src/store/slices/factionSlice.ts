import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import type { Faction } from '@/types';

interface FactionState {
  factions: Faction[];
  isLoading: boolean;
  error: string | null;
}

const initialState: FactionState = {
  factions: [],
  isLoading: false,
  error: null,
};

export const fetchFactions = createAsyncThunk('factions/fetchAll', async () => {
  const response = await api.factions.getAll();
  return response.data;
});

export const fetchTopLevelFactions = createAsyncThunk('factions/fetchTopLevel', async () => {
  const response = await api.factions.getTopLevel();
  return response.data;
});

const factionSlice = createSlice({
  name: 'factions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.factions = action.payload;
      })
      .addCase(fetchFactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch factions';
      })
      .addCase(fetchTopLevelFactions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTopLevelFactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.factions = action.payload;
      })
      .addCase(fetchTopLevelFactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch top level factions';
      });
  },
});

export const { clearError } = factionSlice.actions;
export default factionSlice.reducer;