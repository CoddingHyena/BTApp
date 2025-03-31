import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Period } from '../../types/period';
import { RootState } from '../index';

interface PeriodState {
  periods: Period[];
  selectedPeriod: Period | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PeriodState = {
  periods: [],
  selectedPeriod: null,
  status: 'idle',
  error: null,
};

const periodSlice = createSlice({
  name: 'periods',
  initialState,
  reducers: {
    setSelectedPeriod: (state, action: PayloadAction<Period | null>) => {
      state.selectedPeriod = action.payload;
    },
    setPeriods: (state, action: PayloadAction<Period[]>) => {
      // Sort periods by sortOrder
      const sortedPeriods = [...action.payload].sort((a, b) => a.sortOrder - b.sortOrder);
      state.periods = sortedPeriods;
      state.status = 'succeeded';
    },
    setPeriodsStatus: (
      state,
      action: PayloadAction<'idle' | 'loading' | 'succeeded' | 'failed'>
    ) => {
      state.status = action.payload;
    },
    setPeriodsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.status = 'failed';
    },
  },
});

// Export actions
export const {
  setSelectedPeriod,
  setPeriods,
  setPeriodsStatus,
  setPeriodsError,
} = periodSlice.actions;

// Export selectors
export const selectAllPeriods = (state: RootState) => state.periods.periods;
export const selectSelectedPeriod = (state: RootState) => state.periods.selectedPeriod;
export const selectPeriodsStatus = (state: RootState) => state.periods.status;
export const selectPeriodsError = (state: RootState) => state.periods.error;

export default periodSlice.reducer;