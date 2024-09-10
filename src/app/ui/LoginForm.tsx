'use client'

// import { TextField } from '@mui/material'
import { useEffect, useState } from 'react'
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
// import LinkSignInButton from './buttons/LinkSignInButton'
import GoogleSignInButton from './buttons/GoogleSignInButton'
import { auth, users } from '../utils/firebase'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [errorText, setErrorText] = useState('')
  const [showNotification, setShowNotification] = useState(false)

  function handleSnackbarClose() {
    setShowNotification(false)
  }

  const sendMagicLink = async () => {
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

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider()

    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result)
        const token = credential?.accessToken

        console.log({ result })

        const additionalInfo = getAdditionalUserInfo(result)

        const user = { ...result, ...(additionalInfo || {}) }

        const userProfile = getAdditionalUserInfo(result)?.profile
        const isNewUser = user?.isNewUser || false

        if (isNewUser) {
          createUser(user)
        }

        console.log({ user })
      })
      .catch(({ message }) => {
        setErrorText(message)
      })
  }

  const createUser = async (user: any) => {
    // move this to separate file, make a better type
    if (user.providerId === 'google.com') {
      const id = user.user.uid
      const displayName = user.profile.given_name

      users.set(id, {
        id,
        username: displayName
      })
    }
  }

  // const submitBtnDisabled = email === ''

  useEffect(() => {
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
            {/* <TextField
              fullWidth
              variant="outlined"
              size="small"
              className="mb-3"
              id="email"
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            /> */}
            <p
              className={clsx(
                'ml-0.5 mt-0.5 text-red-600 text-xs italic',
                !errorText && 'invisible'
              )}>
              {errorText}
            </p>
            <div className="flex flex-col mt-4">
              {/* <LinkSignInButton disabled={submitBtnDisabled} onClick={sendMagicLink} /> */}
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
