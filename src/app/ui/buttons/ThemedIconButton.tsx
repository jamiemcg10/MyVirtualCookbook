'use client'

import { IconButton, ThemeProvider } from '@mui/material'
import { theme } from '../.theme/theme'
import { ThemedIconButtonProps } from '@/app/lib/types/ui/buttons'

export default function ThemedButton({
  color,
  className,
  disabled = false,
  children,
  size = 'medium',
  onClick,
  sx = {}
}: ThemedIconButtonProps) {
  return (
    <ThemeProvider theme={theme}>
      <IconButton
        color={color}
        size={size}
        className={className}
        disabled={disabled}
        onClick={onClick}
        sx={{
          width: 'max-content',
          ...sx
        }}>
        {children}
      </IconButton>
    </ThemeProvider>
  )
}
