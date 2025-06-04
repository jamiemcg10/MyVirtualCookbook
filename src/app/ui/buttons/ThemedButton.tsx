'use client'

import { Button, ThemeProvider } from '@mui/material'
import { theme } from '../.theme/theme'
import { ThemedButtonProps } from '@/app/lib/types/ui/buttons'

export default function ThemedButton({
  color,
  className,
  disabled = false,
  variant = 'contained',
  children,
  size = 'medium',
  startIcon = undefined,
  endIcon = undefined,
  href,
  onClick,
  sx = {}
}: ThemedButtonProps) {
  return (
    <ThemeProvider theme={theme}>
      <Button
        variant={variant}
        color={color}
        size={size}
        className={className}
        disabled={disabled}
        onClick={onClick}
        startIcon={startIcon}
        endIcon={endIcon}
        href={href}
        disableRipple
        sx={{
          width: 'max-content',
          ...sx
        }}>
        {children}
      </Button>
    </ThemeProvider>
  )
}
