import EditRoundedIcon from '@mui/icons-material/EditRounded'
import { ClickAwayListener, Input } from '@mui/material'
import { Roboto } from 'next/font/google'
import { useRef, useState } from 'react'
import { ThemeProvider } from '@emotion/react'
import { theme } from '../.theme/theme'
import InlineInputEditActions from './InlineInputEditActions'
import { sharedMiniButtonStyles } from '../../lib/styles/sharedMiniButtonStyles'
import type { InlineInputProps } from '@/app/lib/types/ui/inputs'

const roboto = Roboto({ weight: '700', subsets: ['latin'] })

const inputSx = {
  ...roboto.style,
  color: 'rgb(55, 65, 81)',
  width: '100%',
  ':before': {
    borderBottomColor: 'var(--mvc-yellow) !important'
  }
}

export default function InlineInput({
  children,
  label,
  onSave,
  onCancel,
  onBlur,
  autoFocus = false,
  hideEditIcon = false,
  editing,
  setEditing
}: InlineInputProps) {
  const [_editing, _setEditing] = useState(!!autoFocus)
  const edit = editing || _editing
  const setEdit = setEditing || _setEditing

  const inputElRef = useRef<HTMLElement>()

  const [saveDisabled, setSaveDisabled] = useState(!label)

  function getInputValue() {
    return (inputElRef?.current?.children[0] as HTMLInputElement).value
  }

  return (
    <ClickAwayListener
      onClickAway={() => {
        if (edit) {
          setEdit(false)
        }
      }}>
      <div className="flex items-center">
        {!edit ? (
          <>
            {children}
            {!hideEditIcon ? (
              <EditRoundedIcon
                className="text-gray-500 hover:text-mvc-green hover:bg-mvc-green/20 transition-all rounded-sm"
                sx={sharedMiniButtonStyles}
                onClick={(e) => {
                  e.stopPropagation()
                  setEdit(true)
                }}
              />
            ) : null}
          </>
        ) : (
          <>
            <ThemeProvider theme={theme}>
              <div>
                <Input
                  ref={inputElRef}
                  autoFocus={autoFocus}
                  sx={inputSx}
                  defaultValue={label}
                  color="mvc-green"
                  onInput={(e) => {
                    setSaveDisabled(!(e.target as HTMLInputElement).value)
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter') {
                      await onSave(getInputValue())
                    }
                  }}
                  onBlur={onBlur}
                />
              </div>
            </ThemeProvider>
            <InlineInputEditActions
              styles={sharedMiniButtonStyles}
              onSave={async () => await onSave(getInputValue())}
              onCancel={async () => await onCancel()}
              setEditing={setEdit}
              saveDisabled={saveDisabled}
            />
          </>
        )}
      </div>
    </ClickAwayListener>
  )
}
