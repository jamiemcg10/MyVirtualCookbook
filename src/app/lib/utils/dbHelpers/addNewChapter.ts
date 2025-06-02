import { uid } from 'uid'
import { users } from '../firebase'
import { arrayUnion } from 'firebase/firestore'

export async function addNewChapter(userId: string | undefined) {
  if (!userId) return

  const newChapter = {
    id: uid(8),
    name: '',
    recipes: [],
    recipeOrder: []
  }

  await users(userId).chapters.set(newChapter)
  await users(userId).update({ chapterOrder: arrayUnion(newChapter.id) })
}
