import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

export const couponApi = createApi({
  reducerPath: 'couponApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_IM_CHAT_BASE_API}/coupons`,
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
  tagTypes: ['coupon'],

  endpoints: (builder) => ({
    // get coupon
    getCoupon: builder.query({
      query: ({ keyword, status, applicable, pageNum, pageSize }) => {
        const params = new URLSearchParams();

        if (status) params.append('status', status);
        if (keyword) params.append('keyword', keyword);
        if (applicable) params.append('applicable', applicable);
        if (pageNum) params.append('pageNum', pageNum.toString());
        if (pageSize) params.append('pageSize', pageSize.toString());
        return {
          url: `/list?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['coupon'],
    }),

    // create coupon
    createCoupon: builder.mutation({
      query: ({ data }) => {
        return {
          url: `/create`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['coupon'],
    }),

    // update push coupon
    updateCoupon: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/${id}`,
          method: 'PATCH',
          body: data,
        };
      },
      invalidatesTags: ['coupon'],
    }),
  }),
});

export const {
  useCreateCouponMutation,
  useGetCouponQuery,
  useUpdateCouponMutation,
} = couponApi;
