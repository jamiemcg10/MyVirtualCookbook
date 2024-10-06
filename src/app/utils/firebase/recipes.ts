import { collection } from 'firebase/firestore'
import { db } from './firebase'

export const recipes = (userId: string) => {
  const recipesRef = collection(db, `users/${userId}/recipes`)

  return {
    ref: recipesRef
  }
}
