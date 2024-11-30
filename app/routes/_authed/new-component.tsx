import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import ComponentForm from '~/components/ComponentForm'
import { createComponent, createComponentMutation, createComponentSchema } from '~/utils/components'
import { z } from 'zod'

export const Route = createFileRoute('/_authed/new-component')({
  component: NewComponent,
})

function NewComponent() {
  const { mutate, isPending } = createComponentMutation();

  // TODO: Remove this. It's just for testing.
  const prevData = {
    name: "Test Component",
    description: "This is a test component",
    developer: "Test Developer",
    imageUrl: "https://via.placeholder.com/150",
    tags: ["test", "component"],
  } satisfies z.infer<typeof createComponentSchema>;

  return <ComponentForm onSubmit={(data) => mutate({ data })} isPending={isPending} initialValues={prevData} />
}
