import type { Dispatch, SetStateAction } from 'react'
import type { RecipeWithNotes } from '../lib/types'

export interface CookbookChapterProps {
  chapter: ChapterWithRecipeNotes
  setShowDeleteDialog: Dispatch<SetStateAction<boolean>>
  key: string
}

export interface CookbookNotesProps {
  notes: string
  onSave: (notes: string) => void
}

export interface CookbookRecipeProps {
  chapterId: string
  recipe: RecipeWithNotes
}

export interface RecipeMenuProps {
  onRename: () => void
  onDelete: () => Promise<void>
}
