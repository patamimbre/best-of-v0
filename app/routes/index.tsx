import { createFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { createServerFn } from '@tanstack/start'
import { db } from 'db'
import { components } from 'db/schema';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { ComponentCard } from '~/components/ComponentCard';
import { componentsQueryOptions, orderByOptions } from '~/utils/components';
import { searchComponentsSchema } from '~/utils/components';
import { zodValidator } from '@tanstack/zod-adapter'
import { Input } from '~/components/ui/input';
import { Select, SelectValue, SelectContent, SelectItem, SelectTrigger } from '~/components/ui/select';

export const Route = createFileRoute('/')({
  validateSearch: zodValidator(searchComponentsSchema),
  loaderDeps: ({ search: { q, orderBy } }) => ({ q, orderBy }),
  loader: async ({ context, deps: { q, orderBy } }) => {
    await context.queryClient.ensureQueryData(componentsQueryOptions({ q, orderBy }));
  },
  pendingComponent: () => <div>Loading...</div>,
  component: Home,
})

function Home() {
  const { q, orderBy } = Route.useSearch();
  const { data: components } = useSuspenseQuery(componentsQueryOptions({ q, orderBy }));
  return (
    <main className="p-8 space-y-4">
      <SearchForm />
      <div className="grid grid-cols-3 gap-8">
        {components.map((component) => (
          <ComponentCard key={component.id} component={component} />
        ))}
      </div>
    </main>
  )
}

function SearchForm() {
  const navigate = Route.useNavigate();
  const params = Route.useSearch();
  const { q, orderBy } = params;

  // TODO: Add debounce
  return (
    <form className="flex gap-2">
      <Input className="w-1/4" type="search" name="q" value={q} placeholder="Search" onChange={(e) => navigate({ search: { ...params, q: e.target.value } })} />
      <Select name="orderBy" value={orderBy} onValueChange={(value) => navigate({ search: { ...params, orderBy: value } })}>
        <SelectTrigger className="w-1/6">
          <SelectValue placeholder="Order by" />
        </SelectTrigger>
        <SelectContent>
          {orderByOptions.map((o) => (
            <SelectItem key={o.name} value={o.name}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </form>
  )
}
