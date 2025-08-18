import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import type { Pilot, GeneratedPilotData, PilotGenerationRequest, PilotRegenerationRequest } from '@/types';

interface PilotState {
  pilots: Pilot[];
  generatedPilot: GeneratedPilotData | null;
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
}

const initialState: PilotState = {
  pilots: [],
  generatedPilot: null,
  isLoading: false,
  isGenerating: false,
  error: null,
};

// Получение всех пилотов
export const fetchPilots = createAsyncThunk('pilots/fetchAll', async () => {
  const response = await api.pilots.getAll();
  return response.data;
});

// Получение пилотов по кампании
export const fetchPilotsByCampaign = createAsyncThunk(
  'pilots/fetchByCampaign',
  async (campaignId: string) => {
    const response = await api.pilots.getByCampaign(campaignId);
    return response.data;
  }
);

// Создание пилота
export const createPilot = createAsyncThunk(
  'pilots/create',
  async (pilotData: Partial<Pilot>) => {
    const response = await api.pilots.create(pilotData);
    return response.data;
  }
);

// Генерация данных пилота
export const generatePilot = createAsyncThunk(
  'pilots/generate',
  async (data: PilotGenerationRequest) => {
    const response = await api.pilots.generate(data);
    return response.data;
  }
);

// Перегенерация пилота
export const regeneratePilot = createAsyncThunk(
  'pilots/regenerate',
  async (data: PilotRegenerationRequest) => {
    const response = await api.pilots.regenerate(data);
    return response.data;
  }
);

// Обновление пилота
export const updatePilot = createAsyncThunk(
  'pilots/update',
  async ({ id, data }: { id: string; data: Partial<Pilot> }) => {
    const response = await api.pilots.update(id, data);
    return response.data;
  }
);

// Удаление пилота
export const deletePilot = createAsyncThunk(
  'pilots/delete',
  async (id: string) => {
    await api.pilots.delete(id);
    return id;
  }
);

const pilotSlice = createSlice({
  name: 'pilots',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearGeneratedPilot: (state) => {
      state.generatedPilot = null;
    },
    setGeneratedPilot: (state, action) => {
      state.generatedPilot = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPilots
      .addCase(fetchPilots.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPilots.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pilots = action.payload;
      })
      .addCase(fetchPilots.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки пилотов';
      })
      
      // fetchPilotsByCampaign
      .addCase(fetchPilotsByCampaign.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPilotsByCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pilots = action.payload;
      })
      .addCase(fetchPilotsByCampaign.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки пилотов кампании';
      })
      
      // generatePilot
      .addCase(generatePilot.pending, (state) => {
        state.isGenerating = true;
        state.error = null;
      })
      .addCase(generatePilot.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.generatedPilot = action.payload;
      })
      .addCase(generatePilot.rejected, (state, action) => {
        state.isGenerating = false;
        state.error = action.error.message || 'Ошибка генерации пилота';
      })
      
      // regeneratePilot
      .addCase(regeneratePilot.pending, (state) => {
        state.isGenerating = true;
        state.error = null;
      })
      .addCase(regeneratePilot.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.generatedPilot = action.payload;
      })
      .addCase(regeneratePilot.rejected, (state, action) => {
        state.isGenerating = false;
        state.error = action.error.message || 'Ошибка перегенерации пилота';
      })
      
      // createPilot
      .addCase(createPilot.fulfilled, (state, action) => {
        state.pilots.push(action.payload);
        state.generatedPilot = null; // Очищаем сгенерированные данные
      })
      
      // updatePilot
      .addCase(updatePilot.fulfilled, (state, action) => {
        const index = state.pilots.findIndex(pilot => pilot.id === action.payload.id);
        if (index !== -1) {
          state.pilots[index] = action.payload;
        }
      })
      
      // deletePilot
      .addCase(deletePilot.fulfilled, (state, action) => {
        state.pilots = state.pilots.filter(pilot => pilot.id !== action.payload);
      });
  },
});

export const { clearError, clearGeneratedPilot, setGeneratedPilot } = pilotSlice.actions;
export default pilotSlice.reducer;