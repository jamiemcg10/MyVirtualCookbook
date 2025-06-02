import { sendSignInLinkToEmail } from 'firebase/auth'
import { auth } from '../../utils/firebase'
import { LinkSignInButtonProps } from '@/app/lib/types/ui/buttons'
import ThemedButton from './ThemedButton'
import { Snackbar } from '@mui/material'
import { useState } from 'react'

export default function LinkSignInButton({
  disabled,
  setErrorText,
  email,
  setEmail
}: LinkSignInButtonProps) {
  function handleSnackbarClose() {
    setShowNotification(false)
  }

  const [showNotification, setShowNotification] = useState(false)

  const sendMagicLink = async () => {
    const actionCodeSettings = {
      url: `${window.location.origin}/cookbook`,
      handleCodeInApp: false
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

  return (
    <>
      <ThemedButton
        color="mvc-yellow"
        disabled={disabled}
        sx={{ minWidth: '100%', marginBottom: '0.5rem' }}
        onClick={sendMagicLink}>
        Send Log in link
      </ThemedButton>
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
