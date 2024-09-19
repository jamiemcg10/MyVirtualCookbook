'use client'

import CookbookChapter from '@/app/ui/CookbookChapter'
import React, { useEffect } from 'react'

// need to track chapter and recipe order

const cookbook = [
  {
    name: 'Mains',
    id: '1', // get all ids from idField
    recipes: [
      {
        id: '1a',
        name: 'Beef Wellington',
        link: 'https://www.google.com/search?q=Beef+Wellington',
        notes: 'Beef Wellington recipe notes'
      }
    ]
  },
  {
    name: 'Sides',
    id: '2',
    recipes: [
      {
        id: '2a',
        name: "Dad's Famous Pasta Salad",
        link: "https://www.google.com/search?q=Dad's+Famous+Pasta+Salad",
        notes: "Dad's Famous Pasta Salad recipe notes"
      },
      {
        id: '2b',
        name: 'Balsalmic Sweet Potatoes',
        link: 'https://www.google.com/search?q=Balsalmic+Sweet+Potatoes',
        notes: 'Balsalmic Sweet Potatoes recipe notes'
      },
      {
        id: '2c',
        name: 'Green Bean Casserole',
        link: 'https://www.google.com/search?q=Green+Bean+Casserole',
        notes: 'Green Bean Casserole recipe notes'
      }
    ]
  },
  {
    name: 'Desserts',
    id: '3',
    recipes: [
      {
        id: '3a',
        name: 'Baked Alaska',
        link: 'https://www.google.com/search?q=Baked+Alaska',
        notes: 'Baked Alaska recipe notes'
      }
    ]
  }
]

// chapters in user record /* chapters: [{id, name, recipeIds(recipes)[]}, ...] */
// recipes subcollection /* {[id]: {name, link} */
// notes subcollection /* {[id]: note} */

export default function Cookbook() {
  useEffect(() => {
    window.history.replaceState(null, '', '/cookbook')
  }, [])

  return (
    <>
      <div className="p-8 flex flex-col space-y-2">
        {cookbook.map((chapter) => {
          return <CookbookChapter chapter={chapter} key={chapter.id} />
        })}
      </div>
    </>
  )
}
