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
  SelectProps,
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
            SelectProps={SelectProps}
            InputLabelProps={{
              style: { opacity: 0.8 }
            }}
            sx={{
              '.MuiInputBase-root': {
                color: 'var(--mvc-green)',
                borderBottom: '1px solid var(--mvc-green)'
              },
              '.MuiInputBase-root:hover:not(.Mui-disabled, .Mui-error)': {
                borderBottom: '1px solid transparent'
              },
              '.MuiInputBase-root:hover:not(.Mui-disabled, .Mui-error)::before': {
                borderBottom: `2px solid var(--mvc-yellow)`
              }
            }}>
            {getOptionsMenuItems()}
          </TextField>
        </ThemeProvider>
      </>
    </div>
  )
}
