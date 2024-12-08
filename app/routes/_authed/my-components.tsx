import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query';
import { userComponentsQueryOptions } from '~/hooks/queries';
import { MyComponentsGrid } from '~/components/ComponentGrid';
import { Button } from '~/components/ui/button';
import { Loading } from '~/components/Loading';

export const Route = createFileRoute('/_authed/my-components')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      userComponentsQueryOptions()
    );
  },
  pendingComponent: () => <Loading />,
  component: RouteComponent,
})

function RouteComponent() {
  const { data: components } = useSuspenseQuery(userComponentsQueryOptions());

  if (!components.length) {
    return <div className="flex flex-col items-center justify-center h-1/2 gap-6">
      <p className="text-4xl font-semibold">No components found</p>
      <p className="text-2xl text-gray-500">Create a component to get started</p>
      <Link to="/new-component">
        <Button size="lg">Create Component</Button>
      </Link>
    </div>
  }

  return <MyComponentsGrid components={components} />
}
