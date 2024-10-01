import { collection } from 'firebase/firestore'
import { db } from './firebase'

export const notes = (userId: string) => {
  return {
    ref: collection(db, `users/${userId}/notes`)
  }
}
