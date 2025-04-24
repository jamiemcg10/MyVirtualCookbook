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
import { arrayRemove, arrayUnion } from 'firebase/firestore'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import { sharedMiniButtonStyles } from '../utils/sharedMiniButtonStyles'
import ThemedButton from './buttons/ThemedButton'
import AddIcon from '@mui/icons-material/Add'
import { uid } from 'uid'

interface CookbookChapterProps {
  chapter: ChapterWithRecipeNotes
  setShowDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>
  key: string
}

// this isn't being used
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

export default function CookbookChapter({ chapter, setShowDeleteDialog }: CookbookChapterProps) {
  async function addNewRecipe() {
    // move to new file
    if (!user) return

    const newRecipe = {
      id: uid(8),
      name: '',
      link: ''
    }

    await users(user.id).recipes.set(newRecipe)
    await users(user.id).chapters.update(chapter.id, { recipeOrder: arrayUnion(newRecipe.id) })
    await users(user.id).notes.set({ notes: '', id: newRecipe.id })
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

  function onShowDeleteDialog(e: React.MouseEvent<SVGSVGElement>) {
    e.stopPropagation()
    setShowDeleteDialog(true)
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
              focusOnLoad={!chapter?.name}
              onCancel={cancelEdit}>
              <h1 className="text-gray-700">{chapter?.name}</h1>
            </InlineInput>
          </div>
          <ThemedButton
            color="mvc-green"
            variant="text"
            size="small"
            className="shrink-0 ml-8"
            onClick={(e) => {
              e.stopPropagation()
              addNewRecipe()
            }}
            startIcon={
              <AddIcon
                style={{
                  height: 20,
                  width: 20,
                  marginRight: '-7'
                }}
              />
            }>
            <span>Add Recipe</span>
          </ThemedButton>
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
