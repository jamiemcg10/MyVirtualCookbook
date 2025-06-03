import { DialogActions, DialogContent, DialogTitle } from '@mui/material'
import ThemedButton from '../buttons/ThemedButton'
import ThemedTextField from '../inputs/ThemedTextField'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { SessionContext } from '@/app/lib/utils/Session'
import { EditRecipeDialogProps } from '@/app/lib/types/ui/dialogs'
import BaseDialog from './BaseDialog'

interface Inputs {
  recipeChapterId?: string
  recipeName?: string
  recipeLink?: string
  newChapterName?: string
}

export default function EditRecipeDialog({
  recipe,
  showEditRecipeDialog,
  closeEditRecipeDialog,
  saveRecipe
}: EditRecipeDialogProps) {
  const { user, cookbook } = useContext(SessionContext)

  const [chapters, setChapters] = useState(getChapters())
  const [recipeChapterId, setRecipeChapterId] = useState<string>('')
  const [newChapterName, setNewChapterName] = useState<string>('')
  const [recipeName, setRecipeName] = useState('')
  const [recipeLink, setRecipeLink] = useState('')
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved' | null>(null)

  const [saveDisabled, setSaveDisabled] = useState(true)
  const [invalidUrl, setInvalidUrl] = useState(false)

  function getChapters() {
    return (
      cookbook?.map((chapter) => {
        return { id: chapter.id, name: chapter.name }
      }) || []
    )
  }

  function resetRecipe() {
    setRecipeChapterId('')
    setNewChapterName('')
    setRecipeName('')
    setSaveStatus(null)
  }

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

  function noChanges() {
    if (!recipe) return false

    if (
      recipe.chapterId !== recipeChapterId ||
      recipe.name !== recipeName ||
      recipe.link !== recipeLink
    ) {
      return false
    }

    return true
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

  useEffect(() => {
    if (recipe) {
      setRecipeChapterId(recipe.chapterId)
      setRecipeName(recipe.name)
      setRecipeLink(recipe.link)

      checkValidity({
        recipeChapterId: recipe.chapterId,
        recipeName: recipe.name,
        recipeLink: recipe.link
      })
    }
  }, [recipe])

  useEffect(() => {
    setChapters(getChapters())
  }, [cookbook])

  return (
    <BaseDialog show={showEditRecipeDialog} closeFn={() => closeEditRecipeDialog()}>
      <DialogTitle>
        <div className="text-mvc-green font-medium">{recipe ? 'Edit' : 'Add'} Recipe</div>
      </DialogTitle>
      <DialogContent>
        <div className="flex flex-col space-y-4 mb-4 text-xs">
          <ThemedTextField
            size="small"
            label="Chapter"
            options={chapters}
            select
            enableAdd
            required
            defaultValue={recipe?.chapterId || ''}
            disabled={!!recipe}
            onChange={onRecipeChapterChange}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: {
                    color: 'var(--mvc-green)',
                    backgroundColor: 'var(--paper-bkg)'
                  }
                }
              }
            }}
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
          <ThemedTextField
            size="small"
            label="Recipe name"
            required
            defaultValue={recipe?.name || ''}
            onInput={onRecipeNameInput}
          />
          <ThemedTextField
            size="small"
            label="Recipe link"
            required
            onInput={onRecipeLinkInput}
            defaultValue={recipe?.link || ''}
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
            closeEditRecipeDialog()
            resetRecipe()
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

            if (noChanges()) {
              closeEditRecipeDialog()
              resetRecipe()
              return
            }

            setSaveStatus('saving')
            await saveRecipe(user?.id, {
              recipeId: recipe?.recipeId,
              name: recipeName,
              link: recipeLink,
              chapterId: recipeChapterId,
              newChapterName
            }).then(() => {
              setSaveStatus('saved')
              setTimeout(() => {
                closeEditRecipeDialog()
                resetRecipe()
              }, 500)
            })
          }}>
          Save
        </ThemedButton>
      </DialogActions>
      <div
        className={
          'flex-col italic items-center justify-center bg-[#f6e7ba]/80 h-full absolute top-0 left-0 w-full text-mvc-green' +
          (saveStatus ? ' flex' : ' hidden')
        }>
        {saveStatus === 'saved' ? 'Saved!' : 'Saving...'}
      </div>
    </BaseDialog>
  )
}
