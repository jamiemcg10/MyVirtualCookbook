'use client'

import { useContext, useEffect, useState } from 'react'
import clsx from 'clsx'
import { isSignInWithEmailLink, signInWithEmailLink, getAdditionalUserInfo } from 'firebase/auth'
import LinkSignInButton from '../../ui/buttons/LinkSignInButton'
import GoogleSignInButton from '../../ui/buttons/GoogleSignInButton'
import { auth } from '../../utils/firebase'
import { redirect } from 'next/navigation'
import { SessionContext } from '../../utils/Session'
import { FirebaseUser } from '@/app/lib/types'
import { createUser } from '@/app/utils/createUser'
import ThemedTextField from '@/app/ui/inputs/ThemedTextField'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [errorText, setErrorText] = useState('')
  const { user } = useContext(SessionContext)

  const [submitDisabled, setSubmitDisabled] = useState(true)

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
        <div className="w-[22rem] p-9 shadow-xl bg-gray-300 rounded-lg m-auto login-container">
          <h3 className="text-gray-700 text-center mb-6 text-xl">Log in to continue</h3>
          <div className="pt-4">
            {/* <ThemedTextField
              fullWidth
              variant="outlined"
              size="small"
              className="mb-3"
              id="email"
              label="Email address"
              value={email}
              onChange={(e) => {
                const value = e.target.value.trim()
                setEmail(value)
                if (value.length && value.includes('@') && value.match(/\.[A-Za-z]{2,}$/)) {
                  setSubmitDisabled(false)
                } else {
                  setSubmitDisabled(true)
                }
              }}
            /> */}
            <p
              className={clsx(
                'ml-0.5 mt-0.5 text-red-600 text-xs italic',
                !errorText && 'invisible'
              )}>
              {errorText}
            </p>
            <div className="flex flex-col mt-4">
              {/* <LinkSignInButton
                disabled={submitDisabled}
                setErrorText={setErrorText}
                email={email}
                setEmail={setEmail}
              /> */}
              <GoogleSignInButton setErrorText={setErrorText} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
