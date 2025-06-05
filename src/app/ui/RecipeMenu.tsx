import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem from '@mui/material/MenuItem'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import { useState, useRef } from 'react'
import Paper from '@mui/material/Paper'
import { ClickAwayListener } from '@mui/material'
import { RecipeMenuProps } from '../lib/types/ui'

export default function RecipeMenu({ onEdit, onDelete }: RecipeMenuProps) {
  const menuBtnRef = useRef<HTMLButtonElement | null>(null)

  function calculatePosition() {
    const cookbookEl = document.getElementById('cookbook')
    const searchDialogEl = document.getElementById('cookbook')
    const referenceEl = searchDialogEl || cookbookEl

    if (!menuBtnRef.current || !referenceEl) return

    const placeAbove =
      referenceEl.getBoundingClientRect().height -
        menuBtnRef.current.getBoundingClientRect().bottom <=
      100

    return {
      position: 'absolute',
      zIndex: 1,
      right: 0,
      overflow: 'hidden',
      ...(placeAbove && { bottom: menuBtnRef.current?.clientHeight })
    }
  }

  const [open, setOpen] = useState(false)

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className="relative pl-4" onMouseLeave={() => setOpen(false)}>
        <IconButton
          size="small"
          className="invisible group-hover:visible [@media(hover:none)]:visible"
          ref={menuBtnRef}
          onClick={(e) => {
            e.stopPropagation()
            setOpen(!open)
          }}>
          <MoreHorizIcon fontSize="small" />
        </IconButton>
        {open ? (
          <Paper sx={calculatePosition()}>
            <MenuItem
              sx={{
                '&:hover': {
                  backgroundColor: '#ddd'
                }
              }}
              onClick={(e) => {
                e.stopPropagation()
                setOpen(false)
                setTimeout(() => {
                  onEdit()
                }, 100)
              }}>
              <ListItemIcon>
                <EditRoundedIcon fontSize="small" />
              </ListItemIcon>
              Edit
            </MenuItem>
            <MenuItem
              sx={{
                '&:hover': {
                  backgroundColor: '#ddd'
                }
              }}
              onClick={async () => await onDelete()}>
              <ListItemIcon>
                <DeleteRoundedIcon fontSize="small" />
              </ListItemIcon>
              Delete
            </MenuItem>
          </Paper>
        ) : null}
      </div>
    </ClickAwayListener>
  )
}
