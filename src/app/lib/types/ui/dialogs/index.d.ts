import { NewRecipe } from '@/app/lib/types'
import { ReactNode } from 'react'

export interface BaseDialogProps {
  children: ReactNode
  show: boolean
  fullHeight?: boolean
  closeFn: () => void
}

export interface DeleteChapterDialogProps {
  showDeleteDialog: boolean
  closeDeleteChapterDialog: () => void
  deleteActiveChapter: () => void
  setShowDeleteDialog: (v: boolean) => void
}

export interface EditRecipeDialogProps {
  recipe: NewRecipe | null
  showEditRecipeDialog: boolean
  closeEditRecipeDialog: () => void
  saveRecipe: (userId: string | undefined, recipe: NewRecipe) => Promise<void>
}

export interface SearchDialogProps {
  showSearchDialog: boolean
  setShowSearchDialog: Dispatch<SetStateAction<boolean>>
  showEditRecipeDialog: (v: NewRecipe) => void
}
