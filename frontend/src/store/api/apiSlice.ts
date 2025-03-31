import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { Mech, RawMech } from '../../types/mech';
import { Mech, RawMech, ImportResult } from '../../types/mech';
import { Faction } from '../../types/faction';
import { Period } from '../../types/period';
import { MechAvailability } from '../../types/availability';

// Define a service using a base URL and expected endpoints
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
  tagTypes: ['Mech', 'Faction', 'Period', 'MechAvailability'],
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
    createMech: builder.mutation<Mech, Partial<Mech>>({
      query: (mech) => ({
        url: '/mechs',
        method: 'POST',
        body: mech,
      }),
      invalidatesTags: [{ type: 'Mech', id: 'LIST' }],
    }),
    updateMech: builder.mutation<Mech, Partial<Mech> & { id: string }>({
      query: ({ id, ...mech }) => ({
        url: `/mechs/${id}`,
        method: 'PUT',
        body: mech,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Mech', id }],
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
    importCsv: builder.mutation<ImportResult | { mechs: RawMech[] }, FormData>({
        query: (formData) => ({
          url: '/import/mechs/csv', // путь соответствует вашему бэкенд контроллеру
          method: 'POST',
          body: formData,
        }),
        invalidatesTags: [{ type: 'Mech', id: 'LIST' }],
      }),
    exportCsv: builder.query<Blob, void>({
      query: () => ({
        url: '/csv/export',
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetMechsQuery,
  useGetMechByIdQuery,
  useCreateMechMutation,
  useUpdateMechMutation,
  useGetFactionsQuery,
  useGetActiveFactionsQuery,
  useGetMajorFactionsQuery,
  useGetPeriodsQuery,
  useGetMechAvailabilitiesQuery,
  useImportCsvMutation,
  useExportCsvQuery,
} = apiSlice;