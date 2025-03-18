import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown'
import CookbookRecipe from './CookbookRecipe'
import { RecipeWithNotes, ChapterWithRecipeNotes } from '../lib/types'
import { users } from '../utils/firebase'
import { useContext } from 'react'
import { SessionContext } from '../utils/Session'
import InlineInput from './InlineInput'
import { uid } from 'uid'
import { arrayUnion } from 'firebase/firestore'

interface CookbookChapterProps {
  chapter?: ChapterWithRecipeNotes
  setShowChapterAdd?: (v: boolean) => void
}

declare module '@mui/material/InputBase' {
  // eslint-disable-next-line no-unused-vars
  interface InputBasePropsColorOverrides {
    'mvc-green': true
    'mvc-yellow': true
    'mvc-white': true
    'mvc-gray': true
  }
}

const mapRecipes = (recipes: RecipeWithNotes[]) => {
  return recipes.map((recipe) => {
    return <CookbookRecipe recipe={recipe} key={recipe.id} />
  })
}

function getNewChapter(name: string) {
  return {
    id: uid(8),
    name,
    recipes: [],
    recipeOrder: []
  }
}

export default function CookbookChapter({ chapter, setShowChapterAdd }: CookbookChapterProps) {
  async function saveTitle(newTitle: string) {
    if (!user?.id) return

    if (chapter && chapter.name !== newTitle) {
      await users(user.id).chapters.update(chapter.id, { name: newTitle })
    } else if (!chapter) {
      const newChapter = getNewChapter(newTitle)
      setShowChapterAdd && setShowChapterAdd(false)

      await users(user.id).chapters.set(newChapter.id, newChapter)
      await users(user.id).update({ chapterOrder: arrayUnion(newChapter.id) })
    }
  }

  function cancelEdit() {
    setShowChapterAdd && setShowChapterAdd(false)
  }

  const user = useContext(SessionContext)

  const recipes = mapRecipes(chapter?.recipes || [])

  return (
    <div className="rounded-md">
      <Accordion
        sx={{
          backgroundColor: '#ffffffdd',
          margin: '8px 0',
          '.MuiAccordionSummary-root.Mui-expanded': { margin: 0, minHeight: '38px' }
        }}>
        <AccordionSummary
          sx={{
            minHeight: '38px',
            '.MuiAccordionSummary-content': { margin: '0' },
            '.Mui-expanded': { margin: '6px 0' }
          }}
          expandIcon={<ExpandCircleDownIcon />}>
          <InlineInput
            label={chapter?.name || ''}
            onSave={saveTitle}
            focusOnLoad={!chapter?.name}
            onCancel={cancelEdit}>
            <h1 className="text-gray-700">{chapter?.name}</h1>
          </InlineInput>
        </AccordionSummary>
        <AccordionDetails className="p-0 pb-2">{recipes}</AccordionDetails>
      </Accordion>
    </div>
  )
}

// HIDE ACCORDION if empty
