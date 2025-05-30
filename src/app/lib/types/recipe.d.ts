export interface Recipe {
  id: string
  name: string
  link: string
}

export interface RecipeWithNotes extends Recipe {
  notes: string
}

export interface NewRecipe {
  recipeId?: string
  chapterId: string
  newChapterName?: string
  name: string
  link: string
}

export interface SearchRecipe extends RecipeWithNotes {
  chapterId: string
}
