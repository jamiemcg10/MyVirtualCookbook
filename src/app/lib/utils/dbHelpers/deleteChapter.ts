'use server'

import { getDB } from '../firebase/firebaseAdmin'

export async function deleteChapter(
  userId: string,
  chapterId: string,
  recipeIds: string[] | undefined
) {
  const db = await getDB()

  // remove chapterId from chapterOrder array in user doc
  const userDoc = await db.collection('users').doc(userId).get()
  const chapterOrder = (userDoc.data()?.chapterOrder || []).filter((c: string) => c !== chapterId)

  await db.collection('users').doc(userId).update({ chapterOrder })

  // delete chapter doc
  await db.collection(`users/${userId}/chapters`).doc(chapterId).delete()

  // delete recipe and notes docs for the chapter
  if (!recipeIds) return

  await Promise.all(
    recipeIds.flatMap((recipeId) => {
      return [
        db.collection(`users/${userId}/recipes`).doc(recipeId).delete(),
        db.collection(`users/${userId}/notes`).doc(recipeId).delete()
      ]
    })
  )
}
