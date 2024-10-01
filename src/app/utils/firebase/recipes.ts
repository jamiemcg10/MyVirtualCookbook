import { collection } from 'firebase/firestore'
import { db } from './firebase'

export const recipes = (userId: string) => {
  return {
    ref: collection(db, `users/${userId}/recipes`)
  }
}
