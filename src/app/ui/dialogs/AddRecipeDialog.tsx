import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ThemedButton from '../buttons/ThemedButton'
import ThemedTextField from '../inputs/ThemedTextField'
import { ChapterBase } from '@/app/lib/types'
import { useState } from 'react'

interface AddRecipeDialogProps {
  showAddRecipeDialog: boolean
  closeAddRecipeDialog: () => void
  setShowAddRecipeDialog: (v: boolean) => void
  chapters: ChapterBase[]
}

interface Inputs {
  recipeChapter?: string
  recipeName?: string
  recipeLink?: string
  newChapterName?: string
}

export default function AddRecipeDialog({
  showAddRecipeDialog,
  closeAddRecipeDialog,
  setShowAddRecipeDialog,
  chapters
}: AddRecipeDialogProps) {
  const [recipeChapter, setRecipeChapter] = useState<string | null>(null)
  const [newChapterName, setNewChapterName] = useState<string>('')
  const [recipeName, setRecipeName] = useState('')
  const [recipeLink, setRecipeLink] = useState('')

  const [saveDisabled, setSaveDisabled] = useState(true)

  function onRecipeChapterChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setRecipeChapter(value)
    checkValidity({ recipeChapter: value })
  }

  function onNewChapterInput(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setNewChapterName(value)
    checkValidity({ newChapterName: value })
  }

  function onRecipeNameInput(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setRecipeName(value)
    checkValidity({ recipeName: value })
  }

  function onRecipeLinkInput(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    // const isValid = value.match(/^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?(\/[^\s]*)?$/i)
    setRecipeLink(value)
    checkValidity({ recipeLink: value })
  }

  function checkValidity(v: Inputs) {
    const chapter = v.recipeChapter ?? recipeChapter
    const newChapter = v.newChapterName ?? newChapterName
    const name = v.recipeName ?? recipeName
    const link = v.recipeLink ?? recipeLink

    if (chapter && name && link && (chapter !== 'add' || newChapter)) {
      setSaveDisabled(false)
    } else {
      setSaveDisabled(true)
    }
  }

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
          <ThemedTextField
            size="small"
            label="Chapter"
            options={chapters}
            select
            enableAdd
            required
            onChange={onRecipeChapterChange}
          />
          {recipeChapter === 'add' && (
            <ThemedTextField
              size="small"
              label="New chapter name"
              required
              autoFocus
              onInput={onNewChapterInput}
            />
          )}
          <ThemedTextField size="small" label="Recipe name" required onInput={onRecipeNameInput} />
          <ThemedTextField size="small" label="Recipe link" required onInput={onRecipeLinkInput} />
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
          disabled={saveDisabled}
          onClick={() => {}}>
          Save
        </ThemedButton>
      </DialogActions>
    </Dialog>
  )
}
