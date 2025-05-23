import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ThemedButton from '../buttons/ThemedButton'
import ThemedTextField from '../inputs/ThemedTextField'
import { ChangeEvent, useContext, useState } from 'react'
import { SessionContext } from '@/app/utils/Session'
import { AddRecipeDialogProps } from '@/app/lib/types/ui/dialogs'

interface Inputs {
  recipeChapterId?: string
  recipeName?: string
  recipeLink?: string
  newChapterName?: string
}

export default function AddRecipeDialog({
  showAddRecipeDialog,
  closeAddRecipeDialog,
  chapters,
  saveRecipe
}: AddRecipeDialogProps) {
  const user = useContext(SessionContext)

  const [recipeChapterId, setRecipeChapterId] = useState<string>('')
  const [newChapterName, setNewChapterName] = useState<string>('')
  const [recipeName, setRecipeName] = useState('')
  const [recipeLink, setRecipeLink] = useState('')
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved' | null>(null)

  const [saveDisabled, setSaveDisabled] = useState(true)
  const [invalidUrl, setInvalidUrl] = useState(false)

  function onRecipeChapterChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setRecipeChapterId(value)
    checkValidity({ recipeChapterId: value })
  }

  function onNewChapterInput(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setNewChapterName(value)
    checkValidity({ newChapterName: value })
  }

  function onRecipeNameInput(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setRecipeName(value)
    checkValidity({ recipeName: value })
  }

  function onRecipeLinkInput(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value

    setRecipeLink(value)
    checkValidity({ recipeLink: value })
  }

  function isValidUrl() {
    const isValidUrl = recipeLink.match(
      /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(:\d+)?(\/[^\s]*)?$/i
    )
    setInvalidUrl(isValidUrl ? false : true)
    return isValidUrl
  }

  function checkValidity(v: Inputs) {
    const chapter = v.recipeChapterId ?? recipeChapterId
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
          {recipeChapterId === 'add' && (
            <ThemedTextField
              size="small"
              label="New chapter name"
              required
              autoFocus
              onInput={onNewChapterInput}
            />
          )}
          <ThemedTextField size="small" label="Recipe name" required onInput={onRecipeNameInput} />
          <ThemedTextField
            size="small"
            label="Recipe link"
            required
            onInput={onRecipeLinkInput}
            helperText={invalidUrl ? 'Invalid URL' : ''}
            error={invalidUrl}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <ThemedButton
          variant="contained"
          color="mvc-gray"
          className="my-4 ml-8"
          onClick={() => {
            closeAddRecipeDialog()
          }}>
          <span>Cancel</span>
        </ThemedButton>
        <ThemedButton
          color="mvc-green"
          variant="contained"
          className="my-4 ml-8"
          disabled={saveDisabled}
          onClick={async () => {
            if (!isValidUrl()) return

            setSaveStatus('saving')
            await saveRecipe(user?.id, {
              recipeName,
              recipeLink,
              chapterId: recipeChapterId,
              newChapterName
            }).then(() => {
              setSaveStatus('saved')
              setTimeout(() => {
                closeAddRecipeDialog()
                setSaveStatus(null)
              }, 500)
            })
          }}>
          Save
        </ThemedButton>
      </DialogActions>
      <div
        className={
          'flex-col italic items-center justify-center bg-mvc-gray/75 h-full absolute w-full' +
          (saveStatus ? ' flex' : ' hidden')
        }>
        {saveStatus === 'saved' ? 'Saved!' : 'Saving...'}
      </div>
    </Dialog>
  )
}
