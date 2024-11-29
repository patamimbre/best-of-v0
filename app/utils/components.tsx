import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/start'
import { db } from 'db'
import { componentsTable } from 'db/schema'

export const getComponents = createServerFn({ method: 'GET' }).handler(
  async () => {
    return await db.select().from(componentsTable)
  },
)

export const componentsQueryOptions = () =>
  queryOptions({
    queryKey: ['components'],
    queryFn: () => getComponents(),
  })
