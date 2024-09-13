'use client'
import { useEffect, useState } from 'react'
import Session from '../utils/Session'
import Header from '../ui/Header'

interface AppProps {
  children: any
}

export default function App({ children }: AppProps) {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    console.log({ user })
    if (user) {
      console.log('there is a user') // redirect if home or at login not at about page
    }
  }, [user])

  return (
    <Session session={user} setSession={setUser}>
      <Header />
      {children}
    </Session>
  )
}
