import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  useMediaQuery,
  useTheme
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ThemedTextField from '../inputs/ThemedTextField'
import SearchIcon from '@mui/icons-material/Search'
import { ChangeEvent, useState } from 'react'

export default function SearchDialog() {
  const [searchValue, setSearchValue] = useState('')
  function onSearch(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setSearchValue(value)
  }

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <>
      <Dialog
        open={false}
        fullScreen={fullScreen}
        sx={{ '.MuiDialog-paper': { backgroundColor: '#e1e1e1', width: '100%' } }}>
        <IconButton
          onClick={() => {}}
          aria-label="close"
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500]
          })}>
          <CloseIcon />
        </IconButton>
        <DialogTitle>
          <div className="w-11/12">
            <ThemedTextField
              placeholder="Search..."
              autoFocus
              onInput={onSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </div>
        </DialogTitle>
        <DialogContent>
          <div>{searchValue ? 'results!' : 'Start typing to search'}</div>
        </DialogContent>
      </Dialog>
    </>
  )
}
