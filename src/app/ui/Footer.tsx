import { DialogActions, DialogContent, DialogContentText, TextField } from '@mui/material'
import ThemedButton from './buttons/ThemedButton'
import AddIcon from '@mui/icons-material/Add'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import { useState } from 'react'

export default function Footer() {
  function openNewChapterDialog() {}

  function closeNewChapterDialog() {
    setShowChapterAdd(false)
  }

  const [showChapterAdd, setShowChapterAdd] = useState(true)

  return (
    <>
      {/* move dialog to separate component */}
      <Dialog
        open={showChapterAdd}
        onClose={closeNewChapterDialog}
        PaperProps={{
          component: 'form'
        }}>
        <DialogTitle>Add Chapter</DialogTitle>
        <DialogContent>
          <DialogContentText>Chapter name:</DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="chapter"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <ThemedButton color="mvc-gray" onClick={closeNewChapterDialog}>
            Cancel
          </ThemedButton>
          <ThemedButton color="mvc-green">Save</ThemedButton>
        </DialogActions>
      </Dialog>
      <div
        className="h-full p-4 w-[175px] bg-[rgba(5,28,49,.9)] flex flex-col items-center space-y-4"
        style={{
          boxShadow: '0 1px 50px 1px rgb(0 0 0 / 0.8)'
        }}>
        <ThemedButton color="mvc-white" onClick={() => setShowChapterAdd(true)}>
          <AddIcon
            style={{
              verticalAlign: 'top',
              height: 20,
              width: 20,
              marginLeft: -10,
              marginTop: -2
            }}></AddIcon>
          <span>Add Chapter</span>
        </ThemedButton>
        <ThemedButton color="mvc-white">
          {' '}
          <AddIcon
            style={{
              verticalAlign: 'top',
              height: 20,
              width: 20,
              marginLeft: -10,
              marginTop: -2
            }}></AddIcon>
          <span>Add Recipe</span>
        </ThemedButton>
      </div>
    </>
  )
}
