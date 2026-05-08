import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const iotAPI = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API || '/api/'}`,
    prepareHeaders: (headers, { endpoint }) => {
      // Don't set Content-Type for addSimsAndPlans endpoint (it uses FormData)
      // RTK Query will automatically handle FormData and set Content-Type with boundary
      if (endpoint !== 'addSimsAndPlans') {
        headers.set('Content-Type', 'application/json');
      }
      return headers;
    },
  }),
  endpoints(builder) {
    return {
      fetchEligibleNumbers: builder.query({
        query: (obj) => {
          return {
            url: 'bulk-order/lines/eligible-for-number-change',
            method: 'POST',
            body: obj,
          };
        },
      }),

      fetchNumberChangeHistory: builder.query({
        query: (obj) => {
          return {
            url: 'bulk-order/lines/number-change-history',
            method: 'POST',
            body: obj,
          };
        },
      }),

      fetchOrderHistory: builder.query({
        query: (obj) => {
          return {
            url: `customer-order-history?hash=${obj.hash}&per_page=${obj.perpage}&page=${obj.page}`,
            method: 'GET',
          };
        },
      }),

      fetchBillingHistory: builder.query({
        query: (obj) => {
          return {
            url: `customer-billing-detail?hash=${obj.hash}&per_page=${obj.perpage}&page=${obj.page}&invoice_count=${obj.invoice_count}&credit_count=${obj.credit_count}`,
            method: 'GET',
          };
        },
      }),

      fetchSubscription: builder.query({
        query: (obj) => {
          return {
            url: `customer-subscriptions-detail`,
            method: 'POST',
            body: obj,
          };
        },
      }),

      fetchListOfSims: builder.query({
        query: (obj) => {
          return {
            url: `bulk-order/list-order-sims`,
            method: 'POST',
            body: obj,
          };
        },
      }),

      fetchSims: builder.query({
        query: (obj) => {
          return {
            url: `bulk-order/list-sims`,
            method: 'POST',
            body: obj,
          };
        },
      }),

      fetchPlans: builder.query({
        query: (obj) => {
          return {
            url: `bulk-order/sims-plan-list`,
            method: 'POST',
            body: obj,
          };
        },
      }),

      addSimsAndPlans: builder.mutation({
        query: (formData) => {
          return {
            url: `bulk-order/customer-products/add`,
            method: 'POST',
            body: formData,
            // FormData will be handled correctly - Content-Type won't be set by prepareHeaders for this endpoint
          };
        },
      }),
    };
  },
});

export const {
  useFetchEligibleNumbersQuery,
  useFetchNumberChangeHistoryQuery,
  useFetchOrderHistoryQuery,
  useFetchBillingHistoryQuery,
  useFetchSubscriptionQuery,
  useFetchListOfSimsQuery,
  useFetchSimsQuery,
  useFetchPlansQuery,
  useAddSimsAndPlansMutation,
} = iotAPI;
export { iotAPI };
