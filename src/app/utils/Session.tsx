'use client'

import { useEffect, createContext, useState, PropsWithChildren } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { docData } from 'rxfire/firestore'
import { auth } from './firebase/firebase'
import { users } from './firebase/users'
import { User } from '../lib/types'
import { Subscription } from 'rxjs'
import { DocumentData } from 'firebase/firestore'

export const SessionContext = createContext<User | undefined>(undefined)

export default function Session({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    let userSubscription: Subscription = new Subscription()

    onAuthStateChanged(auth, (authUser) => {
      console.log({ auth, authUser })
      if (authUser) {
        const userRef = users(authUser.uid).ref
        userSubscription = docData(userRef).subscribe((_user: DocumentData | undefined) => {
          setUser(_user as User)
          localStorage.setItem('user', JSON.stringify(_user))
        })
      } else {
        // User is signed out
        console.log('sign er out')
        userSubscription.unsubscribe()
        setUser(undefined)
        localStorage.removeItem('user')
      }
    })

    userSubscription.unsubscribe()
  }, [])

  return <SessionContext.Provider value={user}>{!loading && children}</SessionContext.Provider>
}
