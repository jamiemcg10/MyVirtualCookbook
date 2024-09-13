'use client'
import { useState } from 'react'
import Session from '../utils/Session'
import Header from '../ui/Header'

interface AppProps {
  children: any
}

export default function App({ children }: AppProps) {
  const [user, setUser] = useState(undefined)

  return (
    <Session session={user} setSession={setUser}>
      <Header />
      {children}
    </Session>
  )
}
