import EditRoundedIcon from '@mui/icons-material/EditRounded'
import { Input, TextField } from '@mui/material'
import { Roboto } from 'next/font/google'
import { PropsWithChildren, useRef, useState } from 'react'
import { ThemeProvider } from '@emotion/react'
import { theme } from '../.theme/theme'

declare module '@mui/material/TextField' {
  // eslint-disable-next-line no-unused-vars
  interface TextFieldPropsColorOverrides {
    'mvc-green': true
    'mvc-yellow': true
    'mvc-white': true
    'mvc-gray': true
  }
}
interface ThemedTextFieldProps extends PropsWithChildren {
  label: string
  size?: 'small' | 'medium'
  variant?: 'filled' | 'outlined' | 'standard'
  required?: boolean
  autoFocus?: boolean
}

const roboto = Roboto({ weight: '700', subsets: ['latin'] })

export default function ThemedTextField({
  label,
  size="medium",
  variant="standard",
  required=false,
  autoFocus=false,
}: ThemedTextFieldProps) {
  return (
    <div className="flex items-center">
        <>
          <ThemeProvider theme={theme}>
            <TextField 
            autoFocus={autoFocus}
            fullWidth
            variant={variant}
            size={size}
            label={label}
            required={required}
            color="mvc-green"
            sx={{
              '.MuiInputBase-root:hover:not(.Mui-disabled, .Mui-error)::before': {
                borderBottom: '2px solid var(--mvc-yellow)'
              }
            }}/>
  
          </ThemeProvider>
        </>
    </div>
  )
}
