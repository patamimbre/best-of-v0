import { componentBelongsToUser, getComponent, getUserComponents } from "~/functions/component";

import { queryOptions } from "@tanstack/react-query";
import { getComponents } from "~/functions/component";
import { SearchParams } from "~/types/search";

export const componentsQueryOptions = (params: SearchParams) =>
  queryOptions({
    queryKey: ["components", params],
    // TODO: Optimize by storing each component in the query cache individually (and then invalidate just that component on favorite toggle)
    queryFn: () => getComponents({ data: params }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

export const userComponentsQueryOptions = () =>
  queryOptions({
    queryKey: ["components", "user"],
    queryFn: () => getUserComponents(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

export const getComponentQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["components", id],
    queryFn: () => getComponent({ data: { id } }),
  });