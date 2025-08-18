import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import type { Campaign, CampaignPlayer, AssignStrategistRequest, User } from '@/types';

interface CampaignState {
  campaigns: Campaign[];
  currentCampaign: Campaign | null;
  strategists: CampaignPlayer[];
  availableUsers: User[];
  campaignPlayers: CampaignPlayer[];
  isLoading: boolean;
  isLoadingPlayers: boolean; // Отдельный флаг для загрузки участников
  error: string | null;
}

const initialState: CampaignState = {
  campaigns: [],
  currentCampaign: null,
  strategists: [],
  availableUsers: [],
  campaignPlayers: [],
  isLoading: false,
  isLoadingPlayers: false,
  error: null,
};

export const fetchCampaigns = createAsyncThunk('campaigns/fetchAll', async () => {
  const response = await api.campaigns.getAll();
  return response.data;
});

export const fetchCampaignById = createAsyncThunk('campaigns/fetchById', async (id: string) => {
  const response = await api.campaigns.getById(id);
  return response.data;
});

export const createCampaign = createAsyncThunk(
  'campaigns/create',
  async (campaignData: Partial<Campaign>) => {
    const response = await api.campaigns.create(campaignData);
    return response.data;
  }
);

// Новые actions для управления стратегами
export const fetchStrategists = createAsyncThunk('campaigns/fetchStrategists', async (id: string) => {
  const response = await api.campaigns.getStrategists(id);
  return response.data;
});

export const assignStrategist = createAsyncThunk(
  'campaigns/assignStrategist',
  async ({ campaignId, data }: { campaignId: string; data: AssignStrategistRequest }) => {
    const response = await api.campaigns.assignStrategist(campaignId, data);
    return response.data;
  }
);

export const removeStrategist = createAsyncThunk(
  'campaigns/removeStrategist',
  async ({ campaignId, factionId }: { campaignId: string; factionId: number }) => {
    await api.campaigns.removeStrategist(campaignId, factionId);
    return { campaignId, factionId };
  }
);

export const fetchAvailableUsers = createAsyncThunk('campaigns/fetchAvailableUsers', async (id: string) => {
  const response = await api.campaigns.getAvailableUsers(id);
  return response.data;
});

        export const fetchCampaignPlayers = createAsyncThunk('campaigns/fetchCampaignPlayers', async (id: string) => {
          const response = await api.campaigns.getPlayers(id);
          return response.data;
        });

const campaignSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    setCurrentCampaign: (state, action) => {
      state.currentCampaign = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearStrategists: (state) => {
      state.strategists = [];
    },
    clearAvailableUsers: (state) => {
      state.availableUsers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCampaigns.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaigns = action.payload;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch campaigns';
      })
      .addCase(fetchCampaignById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCampaignById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCampaign = action.payload;
        // Добавляем кампанию в список, если её там нет
        const existingIndex = state.campaigns.findIndex(c => c.id === action.payload.id);
        if (existingIndex === -1) {
          state.campaigns.push(action.payload);
        } else {
          state.campaigns[existingIndex] = action.payload;
        }
      })
      .addCase(fetchCampaignById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch campaign';
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.campaigns.push(action.payload);
      })
      // Обработка действий для стратегов
      .addCase(fetchStrategists.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchStrategists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.strategists = action.payload;
      })
      .addCase(fetchStrategists.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch strategists';
      })
      .addCase(assignStrategist.fulfilled, (state, action) => {
        // Обновляем список стратегов
        const existingIndex = state.strategists.findIndex(s => 
          s.campaignId === action.payload.campaignId && s.factionId === action.payload.factionId
        );
        if (existingIndex === -1) {
          state.strategists.push(action.payload);
        } else {
          state.strategists[existingIndex] = action.payload;
        }
      })
      .addCase(removeStrategist.fulfilled, (state, action) => {
        // Удаляем стратега из списка
        state.strategists = state.strategists.filter(s => 
          !(s.campaignId === action.payload.campaignId && s.factionId === action.payload.factionId)
        );
      })
      .addCase(fetchAvailableUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAvailableUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableUsers = action.payload;
      })
      .addCase(fetchAvailableUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch available users';
      })
                   .addCase(fetchCampaignPlayers.pending, (state) => {
               state.isLoadingPlayers = true;
             })
             .addCase(fetchCampaignPlayers.fulfilled, (state, action) => {
               state.isLoadingPlayers = false;
               state.campaignPlayers = action.payload;
             })
      .addCase(fetchCampaignPlayers.rejected, (state, action) => {
        state.isLoadingPlayers = false;
        state.error = action.error.message || 'Failed to fetch campaign players';
      });
  },
});

export const { setCurrentCampaign, clearError, clearStrategists, clearAvailableUsers } = campaignSlice.actions;
export default campaignSlice.reducer;