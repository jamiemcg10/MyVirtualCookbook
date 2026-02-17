import { GoogleSignInButtonProps } from '@/app/lib/types/ui/buttons'
import { getAdditionalUserInfo, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../../lib/utils/firebase'
import { createUser } from '@/app/lib/utils/dbHelpers/createUser'
import { FirebaseUser } from '@/app/lib/types'
import ThemedButton from './ThemedButton'
import Image from 'next/image'

const btnSx = { minWidth: '100%' }

export default function GoogleSignInButton({ setErrorText }: GoogleSignInButtonProps) {
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

  return (
    <ThemedButton color="mvc-white" sx={btnSx} onClick={signInWithGoogle}>
      <Image src="/google-logo.png" alt="google logo" width={24} height={24} className="mr-2" />
      Sign in with Google
    </ThemedButton>
  )
}
