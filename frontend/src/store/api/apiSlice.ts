import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { Mech, RawMech } from '../../types/mech';
import { Mech, RawMech, ImportResult, ValidateRawMechDto, CreateMechDto, UpdateMechDto } from '../../types/mech';
import { Faction, CreateFactionDto, UpdateFactionDto } from '../../types/faction';
import { Game, CreateGameDto, UpdateGameDto } from '../../types/game';
import { Period } from '../../types/period';
import { MechAvailability } from '../../types/availability';
import { Mission, CreateMissionDto, UpdateMissionDto } from '../../types/mission';
import { API_BASE_URL } from '../../config/api';

// Define a service using a base URL and expected endpoints
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Получаем токен из localStorage
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Mech', 'RawMech', 'Faction', 'Game', 'Period', 'MechAvailability', 'Mission'],
  endpoints: (builder) => ({
    // Mech endpoints
    getMechs: builder.query<Mech[], void>({
      query: () => '/mechs',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Mech' as const, id })),
              { type: 'Mech', id: 'LIST' },
            ]
          : [{ type: 'Mech', id: 'LIST' }],
    }),
    getMechById: builder.query<Mech, string>({
      query: (id) => `/mechs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Mech', id }],
    }),
    getMechByDbId: builder.query<Mech, number>({
      query: (dbId) => `/mechs/dbid/${dbId}`,
      providesTags: (result, error, dbId) => [{ type: 'Mech', id: dbId.toString() }],
    }),
    createMech: builder.mutation<Mech, CreateMechDto>({
      query: (mech) => ({
        url: '/mechs',
        method: 'POST',
        body: mech,
      }),
      invalidatesTags: [{ type: 'Mech', id: 'LIST' }],
    }),
    updateMech: builder.mutation<Mech, UpdateMechDto & { id: string }>({
      query: ({ id, ...mech }) => ({
        url: `/mechs/${id}`,
        method: 'PATCH',
        body: mech,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Mech', id }],
    }),
    deleteMech: builder.mutation<Mech, string>({
      query: (id) => ({
        url: `/mechs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Mech', id: 'LIST' }],
    }),

    // RawMech endpoints
    getRawMechs: builder.query<RawMech[], void>({
      query: () => '/raw-mechs',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'RawMech' as const, id })),
              { type: 'RawMech', id: 'LIST' },
            ]
          : [{ type: 'RawMech', id: 'LIST' }],
    }),
    getRawMechsValidated: builder.query<RawMech[], void>({
      query: () => '/raw-mechs/validated',
      providesTags: [{ type: 'RawMech', id: 'VALIDATED' }],
    }),
    getRawMechsPending: builder.query<RawMech[], void>({
      query: () => '/raw-mechs/pending',
      providesTags: [{ type: 'RawMech', id: 'PENDING' }],
    }),
    getRawMechById: builder.query<RawMech, string>({
      query: (id) => `/raw-mechs/${id}`,
      providesTags: (result, error, id) => [{ type: 'RawMech', id }],
    }),
    updateRawMech: builder.mutation<RawMech, { id: string; validated?: boolean }>({
      query: ({ id, ...data }) => ({
        url: `/raw-mechs/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'RawMech', id },
        { type: 'RawMech', id: 'LIST' },
        { type: 'RawMech', id: 'VALIDATED' },
        { type: 'RawMech', id: 'PENDING' },
      ],
    }),
    validateRawMech: builder.mutation<{ rawMech: RawMech; mech?: Mech }, { id: string; validated: boolean }>({
      query: ({ id, validated }) => ({
        url: `/raw-mechs/${id}/validate`,
        method: 'PATCH',
        body: { validated },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'RawMech', id },
        { type: 'RawMech', id: 'LIST' },
        { type: 'RawMech', id: 'VALIDATED' },
        { type: 'RawMech', id: 'PENDING' },
        { type: 'Mech', id: 'LIST' },
      ],
    }),
    deleteRawMech: builder.mutation<RawMech, string>({
      query: (id) => ({
        url: `/raw-mechs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'RawMech', id: 'LIST' }],
    }),

    // Faction endpoints
    getFactions: builder.query<Faction[], void>({
      query: () => '/factions',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Faction' as const, id })),
              { type: 'Faction', id: 'LIST' },
            ]
          : [{ type: 'Faction', id: 'LIST' }],
    }),
    getActiveFactions: builder.query<Faction[], void>({
      query: () => '/factions/active',
      providesTags: [{ type: 'Faction', id: 'ACTIVE' }],
    }),
    getMajorFactions: builder.query<Faction[], void>({
      query: () => '/factions/major',
      providesTags: [{ type: 'Faction', id: 'MAJOR' }],
    }),
    getFactionById: builder.query<Faction, string>({
      query: (id) => `/factions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Faction', id }],
    }),
    getFactionByCode: builder.query<Faction, string>({
      query: (code) => `/factions/code/${code}`,
      providesTags: (result, error, code) => [{ type: 'Faction', id: code }],
    }),
    createFaction: builder.mutation<Faction, CreateFactionDto>({
      query: (faction) => ({
        url: '/factions',
        method: 'POST',
        body: faction,
      }),
      invalidatesTags: [{ type: 'Faction', id: 'LIST' }],
    }),
    updateFaction: builder.mutation<Faction, UpdateFactionDto & { id: string }>({
      query: ({ id, ...faction }) => ({
        url: `/factions/${id}`,
        method: 'PATCH',
        body: faction,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Faction', id }],
    }),
    deleteFaction: builder.mutation<Faction, string>({
      query: (id) => ({
        url: `/factions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Faction', id: 'LIST' }],
    }),

    // Game endpoints
    getGames: builder.query<Game[], void>({
      query: () => '/games',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Game' as const, id })),
              { type: 'Game', id: 'LIST' },
            ]
          : [{ type: 'Game', id: 'LIST' }],
    }),
    getActiveGames: builder.query<Game[], void>({
      query: () => '/games/active',
      providesTags: [{ type: 'Game', id: 'ACTIVE' }],
    }),
    getGameById: builder.query<Game, string>({
      query: (id) => `/games/${id}`,
      providesTags: (result, error, id) => [{ type: 'Game', id }],
    }),
    getGameByName: builder.query<Game, string>({
      query: (name) => `/games/name/${name}`,
      providesTags: (result, error, name) => [{ type: 'Game', id: name }],
    }),
    createGame: builder.mutation<Game, CreateGameDto>({
      query: (game) => ({
        url: '/games',
        method: 'POST',
        body: game,
      }),
      invalidatesTags: [{ type: 'Game', id: 'LIST' }],
    }),
    updateGame: builder.mutation<Game, UpdateGameDto & { id: string }>({
      query: ({ id, ...game }) => ({
        url: `/games/${id}`,
        method: 'PATCH',
        body: game,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Game', id }],
    }),
    deleteGame: builder.mutation<Game, string>({
      query: (id) => ({
        url: `/games/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Game', id: 'LIST' }],
    }),

    // Period endpoints
    getPeriods: builder.query<Period[], void>({
      query: () => '/periods',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Period' as const, id })),
              { type: 'Period', id: 'LIST' },
            ]
          : [{ type: 'Period', id: 'LIST' }],
    }),

    // MechAvailability endpoints
    getMechAvailabilities: builder.query<MechAvailability[], void>({
      query: () => '/mech-availability',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'MechAvailability' as const, id })),
              { type: 'MechAvailability', id: 'LIST' },
            ]
          : [{ type: 'MechAvailability', id: 'LIST' }],
    }),

    // CSV import/export endpoints
    // importCsv: builder.mutation<{ mechs: RawMech[] }, FormData>({
    //   query: (formData) => ({
    //     url: '/import/mechs/csv',
    //     method: 'POST',
    //     body: formData,
    //   }),
    //   invalidatesTags: [{ type: 'Mech', id: 'LIST' }],
    // }),
    importCsv: builder.mutation<ImportResult, FormData>({
        query: (formData) => ({
          url: '/import/mechs/csv',
          method: 'POST',
          body: formData,
        }),
        invalidatesTags: [{ type: 'RawMech', id: 'LIST' }, { type: 'RawMech', id: 'PENDING' }],
      }),
    exportCsv: builder.query<Blob, void>({
      query: () => ({
        url: '/csv/export',
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Mission endpoints
    getMissions: builder.query<Mission[], void>({
      query: () => '/missions',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Mission' as const, id })),
              { type: 'Mission', id: 'LIST' },
            ]
          : [{ type: 'Mission', id: 'LIST' }],
    }),
    getMissionById: builder.query<Mission, string>({
      query: (id) => `/missions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Mission', id }],
    }),
    getMissionByCode: builder.query<Mission, string>({
      query: (code) => `/missions/code/${code}`,
      providesTags: (result, error, code) => [{ type: 'Mission', id: code }],
    }),
    getActiveMissions: builder.query<Mission[], void>({
      query: () => '/missions/active',
      providesTags: [{ type: 'Mission', id: 'ACTIVE' }],
    }),
    createMission: builder.mutation<Mission, CreateMissionDto>({
      query: (mission) => ({
        url: '/missions',
        method: 'POST',
        body: mission,
      }),
      invalidatesTags: [{ type: 'Mission', id: 'LIST' }],
    }),
    updateMission: builder.mutation<Mission, UpdateMissionDto & { id: string }>({
      query: ({ id, ...mission }) => ({
        url: `/missions/${id}`,
        method: 'PATCH',
        body: mission,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Mission', id }],
    }),
    deleteMission: builder.mutation<Mission, string>({
      query: (id) => ({
        url: `/missions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Mission', id: 'LIST' }],
    }),

    // Mission image upload endpoint
    uploadMissionImage: builder.mutation<{ success: boolean; filename: string; url: string; message: string }, FormData>({
      query: (formData) => ({
        url: '/missions/upload/deployment-image',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetMechsQuery,
  useGetMechByIdQuery,
  useGetMechByDbIdQuery,
  useCreateMechMutation,
  useUpdateMechMutation,
  useDeleteMechMutation,
  useGetRawMechsQuery,
  useGetRawMechsValidatedQuery,
  useGetRawMechsPendingQuery,
  useGetRawMechByIdQuery,
  useUpdateRawMechMutation,
  useValidateRawMechMutation,
  useDeleteRawMechMutation,
  useGetFactionsQuery,
  useGetActiveFactionsQuery,
  useGetMajorFactionsQuery,
  useGetFactionByIdQuery,
  useGetFactionByCodeQuery,
  useCreateFactionMutation,
  useUpdateFactionMutation,
  useDeleteFactionMutation,
  useGetGamesQuery,
  useGetActiveGamesQuery,
  useGetGameByIdQuery,
  useGetGameByNameQuery,
  useCreateGameMutation,
  useUpdateGameMutation,
  useDeleteGameMutation,
  useGetPeriodsQuery,
  useGetMechAvailabilitiesQuery,
  useImportCsvMutation,
  useExportCsvQuery,
  useGetMissionsQuery,
  useGetMissionByIdQuery,
  useGetMissionByCodeQuery,
  useGetActiveMissionsQuery,
  useCreateMissionMutation,
  useUpdateMissionMutation,
  useDeleteMissionMutation,
  useUploadMissionImageMutation,
} = apiSlice;