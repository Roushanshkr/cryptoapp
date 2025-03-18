import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_KEY = '3CrxswCvKY5MP7XAmacAm1nD9fKMUgJsmybuwgVEeJE=';

export const cryptoNewsApi = createApi({
  reducerPath: 'cryptoNewsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://openapiv1.coinstats.app',
    prepareHeaders: (headers) => {
      headers.set('X-API-KEY', API_KEY);
      headers.set('accept', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCryptoNews: builder.query({
      query: () => '/news?limit=100', // Fixed at 100, no time filters
    }),
  }),
});

export const { useGetCryptoNewsQuery } = cryptoNewsApi;