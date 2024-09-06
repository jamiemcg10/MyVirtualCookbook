'use client'

import { useEffect, createContext } from 'react'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { initializeFirebase } from './firebase'

interface SessionProps {
  children: any
  session: any
  setSession: any
}

export const SessionContext = createContext<User | undefined>(undefined)

export default function Session({ children, session, setSession }: SessionProps) {
  initializeFirebase()

  useEffect(() => {
    console.log('using session effect 2')
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log({ user })
        setSession(user)
        console.log({ session })
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid
        // ...
      } else {
        // User is signed out
        // ...
        setSession(undefined)
      }
    })
  }, [])

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
}
