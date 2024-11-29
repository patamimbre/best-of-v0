import { createFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { createServerFn } from '@tanstack/start'
import { db } from 'db'
import { componentsTable } from 'db/schema';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { ComponentCard } from '~/components/ComponentCard';

const componentsQueryOptions = () => queryOptions({
  queryKey: ['components'],
  queryFn: () => getComponents(),
})

const getComponents = createServerFn().handler(async () => {
  console.log('Fetching components...');
  return await db.select().from(componentsTable);
});



export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(componentsQueryOptions());
  },
  pendingComponent: () => <div>Loading...</div>,
  component: Home,
})

function Home() {
  const { data: components } = useSuspenseQuery(componentsQueryOptions());
  return (
    <main className="p-8 space-y-4">
      <div className="flex flex-wrap justify-center items-center gap-8">
        {components.map((component) => (
          <ComponentCard key={component.id} component={component} />
        ))}
      </div>
    </main>
  )
}
