import { QueryClient } from "react-query";

const queryClientSettings = {
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      cacheTime: 60000,
      refetchInterval: 3.6e6, 
      refetchIntervalInBackground: true,
      suspense: false,
      staleTime: Infinity,
    },
    mutations: {
      retry: 2,
    },
  },
};

export const queryClient = new QueryClient(queryClientSettings);