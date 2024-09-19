'use client'

import { Button, ThemeProvider } from '@mui/material'
import { createTheme, alpha, getContrastRatio } from '@mui/material/styles'
import { PropsWithChildren } from 'react'

interface ThemedButtonProps extends PropsWithChildren {
  color: 'mvc-green' | 'mvc-yellow' | 'mvc-white' | 'mvc-gray'
  variant?: 'text' | 'contained' | 'outlined'
  className?: string
  disabled?: boolean
  children: any
  onClick?: any
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

const greenBase = '#6aa84f'
const greenMain = alpha(greenBase, 0.7)

const yellowBase = '#ffd966'
const yellowMain = alpha(yellowBase, 0.7)

const whiteBase = '#fff'
const whiteMain = alpha(whiteBase, 0.7)

const grayBase = '#808080'
const grayMain = alpha(grayBase, 0.7)

const theme = createTheme({
  typography: {
    fontFamily: 'inherit'
  },
  palette: {
    'mvc-green': {
      main: greenMain,
      light: alpha(greenBase, 0.5),
      dark: alpha(greenBase, 0.9),
      contrastText: getContrastRatio(greenMain, '#fff') > 4.5 ? '#fff' : '#303030'
    },
    'mvc-yellow': {
      main: yellowMain,
      light: alpha(yellowBase, 0.5),
      dark: alpha(yellowBase, 0.9),
      contrastText: getContrastRatio(yellowMain, '#fff') > 4.5 ? '#fff' : '#303030'
    },
    'mvc-white': {
      main: whiteMain,
      light: alpha(whiteBase, 0.5),
      dark: alpha(whiteBase, 0.9),
      contrastText: '#303030'
    },
    'mvc-gray': {
      main: grayMain,
      light: alpha(grayBase, 0.5),
      dark: alpha(grayBase, 0.9),
      contrastText: '#303030' // not working
    }
  }
})

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
