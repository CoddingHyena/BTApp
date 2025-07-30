import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from './api/apiSlice';
import mechReducer from './slices/mechSlice';
import factionReducer from './slices/factionSlice';
import periodReducer from './slices/periodSlice';
import availabilityReducer from './slices/availabilitySlice';
import missionReducer from './slices/missionSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    mechs: mechReducer,
    factions: factionReducer,
    periods: periodReducer,
    availabilities: availabilityReducer,
    missions: missionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// Optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;