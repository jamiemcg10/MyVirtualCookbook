'use client'

import React from 'react'

export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  console.log('auth layout')

  return <>{children}</>
}
