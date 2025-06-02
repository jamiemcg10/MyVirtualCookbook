import { DialogContent, DialogTitle, InputAdornment } from '@mui/material'
import ThemedTextField from '../inputs/ThemedTextField'
import SearchIcon from '@mui/icons-material/Search'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { SessionContext } from '@/app/lib/utils/Session'
import { SearchRecipe } from '@/app/lib/types'
import CookbookRecipe from '../CookbookRecipe'
import { SearchDialogProps } from '@/app/lib/types/ui/dialogs'
import BaseDialog from './BaseDialog'
import Scrollbar from 'react-smooth-scrollbar'

export default function SearchDialog({
  showEditRecipeDialog,
  showSearchDialog,
  setShowSearchDialog
}: SearchDialogProps) {
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

  useEffect(() => {
    filterRecipes(searchValue)
  }, [cookbook])

  return (
    <BaseDialog
      show={showSearchDialog}
      closeFn={() => {
        setSearchValue('')
        setFilteredRecipes(undefined)
        setShowSearchDialog(false)
      }}
      fullHeight>
      <DialogTitle>
        <div>
          <ThemedTextField
            placeholder="Search..."
            autoFocus
            onInput={onSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ color: 'var(--mvc-green)' }}>
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </div>
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
        <Scrollbar alwaysShowTracks={true}>
          <div className="text-mvc-green overflow-y-scroll">
            {searchValue
              ? filteredRecipes?.length
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
                : 'No recipes found'
              : 'Start typing to search'}
          </div>
        </Scrollbar>
      </DialogContent>
    </BaseDialog>
  )
}
