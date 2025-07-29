import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Mission } from '../../types/mission';
import { RootState } from '../index';

interface MissionState {
  missions: Mission[];
  selectedMission: Mission | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: MissionState = {
  missions: [],
  selectedMission: null,
  status: 'idle',
  error: null,
};

const missionSlice = createSlice({
  name: 'missions',
  initialState,
  reducers: {
    setSelectedMission: (state, action: PayloadAction<Mission | null>) => {
      state.selectedMission = action.payload;
    },
    setMissions: (state, action: PayloadAction<Mission[]>) => {
      state.missions = action.payload;
      state.status = 'succeeded';
    },
    setMissionsStatus: (
      state,
      action: PayloadAction<'idle' | 'loading' | 'succeeded' | 'failed'>
    ) => {
      state.status = action.payload;
    },
    setMissionsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.status = 'failed';
    },
    addMission: (state, action: PayloadAction<Mission>) => {
      state.missions.push(action.payload);
    },
    updateMission: (state, action: PayloadAction<Mission>) => {
      const index = state.missions.findIndex(mission => mission.id === action.payload.id);
      if (index !== -1) {
        state.missions[index] = action.payload;
      }
    },
    removeMission: (state, action: PayloadAction<string>) => {
      state.missions = state.missions.filter(mission => mission.id !== action.payload);
    },
  },
});

// Export actions
export const {
  setSelectedMission,
  setMissions,
  setMissionsStatus,
  setMissionsError,
  addMission,
  updateMission,
  removeMission,
} = missionSlice.actions;

// Export selectors
export const selectAllMissions = (state: RootState) => state.missions.missions;
export const selectSelectedMission = (state: RootState) => state.missions.selectedMission;
export const selectMissionsStatus = (state: RootState) => state.missions.status;
export const selectMissionsError = (state: RootState) => state.missions.error;

// Define a memoized selector for official missions
export const selectOfficialMissions = (state: RootState) => {
  return state.missions.missions.filter(mission => mission.isOfficial);
};

// Define a memoized selector for custom missions
export const selectCustomMissions = (state: RootState) => {
  return state.missions.missions.filter(mission => !mission.isOfficial);
};

export default missionSlice.reducer; 