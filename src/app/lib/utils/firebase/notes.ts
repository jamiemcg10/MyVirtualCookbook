import { collection, deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'
import { Notes } from '@/app/lib/types'

export const notes = (userId: string) => {
  return {
    ref: collection(db, `users/${userId}/notes`),
    set: async (value: Notes) => {
      await setDoc(doc(db, `users/${userId}/notes`, value.id), value)
    },
    update: async (id: string, value: string) => {
      await updateDoc(doc(db, `users/${userId}/notes`, id), { notes: value })
    },
    delete: async (id: string) => {
      await deleteDoc(doc(db, `users/${userId}/notes`, id))
    }
  }
}
