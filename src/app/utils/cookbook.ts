import { collectionData, docData } from 'rxfire/firestore'
import { users } from './firebase/users'
import { combineLatest, map, shareReplay } from 'rxjs'
import { Chapter } from '../lib/types'
import { DocumentData } from 'rxfire/firestore/interfaces'

export const getCookbook = (userId: string) => {
  const userRef = users(userId).ref
  const recipesRef = users(userId).recipes.ref
  const notesRef = users(userId).notes.ref

  const user = docData(userRef)
  const recipes = collectionData(recipesRef)
  const notes = collectionData(notesRef, { idField: 'id' })

  return combineLatest([user, recipes, notes]).pipe(
    map(([user, recipes, notes]) => {
      console.log({ user, recipes, notes })
      const chapters = user?.chapters.map((chapter: Chapter) => {
        const _recipes = chapter.recipeIds.map((id: string) => {
          const recipe = recipes.find((r: DocumentData) => r.id === id)
          const recipeWithNotes = { ...recipe, notes: notes.find((r) => r.id === id)?.notes }
          return recipeWithNotes
        })

        return {
          id: chapter.id,
          name: chapter.name,
          recipes: _recipes
        }
      })
      return chapters
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  )
}
