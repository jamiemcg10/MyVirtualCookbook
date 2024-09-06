'use client'

import { TextField } from '@mui/material'
import ThemedButton from './ThemedButton'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import {
  getAuth,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  getAdditionalUserInfo
} from 'firebase/auth'
import Snackbar from '@mui/material/Snackbar'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [errorText, setErrorText] = useState('')
  const [showNotification, setShowNotification] = useState(false)

  function handleSnackbarClose() {
    setShowNotification(false)
  }

  const sendMagicLink = async () => {
    const auth = getAuth()
    console.log('sign in with email')
    console.log(process.env.REACT_APP_BASE_URL, window.location.origin)
    const actionCodeSettings = {
      url: `${window.location.origin}/login`,
      handleCodeInApp: true
    }

    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem('emailForSignIn', email)
        setEmail('')
        setShowNotification(true)
      })
      .catch(({ message }) => {
        setErrorText(message)
      })
  }

  const submitBtnDisabled = email === ''

  useEffect(() => {
    const auth = getAuth() // move this to a context or something
    console.log(auth.currentUser)
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let linkEmail = window.localStorage.getItem('emailForSignIn')

      if (!linkEmail) {
        // TODO: implement asking user to confirm email
        linkEmail = ''
      }

      signInWithEmailLink(auth, linkEmail, window.location.href)
        .then((result) => {
          window.localStorage.removeItem('emailForSignIn')
          const user = getAdditionalUserInfo(result)
          const userProfile = getAdditionalUserInfo(result)?.profile
          const isNewUser = getAdditionalUserInfo(result)?.isNewUser

          console.log({ user, userProfile, isNewUser })

          // add user to session storage
        })
        .catch((error) => {
          setErrorText(error.message)
          console.log({ error })
        })
    }
  }, [])

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
              <ThemedButton
                color="mvc-yellow"
                className="min-w-full mb-2"
                disabled={submitBtnDisabled}
                onClick={sendMagicLink}>
                Send Log in link
              </ThemedButton>

              <ThemedButton color="mvc-white" className="min-w-full">
                <Image
                  src="/google-logo.png"
                  alt="google logo"
                  width={24}
                  height={24}
                  className="mr-2"
                />
                Sign in with Google
              </ThemedButton>
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
