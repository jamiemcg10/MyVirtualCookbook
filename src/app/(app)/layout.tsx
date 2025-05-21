'use client'
import Session from '../utils/Session'
import Header from '../ui/Header'
import { PropsWithChildren } from 'react'

export default function App({ children }: PropsWithChildren) {
  return (
    <Session>
      <Header />
      {children}
    </Session>
  )
}
