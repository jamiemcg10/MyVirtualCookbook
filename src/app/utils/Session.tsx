'use client'

import { useEffect, createContext, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { docData } from 'rxfire/firestore'
import { auth } from './firebase/firebase'
import { users } from './firebase/users'
import { User } from '../lib/types/user'
import { Subscription } from 'rxjs'

interface SessionProps {
  children: any
}

export const SessionContext = createContext<User | undefined>(undefined)

export default function Session({ children }: SessionProps) {
  const [user, setUser] = useState<User | undefined>(undefined)

  useEffect(() => {
    let userSubscription: Subscription = new Subscription()
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        const userRef = users(authUser.uid).getRef()
        userSubscription = docData(userRef, { idField: 'uid' }).subscribe((_user: User) => {
          console.log({ _user })
          setUser(_user)
        })
      } else {
        // User is signed out
        userSubscription.unsubscribe()
        setUser(undefined)
      }
    })

    userSubscription.unsubscribe()
  }, [])

  return <SessionContext.Provider value={user}>{children}</SessionContext.Provider>
}
