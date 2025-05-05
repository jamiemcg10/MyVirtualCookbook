import { collectionData, docData } from 'rxfire/firestore'
import { users } from './firebase/users'
import { combineLatest, map, shareReplay } from 'rxjs'
import { Chapter, ChapterWithRecipeNotes } from '../lib/types'
import { DocumentData } from 'rxfire/firestore/interfaces'

export const getCookbook = (userId: string) => {
	const userRef = users(userId).ref
	const chaptersRef = users(userId).chapters.ref
	const recipesRef = users(userId).recipes.ref
	const notesRef = users(userId).notes.ref

	const user = docData(userRef)
	const chapters = collectionData(chaptersRef)
	const recipes = collectionData(recipesRef)
	const notes = collectionData(notesRef, { idField: 'id' })

	return combineLatest([user, chapters, recipes, notes]).pipe(
		map(([user, chapters, recipes, notes]) => {
			const _chapters = user?.chapterOrder.map((cid: string) =>
				chapters.find((c: DocumentData) => c.id === cid)
			)

			const fullChapters: ChapterWithRecipeNotes[] = _chapters.map((chapter: Chapter) => {
				const _recipes = chapter.recipeOrder.map((rid: string) => {
					const recipe = recipes.find((r: DocumentData) => r.id === rid)
					const recipeWithNotes = { ...recipe, notes: notes.find((r) => r.id === rid)?.notes }
					return recipeWithNotes
				})

				return {
					id: chapter.id,
					name: chapter.name,
					recipeOrder: chapter.recipeOrder,
					recipes: _recipes
				}
			})
			return fullChapters
		}),
		shareReplay({ bufferSize: 1, refCount: true })
	)
}
