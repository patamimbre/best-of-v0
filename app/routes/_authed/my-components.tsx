import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/my-components')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/my-components"!</div>
}