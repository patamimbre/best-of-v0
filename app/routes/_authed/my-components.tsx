import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query';
import { userComponentsQueryOptions } from '~/hooks/queries';
import { MyComponentsGrid } from '~/components/ComponentGrid';

export const Route = createFileRoute('/_authed/my-components')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      userComponentsQueryOptions()
    );
  },
  pendingComponent: () => <div>Loading...</div>,
  component: RouteComponent,
})

function RouteComponent() {
  const { data: components } = useSuspenseQuery(userComponentsQueryOptions());

  // TODO(BES-41): Add a nice empty state
  if (!components.length) {
    return <div>No components found</div>
  }

  return <MyComponentsGrid components={components} />
}
