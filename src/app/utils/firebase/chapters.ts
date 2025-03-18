import { collection, doc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'
import { Chapter } from '@/app/lib/types'

export const chapters = (userId: string) => {
  const chaptersRef = collection(db, `users/${userId}/chapters`)

  return {
    ref: chaptersRef,
    set: async (id: string, value: Chapter) => {
      await setDoc(doc(chaptersRef, id), value)
    },
    update: async (id: string, update: Partial<Chapter>) => {
      await updateDoc(doc(chaptersRef, id), update)
    }
  }
}
