import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
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

  const recipes = mapRecipes(chapter.recipes || [])

  return (
    <div className="rounded-md">
      <Accordion
        sx={{
          backgroundColor: '#ffffffdd',
          margin: '8px 0',
          '.MuiAccordionSummary-root.Mui-expanded': { margin: 0, minHeight: '38px' }
        }}>
        <Droppable droppableId={`chapter-${chapter.id}`} key={`chapter-${chapter.id}`}>
          {(provided, snapshot) => {
            return (
              <div ref={provided.innerRef}>
                <AccordionSummary
                  sx={{
                    minHeight: '38px',
                    flexDirection: 'row-reverse',
                    '.MuiAccordionSummary-content': { margin: '0', alignItems: 'center' },
                    '.Mui-expanded': { margin: '6px 0' }
                  }}
                  className={clsx(
                    'items-center rounded-sm',
                    snapshot.isDraggingOver && 'bg-mvc-green/80'
                  )}
                  expandIcon={<ExpandCircleDownIcon />}>
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
                </AccordionSummary>
              </div>
            )
          }}
        </Droppable>
        <Droppable droppableId={chapter.id} key={chapter.id}>
          {(provided, snapshot) => (
            <div ref={provided.innerRef}>
              <AccordionDetails
                className={clsx('p-0 pb-2', snapshot.isDraggingOver && 'bg-mvc-green/80')}>
                {recipes}
                {provided.placeholder}
              </AccordionDetails>
            </div>
          )}
        </Droppable>
      </Accordion>
    </div>
  )
}
