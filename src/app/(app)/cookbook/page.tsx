'use client'

import CookbookChapter from '@/app/ui/CookbookChapter'
import React, { useContext, useEffect, useState } from 'react'
import { SessionContext, updateCookbook } from '@/app/lib/utils/Session'
import { NewRecipe } from '@/app/lib/types'
import ThemedButton from '@/app/ui/buttons/ThemedButton'
import AddIcon from '@mui/icons-material/Add'
import DeleteChapterDialog from '@/app/ui/dialogs/DeleteChapterDialog'
import EditRecipeDialog from '@/app/ui/dialogs/EditRecipeDialog'
import { addNewChapter } from '@/app/lib/utils/addNewChapter'
import { addNewRecipe } from '@/app/lib/utils/dbHelpers/addNewRecipe'
import { deleteChapter } from '@/app/lib/utils/dbHelpers/deleteChapter'
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd'
import { users } from '@/app/lib/utils/firebase'
import clsx from 'clsx'
import { redirect } from 'next/navigation'
import LoadingIcon from '@/app/ui/LoadingIcon'
import Search from '@/app/ui/Search'

export default function Cookbook() {
  const { user, cookbook } = useContext(SessionContext)

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditRecipeDialog, setShowEditRecipeDialog] = useState(false)
  const [editDialogRecipe, setEditDialogRecipe] = useState<NewRecipe | null>(null)
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
    if (!user || !chapterToDelete || !cookbook) return

    updateCookbook(cookbook.filter((c) => c.id !== chapterToDelete))

    const childrenToDelete = cookbook?.find(
      (chapter) => chapter.id === chapterToDelete
    )?.recipeOrder

    deleteChapter(user.id, chapterToDelete, childrenToDelete)

    closeDeleteChapterDialog()
  }

  async function onDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result

    if (!user || !cookbook || !destination) return

    const newCookbook = cookbook

    // if dragging chapter
    if (destination.droppableId === 'cookbook') {
      const movedChapter = newCookbook.splice(source.index, 1)
      newCookbook.splice(destination.index, 0, ...movedChapter)

      updateCookbook(newCookbook)

      const chapterOrder = newCookbook.map((chapter) => chapter.id)

      await users(user.id).update({ chapterOrder })

      return
    }

    // if dropping into a chapter - fix destination
    if (destination.droppableId.startsWith('chapter-')) {
      const newChapterId = destination.droppableId.split('-')[1]
      destination.droppableId = newChapterId
    }

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

    updateCookbook(newCookbook)

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
    if (!user) {
      redirect('/login')
    }
  }, [user, cookbook])

  return (
    <div className="flex flex-col h-full overflow-hidden" id="cookbook">
      {cookbook ? (
        <>
          <div
            style={{
              background: 'linear-gradient(180deg, #061f35, #061f3580 85%, transparent)',
              zIndex: 1,
              height: '80px'
            }}>
            <ThemedButton
              color="mvc-green"
              sx={{
                margin: '1rem 0 1rem 2rem'
              }}
              startIcon={
                <AddIcon
                  fontSize="small"
                  style={{
                    marginRight: -7
                  }}
                />
              }
              onClick={() => addNewChapter(user, cookbook)}>
              <span className="hidden sm:block">Add&nbsp;</span> Chapter
            </ThemedButton>
            <ThemedButton
              color="mvc-yellow"
              sx={{
                margin: {
                  xs: '1rem 0 1rem 1rem',
                  sm: '1rem 0 1rem 2rem'
                }
              }}
              startIcon={
                <AddIcon
                  fontSize="small"
                  style={{
                    marginRight: -7
                  }}
                />
              }
              onClick={() => setShowEditRecipeDialog(true)}>
              <span className="hidden sm:block">Add&nbsp;</span> Recipe
            </ThemedButton>
            <Search
              setEditDialogRecipe={setEditDialogRecipe}
              setShowEditRecipeDialog={setShowEditRecipeDialog}
            />
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="cookbook" key="cookbook" type="CookbookChapter">
              {(provided, snapshot) => {
                return (
                  <div
                    ref={provided.innerRef}
                    className={clsx(
                      'flex flex-col space-y-2 grow px-8 pt-2.5 pb-8 -mt-2.5 overflow-y-scroll',
                      snapshot.isDraggingOver && 'bg-mvc-yellow/30'
                    )}>
                    {cookbook.length
                      ? cookbook.map((chapter, i) => {
                          return (
                            <Draggable key={chapter.id} draggableId={chapter.id} index={i}>
                              {(provided, _snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}>
                                  <CookbookChapter
                                    chapter={chapter}
                                    showEditRecipeDialog={(v: NewRecipe) => {
                                      setEditDialogRecipe(v)
                                      setShowEditRecipeDialog(true)
                                    }}
                                    setShowDeleteDialog={() => openDeleteChapterDialog(chapter.id)}
                                    key={chapter.id}
                                  />
                                </div>
                              )}
                            </Draggable>
                          )
                        })
                      : null}
                    {provided.placeholder}
                    {!cookbook.length && (
                      <div className="text-mvc-yellow">
                        Your cookbook is empty. Add chapters and recipes to get started.
                      </div>
                    )}
                  </div>
                )
              }}
            </Droppable>
          </DragDropContext>
          <DeleteChapterDialog
            showDeleteDialog={showDeleteDialog}
            closeDeleteChapterDialog={closeDeleteChapterDialog}
            deleteActiveChapter={deleteActiveChapter}
            setShowDeleteDialog={setShowDeleteDialog}
          />
          <EditRecipeDialog
            recipe={editDialogRecipe}
            showEditRecipeDialog={showEditRecipeDialog}
            closeEditRecipeDialog={() => {
              setEditDialogRecipe(null)
              setShowEditRecipeDialog(false)
            }}
            saveRecipe={addNewRecipe}
          />
        </>
      ) : (
        <LoadingIcon />
      )}
    </div>
  )
}
