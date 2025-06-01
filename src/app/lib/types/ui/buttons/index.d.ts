import { MouseEventHandler, PropsWithChildren } from 'react'
import { ButtonProps, IconButtonProps } from '@mui/material'

export interface GoogleSignInButtonProps {
  onClick: MouseEventHandler
}

export interface LinkSignInButtonProps {
  disabled: boolean
  onClick: MouseEventHandler
}

export interface ThemedButtonProps extends PropsWithChildren, ButtonProps {
  color: 'mvc-green' | 'mvc-yellow' | 'mvc-white' | 'mvc-gray'
  className?: string
}

export interface ThemedIconButtonProps extends PropsWithChildren, IconButtonProps {
  color: 'mvc-green' | 'mvc-yellow' | 'mvc-white' | 'mvc-gray'
  className?: string
}
