import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_KEY = '3CrxswCvKY5MP7XAmacAm1nD9fKMUgJsmybuwgVEeJE=';

export const cryptoNewsApi = createApi({
  reducerPath: 'cryptoNewsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://openapiv1.coinstats.app',  // ✅ Corrected Base URL
    prepareHeaders: (headers) => {
      headers.set('X-API-KEY', API_KEY); // ✅ API Key
      headers.set('accept', 'application/json'); // ✅ Accept Header
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCryptoNews: builder.query({
      query: ({ count }) => `/news?limit=${count}`,
    }),
  }),
});

export const { useGetCryptoNewsQuery } = cryptoNewsApi;
