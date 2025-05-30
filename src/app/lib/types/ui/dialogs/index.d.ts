import { ChapterBase, NewRecipe } from '@/app/lib/types'

export interface DeleteChapterDialogProps {
  showDeleteDialog: boolean
  closeDeleteChapterDialog: () => void
  deleteActiveChapter: () => void
  setShowDeleteDialog: (v: boolean) => void
}

export interface EditRecipeDialogProps {
  recipe: Recipe | null
  showEditRecipeDialog: boolean
  closeEditRecipeDialog: () => void
  saveRecipe: (userId: string | undefined, recipe: NewRecipe) => Promise<void>
}
