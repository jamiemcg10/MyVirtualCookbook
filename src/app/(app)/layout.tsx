'use client'
import { useContext, useEffect, useState } from 'react'
import { initializeFirebase } from '../utils/firebase'
import Session, { SessionContext } from '../utils/Session'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

interface AppProps {
  children: any
}

export default function App({ children }: AppProps) {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    console.log({ user })
    if (user) {
      console.log('there is a user') // redirect if home or at login not at about page
      //   window.location.href = '/cookbook'
    }
  }, [user])

  console.log({ user })
  console.log('heres a layout')

  return (
    <Session session={user} setSession={setUser}>
      {children}
    </Session>
  )
}
