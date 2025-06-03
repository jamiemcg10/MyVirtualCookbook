import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ThemedButton from '../buttons/ThemedButton'
import type { DeleteChapterDialogProps } from '@/app/lib/types/ui/dialogs'
import BaseDialog from './BaseDialog'

export default function DeleteChapterDialog({
  showDeleteDialog,
  closeDeleteChapterDialog,
  deleteActiveChapter,
  setShowDeleteDialog
}: DeleteChapterDialogProps) {
  return (
    <BaseDialog show={showDeleteDialog} closeFn={() => closeDeleteChapterDialog()}>
      <DialogTitle>
        <div className="text-mvc-green font-medium">Delete Chapter</div>
      </DialogTitle>
      <IconButton
        onClick={() => closeDeleteChapterDialog()}
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
        <DialogContentText>
          <span>
            Are you sure? This chapter and the recipes in it will be permanently deleted. This
            can&apos;t be undone.
          </span>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <ThemedButton
          variant="outlined"
          color="mvc-gray"
          className="my-4 ml-8"
          onClick={() => {
            setShowDeleteDialog(false)
          }}>
          <span>Cancel</span>
        </ThemedButton>
        <ThemedButton
          color="error"
          variant="contained"
          className="my-4 ml-8"
          onClick={deleteActiveChapter}>
          Permanently Delete
        </ThemedButton>
      </DialogActions>
    </BaseDialog>
  )
}
