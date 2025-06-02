export const standardStyles = {
  '.MuiInputBase-root': {
    color: 'var(--mvc-green)',
    borderBottom: '1px solid var(--mvc-green)'
  },
  '.MuiInputBase-root:hover:not(.Mui-disabled, .Mui-error)': {
    borderBottom: '1px solid transparent'
  },
  '.MuiInputBase-root:hover:not(.Mui-disabled, .Mui-error)::before': {
    borderBottom: '2px solid var(--mvc-yellow)'
  }
}

export const outlinedStyles = {
  '.MuiInputBase-root': {
    color: 'var(--mvc-green)'
  },
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: 'var(--mvc-yellow)'
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--mvc-green)'
    }
  }
}
