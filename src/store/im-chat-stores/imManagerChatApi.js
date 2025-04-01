import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import { getGinzaxiaomaApiUrl } from '../../apis';

const customBaseQuery = async (args, api, extraOptions) => {
  const { getState } = api;
  const state = getState();
  const { baseUrl, authToken } = state.imManagerSettings;
  const url = `${baseUrl}/im-chat/manager${args.url}`;

  const headers = {
    ...args.headers,
    Authorization: authToken,
  };

  return fetchBaseQuery({
    baseUrl: '',
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${authToken}`);
      return headers;
    },
  })(
    {
      ...args,
      url,
      headers,
    },
    api,
    extraOptions
  );
};

export const imManagerChatApi = createApi({
  reducerPath: 'imManagerChatApi',
  baseQuery: retry(customBaseQuery, { maxRetries: 10 }),
  tagTypes: ['CustomerSessions', 'SessionMessages', 'CustomerList'],
  endpoints: (builder) => ({
    getSessions: builder.query({
      query: ({ pageNum, pageSize, pluginKey }) => ({
        url: `/im-chat-list`,
        method: 'GET',
        params: {
          pluginKey,
          pageNum,
          pageSize,
        },
      }),
      providesTags: ['CustomerList'],
    }),

    getCustomerSessions: builder.query({
      query: ({ pluginKey, pageNum, status, pageSize, userId }) => ({
        url: '/im-chat-list',
        method: 'GET',
        params: {
          pluginKey,
          pageNum,
          pageSize,
          userId,
          status,
        },
      }),
      transformResponse: (response) => {
        return response;
      },
      providesTags: ['CustomerSessions'],
      keepUnusedDataFor: 0,
    }),

    getCustomerDetails: builder.query({
      query: ({ id }) => {
        return {
          url: `/im-chat-customer-detail/${id}`,
          method: 'GET',
        };
      },
      keepUnusedDataFor: 0,
    }),

    updateCustomerDetails: builder.mutation({
      query: ({ session, data }) => {
        return {
          url: `/im-chat-customer-detail/${session.id}`,
          method: 'POST',
          body: data,
        };
      },
    }),

    createMessage: builder.mutation({
      query: ({ session, data }) => {
        return {
          url: `/im-chat-send-message/${session.id}`,
          method: 'POST',
          body: data,
        };
      },
    }),

    readChat: builder.mutation({
      query: ({ session }) => {
        if (!session || !session.id) return;
        return {
          url: `/im-chat-read/${session.id}`,
          method: 'POST',
        };
      },
    }),

    uploadAttachment: builder.mutation({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: `/upload-file`,
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
    }),

    createProfile: builder.mutation({
      query: ({ pluginKey, data }) => {
        return {
          url: `/im-channel-profile/${pluginKey}`,
          method: 'POST',
          body: data,
        };
      },
    }),

    getProfileInfo: builder.query({
      query: ({ pluginKey }) => ({
        url: `/im-channel-profile/${pluginKey}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
    }),

    getOfflineMessages: builder.query({
      query: ({ pluginKey }) => ({
        url: `/im-channel-offline-response/${pluginKey}`,
        method: 'GET',
      }),
    }),

    createOfflineMessage: builder.mutation({
      query: ({ pluginKey, data }) => {
        return {
          url: `/im-channel-offline-response/${pluginKey}`,
          method: 'POST',
          body: data,
        };
      },
    }),

    updateOfflineMessage: builder.mutation({
      query: ({ offlineResponseId, data }) => {
        return {
          url: `/im-channel-offline-response/${offlineResponseId}`,
          method: 'PUT',
          body: data,
        };
      },
    }),

    deleteOfflineMessage: builder.mutation({
      query: ({ offlineResponseId }) => {
        return {
          url: `/im-channel-offline-response/${offlineResponseId}`,
          method: 'DELETE',
        };
      },
    }),
  }),
});

