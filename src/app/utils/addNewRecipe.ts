import { uid } from 'uid'
import { users } from './firebase'
import { arrayUnion } from 'firebase/firestore'
import { NewRecipe } from '../lib/types'
import normalizeUrl from 'normalize-url'

export async function addNewRecipe(userId: string | undefined, values: NewRecipe) {
  if (!userId) return

  const { chapterId, name, link, newChapterName, recipeId = uid(8) } = values

  if (values.recipeId) {
    await users(userId).recipes.update(recipeId, {
      name,
      link: normalizeUrl(link)
    })
  } else {
    const newRecipe = {
      id: recipeId,
      name,
      link: normalizeUrl(link)
    }

    await users(userId).recipes.set(newRecipe)
    await users(userId).notes.set({ id: recipeId, notes: '' })

    if (chapterId === 'add' && newChapterName) {
      const newChapter = {
        id: uid(8),
        name: newChapterName,
        recipeOrder: [recipeId]
      }

      await users(userId).chapters.set(newChapter)
      await users(userId).update({ chapterOrder: arrayUnion(newChapter.id) })
    } else {
      await users(userId).chapters.update(chapterId, {
        recipeOrder: arrayUnion(recipeId)
      })
    }
  }
}
