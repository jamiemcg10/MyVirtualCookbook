import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem from '@mui/material/MenuItem'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import { useState } from 'react'
import Paper from '@mui/material/Paper'
import { ClickAwayListener } from '@mui/material'
import { RecipeMenuProps } from '../lib/types/ui'

export default function RecipeMenu({ onRename, onDelete }: RecipeMenuProps) {
  const [open, setOpen] = useState(false)

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className="relative" onMouseLeave={() => setOpen(false)}>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation()
            setOpen(!open)
          }}>
          <MoreHorizIcon fontSize="small" />
        </IconButton>
        {open ? (
          <Paper sx={{ position: 'absolute', zIndex: 1, right: 0 }}>
            <MenuItem
              onClick={(e) => {
                e.stopPropagation()
                setOpen(false)
                setTimeout(() => {
                  onRename()
                }, 100)
              }}>
              <ListItemIcon>
                <EditRoundedIcon fontSize="small" />
              </ListItemIcon>
              Rename
            </MenuItem>
            <MenuItem onClick={async () => await onDelete()}>
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
