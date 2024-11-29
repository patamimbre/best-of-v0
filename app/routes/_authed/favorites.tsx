import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/favorites')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/favorites"!</div>
}
