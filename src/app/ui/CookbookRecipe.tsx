import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionActions from '@mui/material/AccordionActions'
import { useState, useRef, useEffect } from 'react'
import cs from 'clsx'
import ThemedButton from './buttons/ThemedButton'
import { Chilanka } from 'next/font/google'
import { RecipeWithNotes } from '../lib/types'

const chilanka = Chilanka({ weight: '400', preload: false })

interface CookbookRecipeProps {
  recipe: RecipeWithNotes
}

export default function CookbookRecipe({ recipe }: CookbookRecipeProps) {
  const [editing, setEditing] = useState(false)
  const notesElRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (notesElRef.current) notesElRef.current.innerText = notes
  }, [])

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
        <a href={link} className="underline text-mvc-green">
          {name}
        </a>
      </AccordionSummary>
      <AccordionDetails className="py-0">
        <textarea
          rows={3}
          className={cs(
            'w-full text-md font-bold resize-none bg-yellow-100 rounded-md p-1 focus-visible:notes-focus-glow outline-none',
            !editing && 'border-2 border-transparent pointer-events-none',
            editing && 'border-2 border-mvc-green',
            chilanka.className
          )}
          ref={notesElRef}></textarea>
      </AccordionDetails>
      <AccordionActions className="pt-0">
        {!editing ? (
          <ThemedButton
            color="mvc-yellow"
            onClick={() => {
              setEditing(true)
              notesElRef?.current?.focus()
            }}>
            Edit
          </ThemedButton>
        ) : (
          <>
            <ThemedButton
              color="mvc-gray"
              variant="outlined"
              onClick={() => {
                setEditing(false)
              }}>
              Cancel
            </ThemedButton>
            <ThemedButton
              onClick={() => {
                setEditing(false)
              }}
              color="mvc-green">
              Save
            </ThemedButton>
          </>
        )}
      </AccordionActions>
    </Accordion>
  )
}
