import * as React from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query';
import ComponentForm from '~/components/ComponentForm';
import { componentBelongsToUser } from '~/functions/component';
import { getComponentQueryOptions } from '~/hooks/queries';
import { useUpdateComponentMutation } from '~/hooks/mutations';

export const Route = createFileRoute('/_authed/edit/component/$id')({
  beforeLoad: async ({ params: { id } }) => {
    const belongsToUser = await componentBelongsToUser({ data: { id } });
    if (!belongsToUser) {
      throw redirect({ to: "/my-components" });
    }
  },
  loader: async ({ params: { id }, context: { queryClient } }) => {
    await queryClient.prefetchQuery(getComponentQueryOptions(id));
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams();
  const { data: component } = useSuspenseQuery(getComponentQueryOptions(Route.useParams().id));
  const { mutate: updateComponent, isPending } = useUpdateComponentMutation();

  return <ComponentForm
    initialValues={component}
    onSubmit={(values) => updateComponent({ data: { id, ...values } })}
    isPending={isPending}
  />
}
