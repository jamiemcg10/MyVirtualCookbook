import { MouseEventHandler } from 'react'
import ThemedButton from './ThemedButton'

interface LinkSignInButtonProps {
  disabled: boolean
  onClick: MouseEventHandler
}

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
