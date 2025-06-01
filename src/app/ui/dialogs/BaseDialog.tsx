import { Dialog, IconButton, useTheme, useMediaQuery } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { BaseDialogProps } from '@/app/lib/types/ui/dialogs'
import { useEffect } from 'react'

export default function BaseDialog({ children, show, closeFn, fullHeight }: BaseDialogProps) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    function closeOnEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closeFn()
      }
    }
    document.addEventListener('keyup', closeOnEscape)

    return () => document.removeEventListener('keyup', closeOnEscape)
  }, [])

  return (
    <Dialog
      open={show}
      onClose={() => closeFn()}
      fullScreen={fullScreen}
      sx={{
        '.MuiDialog-paper': {
          paddingX: '32px',
          paddingY: '16px',
          height: { sm: fullHeight ? '100%' : 'auto' },
          backgroundColor: 'var(--paper-bkg)',
          width: '100%'
        }
      }}>
      {' '}
      <IconButton
        onClick={() => closeFn()}
        aria-label="close"
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[600]
        })}>
        <CloseIcon />
      </IconButton>
      {children}
    </Dialog>
  )
}
