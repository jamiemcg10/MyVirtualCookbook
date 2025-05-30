'use client'

import { useEffect, createContext, useState, PropsWithChildren } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { docData } from 'rxfire/firestore'
import { auth } from './firebase/firebase'
import { users } from './firebase/users'
import { ChapterWithRecipeNotes, User, type Session } from '../lib/types'
import { Subscription } from 'rxjs'
import { DocumentData } from 'firebase/firestore'
import { getCookbook } from './cookbook'

const emptySession = { user: undefined, cookbook: undefined, chapters: undefined }

export const SessionContext = createContext<Session>(emptySession)
export let resetSession: () => void
export let updateCookbook: (cookbook: ChapterWithRecipeNotes[]) => void

export default function Session({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session>(emptySession)

  const [loading, setLoading] = useState(true)

  resetSession = () => setSession(emptySession)

  useEffect(() => {
    const storedSession = localStorage.getItem('session')
    if (storedSession) {
      setSession(JSON.parse(storedSession))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    let userSubscription: Subscription = new Subscription()

    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        const userRef = users(authUser.uid).ref
        userSubscription = docData(userRef).subscribe((_user: DocumentData | undefined) => {
          if (_user) {
            getCookbook(_user.id).subscribe((v) => {
              const chapters = v.map((chapter) => {
                return { id: chapter.id, name: chapter.name }
              })

              setSession({ user: _user as User, cookbook: v, chapters })
              localStorage.setItem(
                'session',
                JSON.stringify({ user: _user, cookbook: v, chapters })
              )

              updateCookbook = (cookbook: ChapterWithRecipeNotes[]) => {
                setSession({ user: _user as User, cookbook, chapters })
              }
            })
          }
        })
      } else {
        // User is signed out
        setSession(emptySession)
        userSubscription.unsubscribe()
        localStorage.removeItem('session')
      }
    })

    userSubscription.unsubscribe()
  }, [])

  return <SessionContext.Provider value={session}>{!loading && children}</SessionContext.Provider>
}
