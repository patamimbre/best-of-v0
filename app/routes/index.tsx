import { createFileRoute } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { createServerFn } from "@tanstack/start";
import { db } from "db";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ComponentCard } from "~/components/ComponentCard";
import { zodValidator } from "@tanstack/zod-adapter";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "~/components/ui/select";
import { RegularComponentGrid } from "~/components/ComponentGrid";
import { SignedIn } from "@clerk/tanstack-start";
import { filterByOptions, orderByOptions, searchComponentsSchema } from "~/types/search";
import { componentsQueryOptions } from "~/hooks/queries";
import { Loading } from "~/components/Loading";

export const Route = createFileRoute("/")({
  validateSearch: zodValidator(searchComponentsSchema),
  loaderDeps: ({ search: { q, orderBy, filterBy } }) => ({
    q,
    orderBy,
    filterBy,
  }),
  loader: async ({ context, deps: { q, orderBy, filterBy } }) => {
    await context.queryClient.ensureQueryData(
      componentsQueryOptions({ q, orderBy, filterBy })
    );
  },
  pendingComponent: () => <Loading />,
  component: Home,
});

function Home() {
  const { q, orderBy, filterBy } = Route.useSearch();
  const { data: components } = useSuspenseQuery(
    componentsQueryOptions({ q, orderBy, filterBy })
  );
  return (
    <main className="p-8 space-y-4">
      <SearchForm />
      <RegularComponentGrid components={components} />
    </main>
  );
}

function SearchForm() {
  const navigate = Route.useNavigate();
  const params = Route.useSearch();
  const { q, orderBy, filterBy } = params;

  return (
    <form className="flex gap-2">
      <Input
        className="w-1/4"
        type="search"
        name="q"
        value={q}
        placeholder="Search"
        onChange={(e) => navigate({ search: { ...params, q: e.target.value } })}
      />
      <Select
        name="orderBy"
        value={orderBy}
        onValueChange={(value) =>
          navigate({ search: { ...params, orderBy: value } })
        }
      >
        <SelectTrigger className="w-1/6">
          <SelectValue placeholder="Order by" />
        </SelectTrigger>
        <SelectContent>
          {orderByOptions.map((o) => (
            <SelectItem key={o.name} value={o.name}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <SignedIn>
        <Select
          name="filterBy"
          value={filterBy}
          onValueChange={(value) =>
            navigate({ search: { ...params, filterBy: value } })
          }
        >
          <SelectTrigger className="w-1/6">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            {filterByOptions.map((o) => (
              <SelectItem key={o.name} value={o.name}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SignedIn>
    </form>
  );
}
