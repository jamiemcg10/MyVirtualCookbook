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

interface DeleteChapterDialogProps {
	showDeleteDialog: boolean
	closeDeleteChapterDialog: () => void
	deleteActiveChapter: () => void
	setShowDeleteDialog: (v: boolean) => void
}

export default function DeleteChapterDialog({
	showDeleteDialog,
	closeDeleteChapterDialog,
	deleteActiveChapter,
	setShowDeleteDialog
}: DeleteChapterDialogProps) {
	return (
		<Dialog
			open={showDeleteDialog}
			onClose={() => closeDeleteChapterDialog()}
			sx={{ '.MuiDialog-paper': { backgroundColor: '#e1e1e1', padding: '0 15px' } }}>
			<DialogTitle>Delete Chapter</DialogTitle>
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
				<Button
					color="error"
					variant="contained"
					className="my-4 ml-8"
					onClick={deleteActiveChapter}>
					Permanently Delete
				</Button>
			</DialogActions>
		</Dialog>
	)
}