export const mediaChatApi = createApi({
  reducerPath: 'mediaChatApi',
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
  tagTypes: ['CustomerSessions', 'SessionMessages', 'CustomerList'],
  endpoints: (builder) => ({
    getMediaUsers: builder.query({
      query: ({ keyword, page, tagIds }) => ({
        url: '/media-users',
        method: 'GET',
        params: {
          query: keyword,
          tagIds,
          page,
          limit: 20,
        },
      }),
      providesTags: ['CustomerList'],
    }),

    getMediaUserSessions: builder.query({
      query: ({ customer, page }) => ({
        url: '/sessions',
        method: 'GET',
        params: {
          customer,
          page,
          limit: 20,
        },
      }),
      providesTags: ['CustomerSessions'],
    }),

    getMediaUserMessages: builder.query({
      query: ({ page, mediaType, session, identifier }) => ({
        url:
          mediaType === 'messenger' || mediaType === 'instagram'
            ? `/${mediaType}/conversation-messages`
            : '/messages',
        method: 'GET',
        params: {
          page,
          limit: 20,
          session,
          identifier,
        },
      }),
      providesTags: ['SessionMessages'],
    }),

    sendMediaUserMessage: builder.mutation({
      query: ({ data, mediaType }) => ({
        url: `/${mediaType}/send-message`,
        method: 'POST',
        body: data,
      }),
      providesTags: ['SessionMessages'],
    }),

    getChatInfoDetails: builder.query({
      query: ({ sessionId }) => ({
        url: `/chat-info/${sessionId}`,
        method: 'GET',
      }),
    }),

    getAllTags: builder.query({
      query: ({ type, isActive }) => ({
        url: '/tags',
        method: 'GET',
        params: {
          type,
          isActive,
        },
      }),
    }),

    getUserTags: builder.query({
      query: ({ userId }) => ({
        url: `/tags/userid/${userId}`,
        method: 'GET',
      }),
    }),

    createTag: builder.mutation({
      query: ({ data }) => ({
        url: '/tags',
        method: 'POST',
        body: data,
      }),
    }),

    updateChatInfo: builder.mutation({
      query: ({ data }) => ({
        url: '/tags/assign',
        method: 'POST',
        body: data,
      }),
    }),

    getSessionMessages: builder.query({
      query: ({ session }) => ({
        url: `/im-chat/manager/im-chat-messages/${session.id}`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [
        { type: 'SessionMessages', id: arg.session.id },
      ],
    }),

    readMediaChat: builder.mutation({
      query: ({ data }) => ({
        url: `/media-users/update-read-status`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetSessionsQuery,
  useCreateMessageMutation,
  useReadChatMutation,
  useUploadAttachmentMutation,
  useGetCustomerSessionsQuery,
  useGetCustomerDetailsQuery,
  useCreateProfileMutation,
  useGetProfileInfoQuery,
  useGetOfflineMessagesQuery,
  useCreateOfflineMessageMutation,
  useUpdateOfflineMessageMutation,
  useDeleteOfflineMessageMutation,
  useUpdateCustomerDetailsMutation,
} = imManagerChatApi;

export const {
  useGetMediaUsersQuery,
  useGetMediaUserSessionsQuery,
  useGetMediaUserMessagesQuery,
  useSendMediaUserMessageMutation,
  useGetChatInfoDetailsQuery,
  useGetAllTagsQuery,
  useUpdateChatInfoMutation,
  useGetSessionMessagesQuery,
  useCreateTagMutation,
  useReadMediaChatMutation,
  useGetUserTagsQuery,
} = mediaChatApi;

export const imOfflineResponseAPi = createApi({
  reducerPath: 'offlineResponseApi',
  baseQuery: retry(customBaseQuery, { maxRetries: 10 }),
  tagTypes: ['offlineResponse', 'setting'],

  endpoints: (builder) => ({
    getOfflineResponseMessages: builder.query({
      query: ({ pluginKey }) => {
        return {
          url: `/im-channel-offline-response/${pluginKey}`,
          method: 'GET',
        };
      },
      providesTags: ['offlineResponse'],
    }),

    searchOfflineResponseMessages: builder.query({
      query: ({ pluginKey, language, keyword, createdAt, status }) => {
        return {
          url: `/search-offline-responses/?pluginKey=${pluginKey}&language=${language}&keyword=${keyword}&createdAt=${createdAt}&status=${status}`,
          method: 'GET',
        };
      },
      providesTags: ['offlineResponse'],
    }),

    createOfflineResponseMessage: builder.mutation({
      query: ({ pluginKey, data }) => {
        return {
          url: `/im-channel-offline-response/${pluginKey}`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['offlineResponse'],
    }),

    updateOfflineResponseMessage: builder.mutation({
      query: ({ offlineResponseId, data }) => {
        return {
          url: `/im-channel-offline-response/${offlineResponseId}`,
          method: 'PATCH',
          body: data,
        };
      },
      invalidatesTags: ['offlineResponse'],
    }),

    deleteOfflineResponseMessage: builder.mutation({
      query: ({ offlineResponseId }) => {
        return {
          url: `/im-channel-offline-response/${offlineResponseId}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['offlineResponse'],
    }),

    // setting
    createSettingProfile: builder.mutation({
      query: ({ pluginKey, data }) => {
        return {
          url: `/im-channel-profile/${pluginKey}`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['setting'],
    }),

    getSettingProfileInfo: builder.query({
      query: ({ pluginKey }) => ({
        url: `/im-channel-profile/${pluginKey}`,
        method: 'GET',
      }),
      providesTags: ['setting'],
    }),
  }),
});

export const {
  useGetOfflineResponseMessagesQuery,
  useCreateOfflineResponseMessageMutation,
  useUpdateOfflineResponseMessageMutation,
  useDeleteOfflineResponseMessageMutation,
  useSearchOfflineResponseMessagesQuery,
  useCreateSettingProfileMutation,
  useGetSettingProfileInfoQuery,
} = imOfflineResponseAPi;
