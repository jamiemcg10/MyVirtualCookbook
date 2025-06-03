import { PropsWithChildren, Dispatch, SetStateAction } from 'react'
import { ButtonProps, IconButtonProps } from '@mui/material'

export interface GoogleSignInButtonProps {
  setErrorText: Dispatch<SetStateAction<string>>
}

export interface LinkSignInButtonProps {
  email: string
  setEmail: Dispatch<SetStateAction<string>>
  disabled: boolean
  setErrorText: Dispatch<SetStateAction<string>>
}

export interface ThemedButtonProps extends PropsWithChildren, ButtonProps {
  color: 'mvc-green' | 'mvc-yellow' | 'mvc-white' | 'mvc-gray' | ButtonProps['color']
  className?: string
}

export interface ThemedIconButtonProps extends PropsWithChildren, IconButtonProps {
  color: 'mvc-green' | 'mvc-yellow' | 'mvc-white' | 'mvc-gray'
  className?: string
}
