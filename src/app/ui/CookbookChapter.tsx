import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown'
import CookbookRecipe from './CookbookRecipe'
import { RecipeWithNotes, ChapterWithRecipeNotes } from '../lib/types'

interface CookbookChapterProps {
  chapter: ChapterWithRecipeNotes
}

const mapRecipes = (recipes: RecipeWithNotes[]) => {
  return recipes.map((recipe) => {
    return <CookbookRecipe recipe={recipe} key={recipe.id} />
  })
}

export default function CookbookChapter({ chapter }: CookbookChapterProps) {
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
          <h1 className="text-gray-700">{chapter.name}</h1>
        </AccordionSummary>
        <AccordionDetails className="p-0 pb-2">{recipes}</AccordionDetails>
      </Accordion>
    </div>
  )
}
