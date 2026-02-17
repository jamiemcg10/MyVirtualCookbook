import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown'
import CookbookRecipe from './CookbookRecipe'
import { RecipeWithNotes } from '../lib/types'
import { users } from '../lib/utils/firebase'
import { useContext, MouseEvent, useState } from 'react'
import { SessionContext, updateCookbook } from '../lib/utils/Session'
import InlineInput from './inputs/InlineInput'
import { arrayUnion } from 'firebase/firestore'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import { sharedMiniButtonStyles } from '../lib/styles/sharedMiniButtonStyles'
import { CookbookChapterProps } from '../lib/types/ui'
import { Droppable, Draggable } from '@hello-pangea/dnd'
import clsx from 'clsx'
import Collapse from '@mui/material/Collapse'

export default function CookbookChapter({
  chapter,
  showEditRecipeDialog,
  setShowDeleteDialog
}: CookbookChapterProps) {
  const mapRecipes = (recipes: RecipeWithNotes[]) => {
    return recipes.map((recipe, i) => {
      return (
        <Draggable key={recipe.id} draggableId={recipe.id} index={i}>
          {(provided, _snapshot) => (
            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
              <CookbookRecipe
                recipe={recipe}
                onEdit={() =>
                  showEditRecipeDialog({
                    chapterId: chapter.id,
                    name: recipe.name,
                    link: recipe.link,
                    recipeId: recipe.id
                  })
                }
                key={recipe.id}
                chapterId={chapter.id}
              />
            </div>
          )}
        </Draggable>
      )
    })
  }

  async function saveTitle(newTitle: string) {
    if (!user?.id) return
    setChapterDisplayName(newTitle)

    if (!chapter.name) {
      await Promise.all([
        users(user.id).chapters.set({ id: chapter.id, recipeOrder: [], name: newTitle }),
        users(user.id).update({ chapterOrder: arrayUnion(chapter.id) })
      ])
    } else if (chapter.name !== newTitle) {
      await users(user.id).chapters.update(chapter.id, { name: newTitle })
    }
  }

  async function cancelEdit() {
    if (user && !chapter.name && cookbook) {
      updateCookbook(cookbook.filter((c) => c.id !== chapter.id))
    }
  }

  function onShowDeleteDialog(e: MouseEvent<SVGSVGElement>) {
    e.stopPropagation()
    setShowDeleteDialog(true)
  }

  const { user, cookbook } = useContext(SessionContext)

  const [chapterDisplayName, setChapterDisplayName] = useState(chapter.name)
  const [chapterExpanded, setChapterExpanded] = useState(false)

  const recipes = mapRecipes(chapter.recipes || [])

  return (
    <Collapse in={chapterExpanded} collapsedSize="2.375rem">
      <div className="rounded-md bg-[white]/[.867] pb-2">
        <Droppable
          droppableId={`chapter-${chapter.id}`}
          key={`chapter-${chapter.id}`}
          isDropDisabled={chapterExpanded}>
          {(provided, snapshot) => {
            return (
              <div
                className={clsx(
                  'flex items-center rounded-sm h-[2.375rem] px-4 transition-colors cursor-pointer',
                  snapshot.isDraggingOver && !chapterExpanded ? 'bg-mvc-green' : 'bg-white/0'
                )}
                onClick={() => setChapterExpanded(!chapterExpanded)}
                ref={provided.innerRef}
                {...provided.droppableProps}>
                <ExpandCircleDownIcon
                  sx={{
                    color: 'gray',
                    rotate: chapterExpanded ? '180deg' : '0deg',
                    transition: 'rotate 250ms'
                  }}
                />
                <div className="ml-4 basis-full">
                  <InlineInput
                    label={chapter.name || ''}
                    onSave={saveTitle}
                    autoFocus={!chapter.name}
                    onCancel={cancelEdit}
                    onBlur={() => {
                      if (!chapter.name) {
                        cancelEdit()
                      }
                    }}>
                    <h1 className="text-gray-700">{chapterDisplayName}</h1>
                  </InlineInput>
                </div>
                <div className="relative h-4 w-6">
                  <DeleteRoundedIcon
                    sx={sharedMiniButtonStyles}
                    onClick={onShowDeleteDialog}
                    className="text-gray-500 hover:text-red-600 hover:bg-red-600/20 absolute rounded"
                  />
                </div>
              </div>
            )
          }}
        </Droppable>
        <Droppable droppableId={chapter.id} key={chapter.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={clsx(
                'flex flex-col p-0 py-2 gap-[6px] mx-4 mb-2 rounded-sm transition-colors',
                snapshot.isDraggingOver ? 'bg-mvc-green/80' : 'bg-[white]/0'
              )}>
              {recipes}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </Collapse>
  )
}
