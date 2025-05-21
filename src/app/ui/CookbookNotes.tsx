import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionActions from '@mui/material/AccordionActions'
import cs from 'clsx'
import ThemedButton from './buttons/ThemedButton'
import { Chilanka } from 'next/font/google'
import { useEffect, useRef, useState } from 'react'
import { CookbookNotesProps } from '../lib/types/ui'

const chilanka = Chilanka({ weight: '400', preload: false })

export default function CookbookNotes({ notes, onSave }: CookbookNotesProps) {
  const [editing, setEditing] = useState(false)

  const notesElRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (notesElRef.current) notesElRef.current.innerText = notes
  }, [])

  return (
    <>
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
              onClick={async () => {
                setEditing(false)
                onSave(notesElRef.current?.value || '')
              }}
              color="mvc-green">
              Save
            </ThemedButton>
          </>
        )}
      </AccordionActions>
    </>
  )
}
