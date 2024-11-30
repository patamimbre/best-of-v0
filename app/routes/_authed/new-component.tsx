import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import ComponentForm from '~/components/ComponentForm'
import { createComponentMutation } from '~/utils/components'

export const Route = createFileRoute('/_authed/new-component')({
  component: NewComponent,
})

function NewComponent() {
  const { mutate, isPending } = createComponentMutation();
  return <ComponentForm onSubmit={(data) => mutate({ data })} isPending={isPending} />
}
