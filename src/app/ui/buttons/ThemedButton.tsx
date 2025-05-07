'use client'

import { Button, ButtonProps, ThemeProvider } from '@mui/material'
import { PropsWithChildren } from 'react'
import { theme } from '../.theme/theme'

interface ThemedButtonProps extends PropsWithChildren, ButtonProps {
  color: 'mvc-green' | 'mvc-yellow' | 'mvc-white' | 'mvc-gray'
  className?: string
}

export default function ThemedButton({
  color,
  className,
  disabled = false,
  variant = 'contained',
  children,
  size = 'medium',
  startIcon = undefined,
  endIcon = undefined,
  onClick
}: ThemedButtonProps) {
  return (
    <ThemeProvider theme={theme}>
      <Button
        variant={variant}
        color={color}
        size={size}
        className={`w-max ${className}`}
        disabled={disabled}
        onClick={onClick}
        startIcon={startIcon}
        endIcon={endIcon}>
        {children}
      </Button>
    </ThemeProvider>
  )
}
