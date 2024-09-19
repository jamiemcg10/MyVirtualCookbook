import { Recipe, RecipeWithNotes } from './recipe'

export interface Chapter {
  id: string
  name: string
  recipes: Recipe[]
}

export interface ChapterWithRecipeNotes extends Omit<Chapter, 'recipes'> {
  recipes: RecipeWithNotes[]
}
