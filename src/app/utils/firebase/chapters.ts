import { collection, deleteDoc, doc, FieldValue, setDoc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'
import { Chapter } from '@/app/lib/types'

export const chapters = (userId: string) => {
	const chaptersRef = collection(db, `users/${userId}/chapters`)

	return {
		ref: chaptersRef,
		set: async (value: Chapter) => {
			await setDoc(doc(chaptersRef, value.id), value)
		},
		update: async (id: string, update: Partial<Chapter> | Record<string, FieldValue>) => {
			await updateDoc(doc(chaptersRef, id), update)
		},
		delete: async (id: string) => {
			await deleteDoc(doc(chaptersRef, id))
		}
	}
}
