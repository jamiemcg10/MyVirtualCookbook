export interface Recipe {
  id: string
  name: string
  link: string
}

export interface RecipeWithNotes extends Recipe {
  notes: string
}
