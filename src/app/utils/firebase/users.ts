import { collection, doc, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import { User } from '@/app/lib/types'
import { recipes } from './recipes'
import { notes } from './notes'

const usersRef = collection(db, 'users')

export const users = (id: string) => {
  return {
    ref: doc(db, `users/${id}`),
    set: async (user: User) => {
      await setDoc(doc(usersRef, id), user)
    },
    recipes: recipes(id),
    notes: notes(id)
  }
}
