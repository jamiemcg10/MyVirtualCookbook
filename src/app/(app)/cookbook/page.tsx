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
import DeleteChapterDialog from '@/app/ui/dialogs/DeleteChapterDialog'
import AddRecipeDialog from '@/app/ui/dialogs/AddRecipeDialog'
import { addNewChapter } from '@/app/utils/addNewChapter'
import { addNewRecipe } from '@/app/utils/addNewRecipe'
import { deleteChapter } from '@/app/utils/deleteChapter'
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

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
    if (!user || !chapterToDelete) return

    const childrenToDelete = cookbook?.find(
      (chapter) => chapter.id === chapterToDelete
    )?.recipeOrder

    deleteChapter(user.id, chapterToDelete, childrenToDelete)

    closeDeleteChapterDialog()
  }
  useEffect(() => {
    window.history.replaceState(null, '', '/cookbook')

    if (user) {
      getCookbook(user.id).subscribe((v) => {
        setCookbook(v)
        const chapters = v.map((chapter) => {
          return { id: chapter.id, name: chapter.name }
        })
        setCookbookChapters(chapters)
      })
    }
  }, [user])

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0]

        console.log({ destination })

        if (!destination) {
          return
        }

        const destinationLocation = destination.data.location
        const sourceLocation = source.data.location
        // can also get data from source

        console.log({ destinationLocation, sourceLocation, source })
      }
    })
  }, [])

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {cookbook ? (
        <>
          <div
            style={{
              background: 'linear-gradient(180deg, #061f35, #061f3580 85%, transparent)',
              zIndex: 1,
              height: '86px'
            }}>
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
          <div className="flex flex-col space-y-2 grow px-8 pt-2.5 -mt-2.5 overflow-y-scroll">
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
