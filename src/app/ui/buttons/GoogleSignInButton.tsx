import { GoogleSignInButtonProps } from '@/app/lib/types/ui/buttons'
import ThemedButton from './ThemedButton'
import Image from 'next/image'

export default function GoogleSignInButton({ onClick }: GoogleSignInButtonProps) {
  return (
    <ThemedButton color="mvc-white" className="min-w-full" onClick={onClick}>
      <Image src="/google-logo.png" alt="google logo" width={24} height={24} className="mr-2" />
      Sign in with Google
    </ThemedButton>
  )
}
