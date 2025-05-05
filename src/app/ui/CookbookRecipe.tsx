import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import { useContext } from 'react'
import { RecipeWithNotes } from '../lib/types'
import InlineInput from './inputs/InlineInput'
import { users } from '../utils/firebase'
import { SessionContext } from '../utils/Session'
import { arrayRemove } from 'firebase/firestore'
import CookbookNotes from './CookbookNotes'

interface CookbookRecipeProps {
  recipe: RecipeWithNotes
}

export default function CookbookRecipe({ recipe }: CookbookRecipeProps) {
  async function saveTitle(newTitle: string) {
    if (user && recipe.name !== newTitle) {
      await users(user.id).recipes.update(recipe.id, { name: newTitle })
    }
  }

  async function cancelTitleEdit() {
    if (user && !recipe.name) {
      await users(user.id).chapters.update(recipe.id, { recipeOrder: arrayRemove(recipe.id) })
      await users(user.id).recipes.delete(recipe.id)
    }
  }

  async function saveNotes(newNotes: string) {
    if (user && recipe.notes !== newNotes) {
      await users(user.id).notes.update(recipe.id, newNotes)
    }
  }

  const user = useContext(SessionContext)

  const { name, link, notes } = recipe

  return (
    <Accordion
      className="recipe"
      sx={{
        backgroundColor: '#cfcfcfb9',
        margin: '6px 0',
        '.MuiAccordionSummary-root.Mui-expanded': { margin: 0, minHeight: '36px' }
      }}>
      <AccordionSummary
        sx={{
          minHeight: '36px',
          '.MuiAccordionSummary-content': { margin: '0' },
          '.Mui-expanded': { margin: '6px 0' }
        }}
        expandIcon={<ExpandMoreIcon className="text-mvc-green" />}>
        <InlineInput label={recipe.name} onSave={saveTitle} onCancel={cancelTitleEdit}>
          <a href={link} className="underline text-mvc-green">
            {name}
          </a>
        </InlineInput>
      </AccordionSummary>
      <CookbookNotes notes={notes} onSave={saveNotes} />
    </Accordion>
  )
}
