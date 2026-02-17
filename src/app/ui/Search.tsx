import ThemedIconButton from './buttons/ThemedIconButton'
import SearchIcon from '@mui/icons-material/Search'
import SearchDialog from './dialogs/SearchDialog'
import { useState } from 'react'
import { NewRecipe } from '../lib/types'
import { SearchProps } from '../lib/types/ui'

const searchIconSx = {
  marginY: '1rem',
  right: { xs: '2rem', sm: '3rem' },
  position: 'absolute'
}

export default function Search({ setEditDialogRecipe, setShowEditRecipeDialog }: SearchProps) {
  const [showDialog, setShowDialog] = useState(false)

  return (
    <>
      <ThemedIconButton
        color="mvc-white"
        onClick={() => setShowDialog(true)}
        disabled={showDialog}
        sx={searchIconSx}>
        <SearchIcon />
      </ThemedIconButton>

      <SearchDialog
        showSearchDialog={showDialog}
        setShowSearchDialog={setShowDialog}
        showEditRecipeDialog={(v: NewRecipe) => {
          setEditDialogRecipe(v)
          setShowEditRecipeDialog(true)
        }}
      />
    </>
  )
}
