import { FirebaseUser } from '../../types'
import { users } from '../firebase'
import { DEFAULT_CHAPTERS, DEFAULT_RECIPES, DEFAULT_NOTES } from '../demoDefaults'

export const createAnonUser = async (user: FirebaseUser) => {
  const id = user.user.uid

  const recipes = DEFAULT_RECIPES.map((recipe) => {
    return users(id).recipes.set(recipe)
  })

  const chapters = DEFAULT_CHAPTERS.map((chapter) => {
    return users(id).chapters.set(chapter)
  })

  const notes = DEFAULT_NOTES.map((note) => {
    return users(id).notes.set(note)
  })

  await Promise.all([...notes, ...recipes, ...chapters])

  await users(id).set({
    id,
    username: 'Demo User',
    chapterOrder: ['a15fb', 'b2gp9e', 'c33ee'],
    isDemo: true
  })
}
