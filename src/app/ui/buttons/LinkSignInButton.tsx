import { sendSignInLinkToEmail } from 'firebase/auth'
import { auth } from '../../lib/utils/firebase'
import { LinkSignInButtonProps } from '@/app/lib/types/ui/buttons'
import ThemedButton from './ThemedButton'
import { Snackbar } from '@mui/material'
import { useState } from 'react'

const linkBtnSx = { minWidth: '100%', marginBottom: '0.5rem' }

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
      <ThemedButton color="mvc-yellow" disabled={disabled} sx={linkBtnSx} onClick={sendMagicLink}>
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
