'use client'

import { TextField } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import clsx from 'clsx'
import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import Snackbar from '@mui/material/Snackbar'
import LinkSignInButton from '../../ui/buttons/LinkSignInButton'
import GoogleSignInButton from '../../ui/buttons/GoogleSignInButton'
import { auth } from '../../utils/firebase'
import { redirect } from 'next/navigation'
import { SessionContext } from '../../utils/Session'
import { FirebaseUser } from '@/app/lib/types'
import { createUser } from '@/app/utils/createUser'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [errorText, setErrorText] = useState('')
  const [showNotification, setShowNotification] = useState(false)
  const session = useContext(SessionContext)

  function handleSnackbarClose() {
    setShowNotification(false)
  }

  const sendMagicLink = async () => {
    const actionCodeSettings = {
      url: `${window.location.origin}/cookbook`,
      handleCodeInApp: true
    }

    console.log({ actionCodeSettings })

    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        console.log('in then')
        window.localStorage.setItem('emailForSignIn', email)
        setEmail('')
        setShowNotification(true)
      })
      .catch(({ message }) => {
        setErrorText(message)
      })
  }

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider()

    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = { ...result, ...(getAdditionalUserInfo(result) || {}) } as FirebaseUser

        const isNewUser = user.isNewUser

        if (isNewUser) {
          await createUser(user)
        }
      })
      .catch(({ message }) => {
        setErrorText(message)
      })
  }

  const submitBtnDisabled = email === ''

  useEffect(() => {
    if (session) {
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
  }, [session])

  return (
    <>
      <div className="px-5">
        <h1 className="page-title">Log in</h1>
        <div className="w-[22rem] p-9 shadow-xl bg-gray-300 rounded-lg m-auto login-container">
          <h3 className="text-gray-700 text-center mb-6 text-xl">Log in to continue</h3>
          <div>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              className="mb-3"
              id="email"
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p
              className={clsx(
                'ml-0.5 mt-0.5 text-red-600 text-xs italic',
                !errorText && 'invisible'
              )}>
              {errorText}
            </p>
            <div className="flex flex-col mt-4">
              <LinkSignInButton disabled={submitBtnDisabled} onClick={sendMagicLink} />
              <GoogleSignInButton onClick={signInWithGoogle} />
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={3000}
        message="Link sent to email"
        open={showNotification}
        onClose={handleSnackbarClose}
      />
    </>
  )
}
