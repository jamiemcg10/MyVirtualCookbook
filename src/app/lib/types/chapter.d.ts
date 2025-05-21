import { RecipeWithNotes } from './recipe'

export interface ChapterBase {
  id: string
  name: string
}

export interface Chapter extends ChapterBase {
  recipeOrder: string[]
}

export interface ChapterWithRecipeNotes extends Omit<Chapter, 'recipeIds'> {
  recipes: RecipeWithNotes[]
}
