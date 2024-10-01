import { RecipeWithNotes } from './recipe'

export interface Chapter {
  id: string
  name: string
  recipeIds: string[]
}

export interface ChapterWithRecipeNotes extends Omit<Chapter, 'recipeIds'> {
  recipes: RecipeWithNotes[]
}
