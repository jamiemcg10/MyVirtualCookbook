import { LinkSignInButtonProps } from '@/app/lib/types/ui/buttons'
import ThemedButton from './ThemedButton'

export default function LinkSignInButton({ disabled, onClick }: LinkSignInButtonProps) {
  return (
    <ThemedButton
      color="mvc-yellow"
      className="min-w-full mb-2"
      disabled={disabled}
      onClick={onClick}>
      Send Log in link
    </ThemedButton>
  )
}
