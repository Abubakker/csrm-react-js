import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { getImChatBaseUrl } from 'apis/im-chat';

export const pushNotificationAPi = createApi({
  reducerPath: 'pushNotificationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getImChatBaseUrl()}/notifications`,
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
  tagTypes: ['pushNotification'],

  endpoints: (builder) => ({
    // get push notification
    getpushNotification: builder.query({
      query: ({
        status,
        creationDate,
        language,
        keyword,
        pushDate,
        messageType,
      }) => {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (creationDate) params.append('creationDate', creationDate);
        if (language) params.append('language', language);
        if (keyword) params.append('keyword', keyword);
        if (pushDate) params.append('pushDate', pushDate);
        if (messageType) params.append('messageType', messageType);

        return {
          url: `/get-notifications?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['pushNotification'],
    }),

    getPushNotificationDetails: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: 'GET',
      }),
      providesTags: ['pushNotification'],
    }),

    // create push notification
    createpushNotification: builder.mutation({
      query: ({ data }) => {
        return {
          url: `/`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['pushNotification'],
    }),
    updatePushnotification: builder.mutation({
      query: ({ data, id }) => {
        return {
          url: `/update/${id}`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['pushNotification'],
    }),
    // status update
    updatePushnotificationStatus: builder.mutation({
      query: ({ data }) => {
        return {
          url: `/update/status`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: ['pushNotification'],
    }),
  }),
});

export const {
  useGetpushNotificationQuery,
  useGetPushNotificationDetailsQuery,
  useCreatepushNotificationMutation,
  useUpdatePushnotificationMutation,
  useUpdatePushnotificationStatusMutation,
} = pushNotificationAPi;
