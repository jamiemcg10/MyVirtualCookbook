import { ChapterBase, NewRecipe } from '@/app/lib/types'

export interface DeleteChapterDialogProps {
  showDeleteDialog: boolean
  closeDeleteChapterDialog: () => void
  deleteActiveChapter: () => void
  setShowDeleteDialog: (v: boolean) => void
}

export interface EditRecipeDialogProps {
  showEditRecipeDialog: boolean
  closeEditRecipeDialog: () => void
  chapters: ChapterBase[]
  saveRecipe: (userId: string | undefined, recipe: NewRecipe) => Promise<void>
  edit?: boolean // might not need to be optional
}
