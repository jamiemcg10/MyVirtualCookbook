import { LinkSignInButtonProps } from '@/app/lib/types/ui/buttons'
import ThemedButton from './ThemedButton'

export default function LinkSignInButton({ disabled, onClick }: LinkSignInButtonProps) {
  return (
    <ThemedButton
      color="mvc-yellow"
      disabled={disabled}
      sx={{ minWidth: '100%', marginBottom: '0.5rem' }}
      onClick={onClick}>
      Send Log in link
    </ThemedButton>
  )
}
