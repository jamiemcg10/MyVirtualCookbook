import { uid } from 'uid'
import { User } from '../types/user'
import { ChapterWithRecipeNotes } from '../types'
import { updateCookbook } from '@/app/lib/utils/Session'

export function addNewChapter(
  user: User | undefined,
  cookbook: ChapterWithRecipeNotes[] | undefined
) {
  if (!user?.id) return

  const newChapter = {
    id: uid(8),
    name: '',
    recipes: [],
    recipeOrder: []
  }

  updateCookbook([...(cookbook || []), newChapter])
}
