import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';

interface Game {
  id: string;
  name: string;
  description?: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
}

interface GameState {
  games: Game[];
  currentGame: Game | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: GameState = {
  games: [],
  currentGame: null,
  isLoading: false,
  error: null,
};

export const fetchGames = createAsyncThunk('games/fetchAll', async () => {
  const response = await api.games.getAll();
  return response.data;
});

export const fetchActiveGames = createAsyncThunk('games/fetchActive', async () => {
  const response = await api.games.getActive();
  return response.data;
});

const gameSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    setCurrentGame: (state, action) => {
      state.currentGame = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.isLoading = false;
        state.games = action.payload;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch games';
      })
      .addCase(fetchActiveGames.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchActiveGames.fulfilled, (state, action) => {
        state.isLoading = false;
        state.games = action.payload;
      })
      .addCase(fetchActiveGames.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch active games';
      });
  },
});

export const { setCurrentGame, clearError } = gameSlice.actions;
export default gameSlice.reducer;
