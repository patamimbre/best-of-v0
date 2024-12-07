import { z } from "zod";

export const orderByOptions = [
  { name: "newest", label: "Newest" },
  { name: "oldest", label: "Oldest" },
  { name: "popular", label: "Most Popular" },
];

export const filterByOptions = [
  { name: "all", label: "All" },
  { name: "favorites", label: "Favorites" },
];

export const orderBySchema = z.enum(
  orderByOptions.map((o) => o.name) as [string, ...string[]]
);

export const filterBySchema = z.enum(
  filterByOptions.map((o) => o.name) as [string, ...string[]]
);

export const searchComponentsSchema = z.object({
  q: z.string().optional().describe("Search query").default(""),
  orderBy: orderBySchema.optional().describe("Order by").catch("newest").default("newest"),
  filterBy: filterBySchema.optional().describe("Filter by").catch("all").default("all"),
});

export type SearchParams = z.infer<typeof searchComponentsSchema>;
