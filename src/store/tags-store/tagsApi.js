import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getGinzaxiaomaApiUrl } from '../../apis';

export const tagsApi = createApi({
  reducerPath: 'tagsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getGinzaxiaomaApiUrl()}/tags`,
    prepareHeaders: (headers) => {
      // Get the token from localStorage
      const token = localStorage.getItem('LOCAL_STORAGE_TOKEN_KEY');

      if (token) {
        // Add the Authorization header with the token
        headers.set('Authorization', token);
      }

      return headers;
    },
  }),
  tagTypes: ['tags'],
  endpoints: (builder) => ({
    getTags: builder.query({
      query: ({ type }) => `/?type=${type}&isActive=true`,
      providesTags: ['tags'],
    }),
    createTag: builder.mutation({
      query: (data) => ({
        url: `/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['tags'],
    }),
    searchTags: builder.query({
      query: ({ keyword, type }) =>
        `/tag-statistics?keyword=${keyword}&type=${type}`,
      providesTags: ['tags'],
    }),
    updateTag: builder.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['tags'],
    }),
  }),
});

export const {
  useGetTagsQuery,
  useCreateTagMutation,
  useSearchTagsQuery,
  useUpdateTagMutation,
} = tagsApi;
