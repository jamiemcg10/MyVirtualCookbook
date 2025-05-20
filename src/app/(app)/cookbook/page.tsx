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
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { users } from '@/app/utils/firebase'

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

  async function onDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result

    if (!user || !cookbook || !destination) return

    let newCookbook = cookbook

    // make quick update for ui
    const sourceIndex = cookbook?.findIndex((chapter) => chapter.id === source.droppableId)
    const destinationIndex = cookbook?.findIndex(
      (chapter) => chapter.id === destination?.droppableId
    )

    if (
      sourceIndex === null ||
      sourceIndex < 0 ||
      destinationIndex === null ||
      destinationIndex < 0
    )
      return

    const recipe = newCookbook[sourceIndex].recipes.splice(source.index, 1)

    newCookbook[destinationIndex].recipes.splice(destination?.index, 0, ...recipe)

    setCookbook([...newCookbook])

    // update db
    const oldRecipeOrder = cookbook[sourceIndex].recipeOrder

    oldRecipeOrder.splice(source.index, 1)

    if (source.droppableId !== destination.droppableId) {
      const newRecipeOrder = cookbook[destinationIndex].recipeOrder
      newRecipeOrder.splice(destination.index, 0, draggableId)

      await Promise.all([
        users(user.id).chapters.update(source.droppableId, { recipeOrder: oldRecipeOrder }),
        users(user.id).chapters.update(destination.droppableId, { recipeOrder: newRecipeOrder })
      ])
    } else {
      oldRecipeOrder.splice(destination.index, 0, draggableId)
      await users(user.id).chapters.update(source.droppableId, { recipeOrder: oldRecipeOrder })
    }
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
          <DragDropContext onDragEnd={onDragEnd}>
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
          </DragDropContext>
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
