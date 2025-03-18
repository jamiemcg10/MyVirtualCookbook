import { collection, doc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'
import { User } from '@/app/lib/types'
import { recipes } from './recipes'
import { notes } from './notes'
import { chapters } from './chapters'

const usersRef = collection(db, 'users')

export const users = (id: string) => {
  return {
    ref: doc(db, `users/${id}`),
    set: async (user: User) => {
      await setDoc(doc(usersRef, id), user)
    },
    update: async (id: string, update: Partial<User>) => {
      await updateDoc(doc(usersRef, id), update)
    },
    chapters: chapters(id),
    recipes: recipes(id),
    notes: notes(id)
  }
}
