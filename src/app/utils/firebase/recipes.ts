import { collection, doc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'
import { Recipe } from '@/app/lib/types'

export const recipes = (userId: string) => {
  const recipesRef = collection(db, `users/${userId}/recipes`)

  return {
    ref: recipesRef,
    update: async (id: string, update: Partial<Recipe>) => {
      await updateDoc(doc(recipesRef, id), update)
    }
  }
}
