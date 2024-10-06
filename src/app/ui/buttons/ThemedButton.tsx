'use client'

import { Button, ThemeProvider } from '@mui/material'
import { MouseEventHandler, PropsWithChildren } from 'react'
import { theme } from '../.theme/theme'

interface ThemedButtonProps extends PropsWithChildren {
  color: 'mvc-green' | 'mvc-yellow' | 'mvc-white' | 'mvc-gray'
  variant?: 'text' | 'contained' | 'outlined'
  className?: string
  disabled?: boolean
  onClick?: MouseEventHandler
}

declare module '@mui/material/Button' {
  // eslint-disable-next-line no-unused-vars
  interface ButtonPropsColorOverrides {
    'mvc-green': true
    'mvc-yellow': true
    'mvc-white': true
    'mvc-gray': true
  }
}

export default function ThemedButton({
  color,
  className,
  disabled = false,
  variant = 'contained',
  children,
  onClick
}: ThemedButtonProps) {
  return (
    <ThemeProvider theme={theme}>
      <Button
        variant={variant}
        color={color}
        className={`w-max ${className}`}
        disabled={disabled}
        onClick={onClick}>
        {children}
      </Button>
    </ThemeProvider>
  )
}
