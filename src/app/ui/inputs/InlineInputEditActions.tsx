import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { type Dispatch, type SetStateAction, useEffect } from 'react'
import { SxProps } from '@mui/material/styles'
import clsx from 'clsx'

interface InlineInputEditActionsProps {
  onSave: () => Promise<void>
  onCancel: () => void
  styles: SxProps
  setEditing: Dispatch<SetStateAction<boolean>>
  saveDisabled: boolean
}

export default function InlineInputEditActions({
  onSave,
  onCancel,
  styles,
  setEditing,
  saveDisabled
}: InlineInputEditActionsProps) {
  useEffect(() => {
    async function keydownListener({ key }: KeyboardEvent) {
      if (key === 'Enter') {
        await onSave()
        setEditing(false)
      } else if (key === 'Escape') {
        onCancel()
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
          onCancel()
          setEditing(false)
        }}
      />
      <SaveRoundedIcon
        className={clsx('text-gray-500', {
          'hover:text-mvc-green hover:bg-mvc-green/20 hover:text-base transition-all rounded-sm':
            !saveDisabled,
          'cursor-default': saveDisabled
        })}
        sx={{ ...styles }}
        onClick={async (e) => {
          e.stopPropagation()

          if (saveDisabled) return

          setEditing(false)
          await onSave()
        }}
      />
    </>
  )
}
