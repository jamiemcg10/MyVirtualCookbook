'use client'

import { useEffect, createContext } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from './firebase/firebase'

interface SessionProps {
  children: any
  session: any
  setSession: any
}

export const SessionContext = createContext<User | undefined>(undefined)

export default function Session({ children, session, setSession }: SessionProps) {
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log({ user })
        setSession(user)
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
      } else {
        // User is signed out
        setSession(undefined)
      }
    })
  }, [])

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
}
