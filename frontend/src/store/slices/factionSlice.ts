import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Faction } from '../../types/faction';
import { RootState } from '../index';

interface FactionState {
  factions: Faction[];
  selectedFaction: Faction | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: FactionState = {
  factions: [],
  selectedFaction: null,
  status: 'idle',
  error: null,
};

const factionSlice = createSlice({
  name: 'factions',
  initialState,
  reducers: {
    setSelectedFaction: (state, action: PayloadAction<Faction | null>) => {
      state.selectedFaction = action.payload;
    },
    setFactions: (state, action: PayloadAction<Faction[]>) => {
      state.factions = action.payload;
      state.status = 'succeeded';
    },
    setFactionsStatus: (
      state,
      action: PayloadAction<'idle' | 'loading' | 'succeeded' | 'failed'>
    ) => {
      state.status = action.payload;
    },
    setFactionsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.status = 'failed';
    },
  },
});

// Export actions
export const {
  setSelectedFaction,
  setFactions,
  setFactionsStatus,
  setFactionsError,
} = factionSlice.actions;

// Export selectors
export const selectAllFactions = (state: RootState) => state.factions.factions;
export const selectSelectedFaction = (state: RootState) => state.factions.selectedFaction;
export const selectFactionsStatus = (state: RootState) => state.factions.status;
export const selectFactionsError = (state: RootState) => state.factions.error;

// Define a memoized selector for active factions (not dissolved)
export const selectActiveFactions = (state: RootState) => {
  return state.factions.factions.filter(
    (faction) => !faction.dissolutionYear || faction.dissolutionYear > new Date().getFullYear()
  );
};

export default factionSlice.reducer;