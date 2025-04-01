import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getGinzaxiaomaApiUrl } from '../../apis';

export const integrationSettingsApi = createApi({
  reducerPath: 'integrationSettingsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getGinzaxiaomaApiUrl(),
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('LOCAL_STORAGE_TOKEN_KEY');

      if (token) {
        headers.set('Authorization', token);
      }

      return headers;
    },
  }),
  tagTypes: ['IntegrationSettings'],
  endpoints: (builder) => ({
    getIntegrationSettings: builder.query({
      query: ({ name }) => ({
        url: `/integration-settings?name=${name}`,
        method: 'GET',
      }),
      providesTags: ['IntegrationSettings'],
    }),

    updateIntegrationSettings: builder.mutation({
      query: (data) => ({
        url: `/integration-settings`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['IntegrationSettings'],
    }),
  }),
});

export const {
  useGetIntegrationSettingsQuery,
  useUpdateIntegrationSettingsMutation,
} = integrationSettingsApi;
