import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { type Dispatch, type SetStateAction, useEffect } from 'react'
import { SxProps } from '@mui/material/styles'

interface InlineInputEditActionsProps {
  onSave: () => Promise<void>
  styles: SxProps
  setEditing: Dispatch<SetStateAction<boolean>>
}

export default function InlineInputEditActions({
  onSave,
  styles,
  setEditing
}: InlineInputEditActionsProps) {
  useEffect(() => {
    async function keydownListener({ key }: KeyboardEvent) {
      if (key === 'Enter') {
        await onSave()
        setEditing(false)
      } else if (key === 'Escape') {
        setEditing(false)
      }
    }

    window.onkeydown = keydownListener

    return () => {
      window.onkeydown = null
    }
  }, [])

  return (
    <>
      <CloseRoundedIcon
        className="text-gray-500 hover:text-[red] hover:bg-mvc-[red]/20 hover:text-base transition-all rounded-sm"
        sx={{ ...styles }}
        onClick={(e) => {
          e.stopPropagation()
          setEditing(false)
        }}
      />
      <SaveRoundedIcon
        className="text-gray-500 hover:text-mvc-green hover:bg-mvc-green/20 hover:text-base transition-all rounded-sm"
        sx={{ ...styles }}
        onClick={async (e) => {
          e.stopPropagation()
          setEditing(false)
          await onSave()
        }}
      />
    </>
  )
}
