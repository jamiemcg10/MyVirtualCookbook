import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import { useContext, useState } from 'react'
import InlineInput from './inputs/InlineInput'
import { users } from '../utils/firebase'
import { SessionContext } from '../utils/Session'
import { arrayRemove } from 'firebase/firestore'
import CookbookNotes from './CookbookNotes'
import RecipeMenu from './RecipeMenu'
import { CookbookRecipeProps } from '../lib/types/ui'

export default function CookbookRecipe({ recipe, chapterId }: CookbookRecipeProps) {
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

  async function deleteRecipe() {
    if (user) {
      await users(user.id).chapters.update(chapterId, { recipeOrder: arrayRemove(recipe.id) })
      await users(user.id).recipes.delete(recipe.id)
      await users(user.id).notes.delete(recipe.id)
    }
  }

  const user = useContext(SessionContext)

  const [rename, setRename] = useState(false)

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
        className="group"
        expandIcon={<ExpandMoreIcon className="text-mvc-green" />}>
        <div className="flex justify-between items-center w-full">
          <InlineInput
            label={recipe.name}
            onSave={saveTitle}
            onCancel={cancelTitleEdit}
            hideEditIcon
            editing={rename}
            setEditing={setRename}>
            <a href={link} className="underline text-mvc-green">
              {name}
            </a>
          </InlineInput>
          <RecipeMenu onRename={() => setRename(true)} onDelete={async () => deleteRecipe()} />
        </div>
      </AccordionSummary>
      <CookbookNotes notes={notes} onSave={saveNotes} />
    </Accordion>
  )
}
