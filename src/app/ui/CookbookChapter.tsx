import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown'
import CookbookRecipe from './CookbookRecipe'
import { RecipeWithNotes } from '../lib/types'
import { users } from '../utils/firebase'
import { useContext, MouseEvent, useRef, useState, useEffect } from 'react'
import { SessionContext } from '../utils/Session'
import InlineInput from './inputs/InlineInput'
import { arrayRemove } from 'firebase/firestore'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import { sharedMiniButtonStyles } from '../utils/sharedMiniButtonStyles'
import { CookbookChapterProps } from '../lib/types/ui'
import invariant from 'tiny-invariant'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

export default function CookbookChapter({ chapter, setShowDeleteDialog }: CookbookChapterProps) {
  const mapRecipes = (recipes: RecipeWithNotes[]) => {
    return recipes.map((recipe) => {
      return <CookbookRecipe recipe={recipe} key={recipe.id} chapterId={chapter.id} />
    })
  }

  async function saveTitle(newTitle: string) {
    if (!user?.id) return

    if (chapter.name !== newTitle) {
      await users(user.id).chapters.update(chapter.id, { name: newTitle })
    }
  }

  async function cancelEdit() {
    if (user && !chapter.name) {
      await users(user.id).update({ chapterOrder: arrayRemove(chapter.id) })
      await users(user.id).chapters.delete(chapter.id)
    }
  }

  function onShowDeleteDialog(e: MouseEvent<SVGSVGElement>) {
    e.stopPropagation()
    setShowDeleteDialog(true)
  }

  const user = useContext(SessionContext)

  const recipes = mapRecipes(chapter?.recipes || [])

  // drag and drop
  type HoveredState = 'idle' | 'validMove' | 'invalidMove'

  const ref = useRef(null)
  const [state, setState] = useState<HoveredState>('idle')

  useEffect(() => {
    const el = ref.current
    invariant(el)

    return dropTargetForElements({
      element: el,
      getData: () => ({ location: { id: chapter.id, name: chapter.name } }) // probably dont need name
    })
  }, [])

  return (
    <div className="rounded-md">
      <Accordion
        ref={ref}
        sx={{
          backgroundColor: '#ffffffdd',
          margin: '8px 0',
          '.MuiAccordionSummary-root.Mui-expanded': { margin: 0, minHeight: '38px' }
        }}>
        <AccordionSummary
          sx={{
            minHeight: '38px',
            flexDirection: 'row-reverse',
            '.MuiAccordionSummary-content': { margin: '0', alignItems: 'center' },
            '.Mui-expanded': { margin: '6px 0' }
          }}
          className="items-center"
          expandIcon={<ExpandCircleDownIcon />}>
          <div className="ml-4 basis-full">
            <InlineInput
              label={chapter.name || ''}
              onSave={saveTitle}
              autoFocus={!chapter?.name}
              onCancel={cancelEdit}>
              <h1 className="text-gray-700">{chapter?.name}</h1>
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
        <AccordionDetails className="p-0 pb-2">{recipes}</AccordionDetails>
      </Accordion>
    </div>
  )
}
