import EditRoundedIcon from '@mui/icons-material/EditRounded'
import { Input } from '@mui/material'
import { Roboto } from 'next/font/google'
import { PropsWithChildren, useRef, useState } from 'react'
import { ThemeProvider } from '@emotion/react'
import { theme } from '../.theme/theme'
import InlineInputEditActions from './InlineInputEditActions'
import { sharedMiniButtonStyles } from '../../utils/sharedMiniButtonStyles'

interface InlineInputProps extends PropsWithChildren {
  label: string
  onSave: (newLabel: string) => Promise<void>
  onCancel: () => Promise<void> | void
  focusOnLoad?: boolean
}

const roboto = Roboto({ weight: '700', subsets: ['latin'] })

export default function InlineInput({
  children,
  label,
  onSave,
  onCancel,
  focusOnLoad
}: InlineInputProps) {
  const [editing, setEditing] = useState(!!focusOnLoad)
  const inputElRef = useRef<HTMLElement>()

  const [saveDisabled, setSaveDisabled] = useState(!label)

  function getInputValue() {
    return (inputElRef?.current?.children[0] as HTMLInputElement).value
  }

  if (focusOnLoad) {
    requestAnimationFrame(() => {
      setTimeout(() => inputElRef.current?.focus(), 100) // also not working
    })
  }

  // focusOnLoad && inputElRef.current?.focus() // not working

  return (
    <div className="flex items-center">
      {!editing ? (
        <>
          {children}
          <EditRoundedIcon
            className="text-gray-500 hover:text-mvc-green hover:bg-mvc-green/20 transition-all rounded-sm"
            sx={sharedMiniButtonStyles}
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
              onInput={(e) => {
                setSaveDisabled(!(e.target as HTMLInputElement).value)
              }}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          </ThemeProvider>
          <InlineInputEditActions
            styles={sharedMiniButtonStyles}
            onSave={async () => await onSave(getInputValue())}
            onCancel={async () => await onCancel()}
            setEditing={setEditing}
            saveDisabled={saveDisabled}
          />
        </>
      )}
    </div>
  )
}
