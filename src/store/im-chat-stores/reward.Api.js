import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const rewardApi = createApi({
  reducerPath: 'rewardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_IM_CHAT_BASE_API,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('LOCAL_STORAGE_TOKEN_KEY');

      if (token) {
        headers.set('Authorization', token);
      }

      return headers;
    },
  }),
  tagTypes: ['Reward'],
  endpoints: (builder) => ({
    getRewards: builder.query({
      query: ({ keyword, status, type, applicableFor, pageNum, pageSize }) => {
        const params = new URLSearchParams({
          keyword,
          ...(status ? { status } : {}),
          ...(type ? { type } : {}),
          ...(applicableFor ? { applicableFor } : {}),
        });

        if (pageNum) params.append('pageNum', pageNum.toString());
        if (pageSize) params.append('pageSize', pageSize.toString());

        return {
          url: `/rewards?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Reward'],
    }),
    getRewardDetails: builder.query({
      query: (id) => ({
        url: `/rewards/${id}`,
        method: 'GET',
      }),
      providesTags: ['Reward'],
    }),
    createReward: builder.mutation({
      query: (data) => ({
        url: '/rewards',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Reward'],
    }),
    updateReward: builder.mutation({
      query: ({ id, data }) => ({
        url: `/rewards/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Reward'],
    }),
    getRewardPoints: builder.query({
      query: ({ keyword, id }) => ({
        url: `/admin/umsMember/points-availed/${id}?keyword=${keyword}`,
        method: 'GET',
      }),
      providesTags: ['Reward'],
    }),
  }),
});

export const {
  useGetRewardsQuery,
  useGetRewardDetailsQuery,
  useCreateRewardMutation,
  useUpdateRewardMutation,
  useGetRewardPointsQuery,
} = rewardApi;
