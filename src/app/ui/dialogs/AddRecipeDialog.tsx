import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ThemedButton from '../buttons/ThemedButton'
import ThemedTextField from '../inputs/ThemedTextField'

interface AddRecipeDialogProps {
  showAddRecipeDialog: boolean
  closeAddRecipeDialog: () => void
  deleteActiveRecipe: () => void
  setShowAddRecipeDialog: (v: boolean) => void
}

export default function AddRecipeDialog({
  showAddRecipeDialog,
  closeAddRecipeDialog,
  setShowAddRecipeDialog
}: AddRecipeDialogProps) {
  return (
    <Dialog
      open={showAddRecipeDialog}
      onClose={() => closeAddRecipeDialog()}
      sx={{ '.MuiDialog-paper': { backgroundColor: '#e1e1e1', width: 400 } }}>
      <DialogTitle className="text-mvc-gray">Add Recipe</DialogTitle>
      <IconButton
        onClick={() => closeAddRecipeDialog()}
        aria-label="close"
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500]
        })}>
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <div className="flex flex-col space-y-4 mb-4 text-xs">
          <ThemedTextField size="small" label="Recipe name" required autoFocus />
          <ThemedTextField size="small" label="Recipe link" required />
        </div>
      </DialogContent>
      <DialogActions>
        <ThemedButton
          variant="contained"
          color="mvc-gray"
          className="my-4 ml-8"
          onClick={() => {
            setShowAddRecipeDialog(false)
          }}>
          <span>Cancel</span>
        </ThemedButton>
        <ThemedButton
          color="mvc-green"
          variant="contained"
          className="my-4 ml-8"
          onClick={() => {}}>
          Save
        </ThemedButton>
      </DialogActions>
    </Dialog>
  )
}
