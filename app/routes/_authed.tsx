import * as React from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { getAuth } from '@clerk/tanstack-start/server'
import { createServerFn } from '@tanstack/start'
import { getWebRequest } from 'vinxi/http'

const authStateFn = createServerFn({ method: 'GET' }).handler(async () => {
  const { userId } = await getAuth(getWebRequest())

  if (!userId) {
    // This will error because you're redirecting to a path that doesn't exist yet
    // You can create a sign-in route to handle this
    throw redirect({
      to: '/',
    })
  }

  return { userId }
})

export const Route = createFileRoute('/_authed')({
  beforeLoad: async () => await authStateFn(),
})