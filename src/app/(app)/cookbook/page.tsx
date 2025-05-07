'use client'

import CookbookChapter from '@/app/ui/CookbookChapter'
import React, { useContext, useEffect, useState } from 'react'
import { getCookbook } from '../../utils/cookbook'
import { SessionContext } from '@/app/utils/Session'
import { ChapterBase, ChapterWithRecipeNotes } from '@/app/lib/types'
import { CircularProgress, ThemeProvider } from '@mui/material'
import { theme } from '@/app/ui/.theme/theme'
import ThemedButton from '@/app/ui/buttons/ThemedButton'
import AddIcon from '@mui/icons-material/Add'
import { arrayRemove } from 'firebase/firestore'
import { users } from '@/app/utils/firebase'
import DeleteChapterDialog from '@/app/ui/dialogs/DeleteChapterDialog'
import AddRecipeDialog from '@/app/ui/dialogs/AddRecipeDialog'
import { addNewChapter } from '@/app/utils/addNewChapter'
import { addNewRecipe } from '@/app/utils/addNewRecipe'

export default function Cookbook() {
  const user = useContext(SessionContext)
  const [cookbook, setCookbook] = useState<ChapterWithRecipeNotes[] | null>(null)
  const [cookbookChapters, setCookbookChapters] = useState<ChapterBase[]>([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showAddRecipeDialog, setShowAddRecipeDialog] = useState(false)
  const [chapterToDelete, setChapterToDelete] = useState<string | null>(null)

  function openDeleteChapterDialog(id: string) {
    setChapterToDelete(id)
    setShowDeleteDialog(true)
  }

  function closeDeleteChapterDialog() {
    setChapterToDelete(null)
    setShowDeleteDialog(false)
  }

  async function deleteActiveChapter() {
    // TODO: Cascade delete recipes in chapter - do on server side
    if (!user || !chapterToDelete) return

    await users(user.id).update({ chapterOrder: arrayRemove(chapterToDelete) })
    await users(user.id).chapters.delete(chapterToDelete)
    closeDeleteChapterDialog()
  }

  useEffect(() => {
    window.history.replaceState(null, '', '/cookbook')

    user &&
      getCookbook(user.id).subscribe((v) => {
        setCookbook(v)
        const chapters = v.map((chapter) => {
          return { id: chapter.id, name: chapter.name }
        })
        setCookbookChapters(chapters)
      })
  }, [user])

  return (
    <div className="flex h-full flex-col">
      {cookbook ? (
        <>
          <div>
            <ThemedButton
              color="mvc-green"
              className="my-4 ml-8"
              startIcon={
                <AddIcon
                  fontSize="small"
                  style={{
                    marginRight: -7
                  }}
                />
              }
              onClick={() => addNewChapter(user?.id)}>
              Add Chapter
            </ThemedButton>
            <ThemedButton
              color="mvc-yellow"
              className="my-4 ml-8"
              startIcon={
                <AddIcon
                  fontSize="small"
                  style={{
                    marginRight: -7
                  }}
                />
              }
              onClick={() => setShowAddRecipeDialog(true)}>
              Add Recipe
            </ThemedButton>
          </div>
          <div className="px-8 flex flex-col space-y-2 grow">
            {cookbook.length &&
              cookbook.map((chapter) => {
                return (
                  <CookbookChapter
                    chapter={chapter}
                    setShowDeleteDialog={() => openDeleteChapterDialog(chapter.id)}
                    key={chapter.id}
                  />
                )
              })}
            {!cookbook.length && (
              <div>Your cookbook is empty. Add chapters and recipes to get started.</div>
            )}
          </div>
          <DeleteChapterDialog
            showDeleteDialog={showDeleteDialog}
            closeDeleteChapterDialog={closeDeleteChapterDialog}
            deleteActiveChapter={deleteActiveChapter}
            setShowDeleteDialog={setShowDeleteDialog}
          />
          <AddRecipeDialog
            showAddRecipeDialog={showAddRecipeDialog}
            closeAddRecipeDialog={() => setShowAddRecipeDialog(false)}
            chapters={cookbookChapters}
            saveRecipe={addNewRecipe}
          />
        </>
      ) : (
        <div className="grow justify-center items-center flex">
          <ThemeProvider theme={theme}>
            <CircularProgress size="65px" color="mvc-yellow" />
          </ThemeProvider>
        </div>
      )}
    </div>
  )
}
