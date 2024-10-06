import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown'
import CookbookRecipe from './CookbookRecipe'
import { RecipeWithNotes, ChapterWithRecipeNotes } from '../lib/types'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import { users } from '../utils/firebase'
import { useContext, useRef, useState } from 'react'
import { Input } from '@mui/material'
import { Roboto } from 'next/font/google'
import { SessionContext } from '../utils/Session'

interface CookbookChapterProps {
  chapter: ChapterWithRecipeNotes
}

const roboto = Roboto({ weight: '700', subsets: ['latin'] })

const mapRecipes = (recipes: RecipeWithNotes[]) => {
  return recipes.map((recipe) => {
    return <CookbookRecipe recipe={recipe} key={recipe.id} />
  })
}

const sharedButtonStyles = {
  fontSize: 14,
  marginLeft: 0.7,
  xtransitionDuration: '1000ms',
  transitionProperty: 'all',
  '&:hover': {
    fontSize: 16
  }
}

export default function CookbookChapter({ chapter }: CookbookChapterProps) {
  function editTitle() {
    const inputValue = (inputElRef?.current?.children[0] as HTMLInputElement).value
    user && users(user.id).chapters.update(chapter.id, { name: inputValue })
  }

  const user = useContext(SessionContext)
  const [editing, setEditing] = useState(false)
  const inputElRef = useRef<HTMLElement>()

  const recipes = mapRecipes(chapter.recipes)

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
          <div className="flex items-center">
            {!editing ? (
              <>
                <h1 className="text-gray-700">{chapter.name}</h1>
                <EditRoundedIcon
                  className="text-gray-500 hover:text-mvc-green hover:bg-mvc-green/20 hover:text-base transition-all duration-1000 rounded-sm"
                  sx={sharedButtonStyles}
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditing(true)
                  }}
                />
              </>
            ) : (
              <>
                <Input
                  ref={inputElRef}
                  className={roboto.className}
                  sx={roboto.style}
                  defaultValue={chapter.name}
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                />
                <SaveRoundedIcon
                  className="text-gray-500 hover:text-mvc-green hover:bg-mvc-green/20 hover:text-base transition-all duration-1000 rounded-sm"
                  sx={{ ...sharedButtonStyles }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditing(false)
                    editTitle()
                  }}
                />
              </>
            )}
          </div>
        </AccordionSummary>
        <AccordionDetails className="p-0 pb-2">{recipes}</AccordionDetails>
      </Accordion>
    </div>
  )
}
