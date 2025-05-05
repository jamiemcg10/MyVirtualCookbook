import { collection, deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'
import { Recipe } from '@/app/lib/types'

export const recipes = (userId: string) => {
	const recipesRef = collection(db, `users/${userId}/recipes`)

	return {
		ref: recipesRef,
		set: async (value: Recipe) => {
			await setDoc(doc(recipesRef, value.id), value)
		},
		update: async (id: string, update: Partial<Recipe>) => {
			await updateDoc(doc(recipesRef, id), update)
		},
		delete: async (id: string) => {
			await deleteDoc(doc(recipesRef, id))
		}
	}
}
