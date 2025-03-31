import { createSlice, PayloadAction, createSelector, Draft } from '@reduxjs/toolkit';
import { Mech } from '../../types/mech';
import { RootState } from '../index';

interface MechState {
  mechs: Mech[];
  selectedMech: Mech | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: {
    technology?: string;
    era?: string;
    tonnageMin?: number;
    tonnageMax?: number;
    searchTerm: string;
  };
}

const initialState: MechState = {
  mechs: [],
  selectedMech: null,
  status: 'idle',
  error: null,
  filters: {
    searchTerm: '',
  },
};

const mechSlice = createSlice({
  name: 'mechs',
  initialState,
  reducers: {
    setSelectedMech: (state, action: PayloadAction<Mech | null>) => {
      state.selectedMech = action.payload;
    },
    setMechs: (state, action: PayloadAction<Mech[]>) => {
      state.mechs = action.payload;
      state.status = 'succeeded';
    },
    setMechsStatus: (
      state,
      action: PayloadAction<'idle' | 'loading' | 'succeeded' | 'failed'>
    ) => {
      state.status = action.payload;
    },
    setMechsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.status = 'failed';
    },
    setFilter: <K extends keyof MechState['filters']>(
      state: Draft<MechState>,
      action: PayloadAction<{ 
        key: K; 
        value: MechState['filters'][K]
      }>
    ) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    clearFilters: (state) => {
      state.filters = {
        searchTerm: '',
      };
    },
  },
});

// Export actions
export const {
  setSelectedMech,
  setMechs,
  setMechsStatus,
  setMechsError,
  setFilter,
  clearFilters,
} = mechSlice.actions;

// Export selectors
export const selectAllMechs = (state: RootState) => state.mechs.mechs;
export const selectSelectedMech = (state: RootState) => state.mechs.selectedMech;
export const selectMechsStatus = (state: RootState) => state.mechs.status;
export const selectMechsError = (state: RootState) => state.mechs.error;
export const selectMechFilters = (state: RootState) => state.mechs.filters;

// Define a memoized selector for filtered mechs
export const selectFilteredMechs = createSelector(
  [
    (state: RootState) => state.mechs.mechs,
    (state: RootState) => state.mechs.filters
  ],
  (mechs, filters) => {
    const { technology, era, tonnageMin, tonnageMax, searchTerm } = filters;
    
    return mechs.filter((mech) => {
      // Apply technology filter
      if (technology && mech.technology !== technology) return false;
      
      // Apply era filter
      if (era && mech.era !== era) return false;
      
      // Apply tonnage filter
      if (tonnageMin && mech.tonnage < tonnageMin) return false;
      if (tonnageMax && mech.tonnage > tonnageMax) return false;
      
      // Apply search term filter (case insensitive)
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          mech.name.toLowerCase().includes(term) ||
          mech.chassis.toLowerCase().includes(term) ||
          mech.designer?.toLowerCase().includes(term) ||
          false
        );
      }
      
      return true;
    });
  }
);

export default mechSlice.reducer;