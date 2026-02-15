'use client'

import { useContext, useEffect, useState } from 'react'
import clsx from 'clsx'
import { isSignInWithEmailLink, signInWithEmailLink, getAdditionalUserInfo } from 'firebase/auth'
import GoogleSignInButton from '../../ui/buttons/GoogleSignInButton'
import { auth } from '../../lib/utils/firebase'
import { redirect } from 'next/navigation'
import { SessionContext } from '../../lib/utils/Session'
import { FirebaseUser } from '@/app/lib/types'
import { createUser } from '@/app/lib/utils/dbHelpers/createUser'
import ThemedButton from '@/app/ui/buttons/ThemedButton'

export default function LoginForm() {
  const [errorText, setErrorText] = useState('')
  const { user } = useContext(SessionContext)

  useEffect(() => {
    if (user) {
      redirect('/cookbook')
    }

    if (isSignInWithEmailLink(auth, window.location.href)) {
      const linkEmail = window.localStorage.getItem('emailForSignIn') || ''

      signInWithEmailLink(auth, linkEmail, window.location.href)
        .then((result) => {
          window.localStorage.removeItem('emailForSignIn')
          const user = { ...result, ...(getAdditionalUserInfo(result) || {}) } as FirebaseUser
          const isNewUser = getAdditionalUserInfo(result)?.isNewUser

          if (isNewUser) {
            createUser(user)
          }
        })
        .catch((error) => {
          setErrorText(error.message)
        })
    }
  }, [user])

  return (
    <>
      <div className="px-5">
        <h1 className="page-title">Log in</h1>
        <div className="w-[20rem] xs:w-[22rem] p-9 shadow-xl bg-gray-300 rounded-lg m-auto login-container">
          <h3 className="text-gray-700 text-center mb-6 text-xl">Log in to continue</h3>
          <div className="pt-4">
            <p
              className={clsx(
                'ml-0.5 mt-0.5 text-red-600 text-xs italic',
                !errorText && 'invisible'
              )}>
              {errorText}
            </p>
            <ThemedButton color="mvc-yellow" className="w-full">
              Demo Mode
            </ThemedButton>
            <div className="flex flex-col mt-4">
              <GoogleSignInButton setErrorText={setErrorText} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
