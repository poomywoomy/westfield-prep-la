import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { routeTree } from "./routeTree.gen";


export const getRouter = () => {
  // Ported from the pre-migration App.tsx QueryClient configuration.
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes - reduce refetches
        gcTime: 30 * 60 * 1000, // 30 minutes - keep cache longer
        refetchOnWindowFocus: false, // Don't refetch on tab switch
        retry: 1, // Single retry instead of 3
        refetchOnReconnect: "always",
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  // Dehydrates/hydrates the query cache across SSR so loader-fetched data
  // (e.g. blog posts) renders in the server HTML.
  return routerWithQueryClient(router, queryClient);
};

