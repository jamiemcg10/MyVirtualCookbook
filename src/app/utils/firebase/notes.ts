import { collection, doc, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import { Notes } from '@/app/lib/types'

export const notes = (userId: string) => {
  return {
    ref: collection(db, `users/${userId}/notes`),
    set: async (value: Notes) => {
      await setDoc(doc(db, `users/${userId}/notes`, value.id), { notes: value })
    }
  }
}
