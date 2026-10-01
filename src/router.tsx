import { QueryClient, QueryClientProvider, dehydrate, hydrate } from "@tanstack/react-query";
import { createRouter, isRedirect, type AnyRouter, type Redirect } from "@tanstack/react-router";
import { Fragment, type ReactNode, type ComponentType } from "react";
import { routeTree } from "./routeTree.gen";

/**
 * Local port of @tanstack/react-router-with-query's routerWithQueryClient,
 * rewritten for the current router API (options.dehydrate / options.hydrate /
 * options.Wrap) after the package stopped tracking the router version.
 */
function routerWithQueryClient(router: AnyRouter, queryClient: QueryClient) {
  const ogOptions = router.options;

  router.options = {
    ...ogOptions,
    Wrap: ({ children }: { children?: ReactNode }) => {
      const OGWrap = (ogOptions.Wrap as ComponentType<{ children?: ReactNode }> | undefined) || Fragment;
      return (
        <QueryClientProvider client={queryClient}>
          <OGWrap>{children}</OGWrap>
        </QueryClientProvider>
      );
    },
    dehydrate: async () => {
      const ogDehydrated = await (ogOptions.dehydrate as (() => Promise<unknown> | unknown) | undefined)?.();
      return {
        ...(ogDehydrated as object | undefined),
        dehydratedQueryClient: dehydrate(queryClient, {
          shouldDehydrateQuery: (query) => query.state.status === "success",
          shouldDehydrateMutation: () => false,
        }),
      };
    },
    hydrate: async (dehydrated: unknown) => {
      await (ogOptions.hydrate as ((d: unknown) => Promise<void> | void) | undefined)?.(dehydrated);
      const dehydratedQueryClient = (dehydrated as { dehydratedQueryClient?: unknown } | undefined)
        ?.dehydratedQueryClient;
      if (dehydratedQueryClient) {
        hydrate(queryClient, dehydratedQueryClient as never);
      }
    },
  };

  // Preserve the adapter's redirect-on-error behavior: thrown redirects from
  // queries/mutations navigate instead of surfacing as errors.
  const ogMutationCacheConfig = queryClient.getMutationCache().config;
  queryClient.getMutationCache().config = {
    ...ogMutationCacheConfig,
    onError: (error: unknown) => {
      if (isRedirect(error)) {
        const redirect = error as Redirect;
        redirect.options._fromLocation = router.state.location;
        return router.navigate(router.resolveRedirect(error).options);
      }
      return ogMutationCacheConfig.onError?.(error as never);
    },
  };
  const ogQueryCacheConfig = queryClient.getQueryCache().config;
  queryClient.getQueryCache().config = {
    ...ogQueryCacheConfig,
    onError: (error: unknown) => {
      if (isRedirect(error)) {
        const redirect = error as Redirect;
        redirect.options._fromLocation = router.state.location;
        return router.navigate(router.resolveRedirect(error).options);
      }
      return ogQueryCacheConfig.onError?.(error as never);
    },
  };

  return router;
}

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
