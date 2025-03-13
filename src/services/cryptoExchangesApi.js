import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const cryptoExchangesApi = createApi({
  reducerPath: 'cryptoExchangesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.coingecko.com/api/v3' }),
  endpoints: (builder) => ({
    getExchanges: builder.query({
      query: () => '/exchanges', // Fetches all exchanges
    }),
  }),
});

export const { useGetExchangesQuery } = cryptoExchangesApi;
