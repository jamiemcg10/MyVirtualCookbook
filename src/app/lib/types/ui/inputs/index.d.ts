import type { Dispatch, ChangeEvent, PropsWithChildren, SetStateAction } from 'react'
import type { SxProps } from '@mui/material/styles'
import { StandardTextFieldProps } from '@mui/material'

export interface InlineInputProps extends PropsWithChildren {
  label: string
  onSave: (newLabel: string) => Promise<void>
  onCancel: () => Promise<void> | void
  autoFocus?: boolean
  hideEditIcon?: boolean
  editing?: boolean
  setEditing?: Dispatch<SetStateAction<boolean>>
}

export interface InlineInputEditActionsProps {
  onSave: () => Promise<void>
  onCancel: () => void
  styles: SxProps
  setEditing: Dispatch<SetStateAction<boolean>>
  saveDisabled: boolean
}

export interface ThemedTextFieldProps extends PropsWithChildren, StandardTextFieldProps {
  variant?: 'filled' | 'outlined' | 'standard'
  options?: DropdownOption[]
  enableAdd?: boolean
  onInput?: (e: ChangeEvent<HTMLInputElement>) => void
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

interface DropdownOption {
  id: string
  name: string
}
