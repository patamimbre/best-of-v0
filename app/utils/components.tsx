import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/start'
import { db } from 'db'
import { componentsTable } from 'db/schema'
import { asc, desc, like, or } from 'drizzle-orm'
import { z } from 'zod'
import { match, P } from 'ts-pattern';

export const orderByOptions = [
  { name: 'newest', label: 'Newest' },
  { name: 'oldest', label: 'Oldest' },
  { name: 'popular', label: 'Most Popular' },
]

const orderBySchema = z.enum(orderByOptions.map((o) => o.name) as [string, ...string[]])
export const searchComponentsSchema = z.object({
  q: z.string().optional().describe('Search query'),
  orderBy: orderBySchema.optional().describe('Order by').catch('newest'),
})
type SearchParams = z.infer<typeof searchComponentsSchema>

export const componentsQueryOptions = (params: SearchParams) => queryOptions({
  queryKey: ['components', params],
  queryFn: () => getComponents({ data: params }),
})

const getComponents = createServerFn()
  .validator((data?: SearchParams) => searchComponentsSchema.parse(data))
  .handler(async ({ data: { q, orderBy } }) => {
    return await db.select().from(componentsTable).where(
      q && q.length > 0 ?
        or(
          like(componentsTable.name, `%${q}%`),
          like(componentsTable.description, `%${q}%`),
          like(componentsTable.developer, `%${q}%`),
        )
      : undefined
    ).orderBy(
      match(orderBy)
        .with('newest', () => desc(componentsTable.createdAt))
        .with('oldest', () => asc(componentsTable.createdAt))
        // TODO: Implement sorting by popularity
        // .with('popular', () => desc(componentsTable.views))
        .otherwise(() => desc(componentsTable.createdAt))
    )
  });

