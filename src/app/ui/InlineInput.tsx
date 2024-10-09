import EditRoundedIcon from '@mui/icons-material/EditRounded'
import { Input } from '@mui/material'
import { Roboto } from 'next/font/google'
import { PropsWithChildren, useRef, useState } from 'react'
import { ThemeProvider } from '@emotion/react'
import { theme } from './.theme/theme'
import InlineInputEditActions from './InlineInputEditActions'

interface InlineInputProps extends PropsWithChildren {
  label: string
  onSave: (newLabel: string) => Promise<void>
}

const roboto = Roboto({ weight: '700', subsets: ['latin'] })

const sharedButtonStyles = {
  fontSize: 14,
  marginLeft: 0.7,
  transitionProperty: 'all',
  '&:hover': {
    fontSize: 16
  }
}

export default function InlineInput({ children, label, onSave }: InlineInputProps) {
  const [editing, setEditing] = useState(false)
  const inputElRef = useRef<HTMLElement>()

  function getInputValue() {
    return (inputElRef?.current?.children[0] as HTMLInputElement).value
  }

  return (
    <div className="flex items-center">
      {!editing ? (
        <>
          {children}
          <EditRoundedIcon
            className="text-gray-500 hover:text-mvc-green hover:bg-mvc-green/20 hover:text-base transition-all rounded-sm"
            sx={sharedButtonStyles}
            onClick={(e) => {
              e.stopPropagation()
              setEditing(true)
            }}
          />
        </>
      ) : (
        <>
          <ThemeProvider theme={theme}>
            <Input
              ref={inputElRef}
              sx={{
                ...roboto.style,
                color: 'rgb(55, 65, 81)',
                ':before': {
                  borderBottomColor: 'var(--mvc-yellow) !important'
                }
              }}
              defaultValue={label}
              color="mvc-green"
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          </ThemeProvider>
          <InlineInputEditActions
            styles={sharedButtonStyles}
            onSave={async () => await onSave(getInputValue())}
            setEditing={setEditing}
          />
        </>
      )}
    </div>
  )
}
