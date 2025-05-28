import type { Dispatch, SetStateAction } from 'react'
import type { RecipeWithNotes } from '../lib/types'
import { ChapterWithRecipeNotes } from '../lib/types'

export interface CookbookChapterProps {
  chapter: ChapterWithRecipeNotes
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>
  showEditRecipeDialog: (v: NewRecipe) => void
  key: string
}

export interface CookbookNotesProps {
  notes: string
  onSave: (notes: string) => void
}

export interface CookbookRecipeProps {
  chapterId: string
  recipe: RecipeWithNotes
  onEdit: () => void
}

export interface RecipeMenuProps {
  onEdit: () => void
  onDelete: () => Promise<void>
}
