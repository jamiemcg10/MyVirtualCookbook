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

	useEffect(() => {
		let userSubscription: Subscription = new Subscription()

		onAuthStateChanged(auth, (authUser) => {
			if (authUser) {
				const userRef = users(authUser.uid).ref
				userSubscription = docData(userRef).subscribe(
					// can add `{ idField: 'uid' }` as second arg
					(_user: DocumentData | undefined) => {
						console.log({ _user })
						setUser(_user as User)
					}
				)
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
