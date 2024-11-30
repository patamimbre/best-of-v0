import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/edit/component/$id')({

  // TODO(verify the component exists and belongs to the user on preload)


  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed/edit/component/$id"!</div>
}
