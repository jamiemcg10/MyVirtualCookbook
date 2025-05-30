import { MenuItem, TextField } from '@mui/material'
import React from 'react'
import { ThemeProvider } from '@emotion/react'
import { theme } from '../.theme/theme'
import type { ThemedTextFieldProps } from '@/app/lib/types/ui/inputs'

export default function ThemedTextField({
  label,
  size = 'medium',
  variant = 'standard',
  helperText,
  error = false,
  required = false,
  autoFocus = false,
  select = false,
  options = [],
  defaultValue = '',
  enableAdd,
  disabled = false,
  placeholder,
  InputProps,
  hoverColor = 'yellow',
  onInput,
  onChange
}: ThemedTextFieldProps) {
  function getOptionsMenuItems() {
    const optionsMenuItems = options.map((opt) => {
      return (
        <MenuItem value={opt.id} key={opt.id}>
          {opt.name}
        </MenuItem>
      )
    })

    return !enableAdd
      ? optionsMenuItems
      : [
          ...optionsMenuItems,
          <MenuItem value="add" key="add" sx={{ fontStyle: 'italic' }}>
            + Add New
          </MenuItem>
        ]
  }

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
            placeholder={placeholder}
            required={required}
            helperText={helperText}
            error={error}
            select={select}
            defaultValue={defaultValue}
            color="mvc-green"
            disabled={disabled}
            onInput={onInput}
            onChange={onChange}
            InputProps={InputProps}
            sx={{
              '.MuiInputBase-root': {
                color: 'var(--mvc-green)',
                borderBottom: '1px solid var(--mvc-green)'
              },
              '.MuiInputBase-root:hover:not(.Mui-disabled, .Mui-error)::before': {
                borderBottom: `2px solid var(--mvc-${hoverColor})`
              }
            }}>
            {getOptionsMenuItems()}
          </TextField>
        </ThemeProvider>
      </>
    </div>
  )
}
