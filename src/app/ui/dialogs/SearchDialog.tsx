import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  useMediaQuery,
  useTheme
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ThemedTextField from '../inputs/ThemedTextField'
import SearchIcon from '@mui/icons-material/Search'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { SessionContext } from '@/app/utils/Session'
import { SearchRecipe } from '@/app/lib/types'
import CookbookRecipe from '../CookbookRecipe'
import { SearchDialogProps } from '@/app/lib/types/ui/dialogs'

export default function SearchDialog({
  showEditRecipeDialog,
  showSearchDialog,
  setShowSearchDialog
}: SearchDialogProps) {
  useEffect(() => {
    function closeOnEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setShowSearchDialog(false)
      }
    }
    document.addEventListener('keyup', closeOnEscape)

    return () => document.removeEventListener('keyup', closeOnEscape)
  }, [])

  const { cookbook } = useContext(SessionContext)
  const recipes = cookbook?.flatMap((chapter) =>
    chapter.recipes.map((r) => {
      return { ...r, chapterId: chapter.id }
    })
  )

  const [searchValue, setSearchValue] = useState('')
  const [filteredRecipes, setFilteredRecipes] = useState<SearchRecipe[] | undefined>(undefined)

  function onSearch(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setSearchValue(value)

    filterRecipes(value)
  }

  function filterRecipes(searchTerm: string) {
    const filteredRecipes = recipes?.filter((r) => {
      return (
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.link.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.notes.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })

    setFilteredRecipes(filteredRecipes ? [...filteredRecipes] : undefined)
  }

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Dialog
      open={showSearchDialog}
      fullScreen={fullScreen}
      sx={{
        '.MuiDialog-paper': {
          height: { sm: '100%' },
          backgroundColor: 'var(--mvc-yellow)',
          width: '100%'
        }
      }}>
      <IconButton
        onClick={() => setShowSearchDialog(false)}
        aria-label="close"
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500]
        })}>
        <CloseIcon />
      </IconButton>
      <DialogTitle>
        <div className="w-11/12">
          <ThemedTextField
            placeholder="Search..."
            autoFocus
            onInput={onSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </div>
      </DialogTitle>
      <DialogContent>
        <div>
          {searchValue
            ? filteredRecipes?.map((recipe) => {
                return (
                  <CookbookRecipe
                    chapterId={recipe.chapterId}
                    recipe={recipe}
                    onEdit={() =>
                      showEditRecipeDialog({
                        chapterId: recipe.chapterId,
                        name: recipe.name,
                        link: recipe.link,
                        recipeId: recipe.id
                      })
                    }
                    key={recipe.id}
                  />
                )
              })
            : 'Start typing to search'}
        </div>
      </DialogContent>
    </Dialog>
  )
}
