import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { MechAvailability } from '../../types/availability';
import { RootState } from '../index';

interface AvailabilityState {
  availabilities: MechAvailability[];
  selectedAvailability: MechAvailability | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: {
    mechId?: string;
    factionId?: string;
    periodId?: string;
    availabilityLevel?: string;
  };
}

const initialState: AvailabilityState = {
  availabilities: [],
  selectedAvailability: null,
  status: 'idle',
  error: null,
  filters: {},
};

const availabilitySlice = createSlice({
  name: 'availabilities',
  initialState,
  reducers: {
    setSelectedAvailability: (state, action: PayloadAction<MechAvailability | null>) => {
      state.selectedAvailability = action.payload;
    },
    setAvailabilities: (state, action: PayloadAction<MechAvailability[]>) => {
      state.availabilities = action.payload;
      state.status = 'succeeded';
    },
    setAvailabilitiesStatus: (
      state,
      action: PayloadAction<'idle' | 'loading' | 'succeeded' | 'failed'>
    ) => {
      state.status = action.payload;
    },
    setAvailabilitiesError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.status = 'failed';
    },
    setAvailabilityFilter: (
      state,
      action: PayloadAction<{ key: keyof AvailabilityState['filters']; value: any }>
    ) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    clearAvailabilityFilters: (state) => {
      state.filters = {};
    },
  },
});

// Export actions
export const {
  setSelectedAvailability,
  setAvailabilities,
  setAvailabilitiesStatus,
  setAvailabilitiesError,
  setAvailabilityFilter,
  clearAvailabilityFilters,
} = availabilitySlice.actions;

// Export selectors
export const selectAllAvailabilities = (state: RootState) => 
  state.availabilities.availabilities;
export const selectSelectedAvailability = (state: RootState) => 
  state.availabilities.selectedAvailability;
export const selectAvailabilitiesStatus = (state: RootState) => 
  state.availabilities.status;
export const selectAvailabilitiesError = (state: RootState) => 
  state.availabilities.error;
export const selectAvailabilityFilters = (state: RootState) => 
  state.availabilities.filters;

// Define a memoized selector for filtered availabilities
export const selectFilteredAvailabilities = createSelector(
  [
    selectAllAvailabilities,
    selectAvailabilityFilters
  ],
  (availabilities, filters) => {
    const { mechId, factionId, periodId, availabilityLevel } = filters;
    
    return availabilities.filter((availability) => {
      // Apply mechId filter
      if (mechId && availability.mechId !== mechId) return false;
      
      // Apply factionId filter
      if (factionId && availability.factionId !== factionId) return false;
      
      // Apply periodId filter
      if (periodId && availability.periodId !== periodId) return false;
      
      // Apply availabilityLevel filter
      if (availabilityLevel && availability.availabilityLevel !== availabilityLevel) return false;
      
      return true;
    });
  }
);

export default availabilitySlice.reducer;