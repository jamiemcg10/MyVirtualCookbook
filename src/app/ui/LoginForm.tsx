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
import LinkSignInButton from './buttons/LinkSignInButton'
import GoogleSignInButton from './buttons/GoogleSignInButton'
import { auth, users } from '../utils/firebase'
import { redirect } from 'next/navigation'
import { SessionContext } from '../utils/Session'

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

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider()

    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result)
        // const token = credential?.accessToken

        const user = { ...result, ...(getAdditionalUserInfo(result) || {}) }
        const isNewUser = user.isNewUser

        if (!!isNewUser) {
          createUser(user)
        }

        console.log({ user })

        // redirect to cookbook
        redirect('/cookbook')
      })
      .catch(({ message }) => {
        setErrorText(message)
      })
  }

  const createUser = async (user: any) => {
    // move this to separate file, make a better type
    const id = user.user.uid

    if (user.providerId === 'google.com') {
      const displayName = user.profile.given_name
      const pictureUrl = user.profile.picture

      users(id).set({
        id,
        username: displayName,
        pictureUrl
      })
    } else {
      users(id).set({
        id,
        username: user.user.email
      })
    }
  }

  const submitBtnDisabled = email === ''

  useEffect(() => {
    if (!!session) {
      redirect('/cookbook')
    }

    if (isSignInWithEmailLink(auth, window.location.href)) {
      let linkEmail = window.localStorage.getItem('emailForSignIn')

      if (!linkEmail) {
        // TODO: implement asking user to confirm email
        linkEmail = ''
      }

      signInWithEmailLink(auth, linkEmail, window.location.href)
        .then((result) => {
          window.localStorage.removeItem('emailForSignIn')
          const user = { ...result, ...(getAdditionalUserInfo(result) || {}) }

          const isNewUser = getAdditionalUserInfo(result)?.isNewUser

          if (!!isNewUser) {
            createUser(user)
          }
        })
        .catch((error) => {
          setErrorText(error.message)
          console.log({ error })
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
