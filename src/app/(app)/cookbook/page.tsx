'use client'

import CookbookChapter from '@/app/ui/CookbookChapter'
import React, { useContext, useEffect, useState } from 'react'
import { getCookbook } from '../../utils/cookbook'
import { SessionContext } from '@/app/utils/Session'
import { ChapterWithRecipeNotes } from '@/app/lib/types'

export default function Cookbook() {
  const user = useContext(SessionContext)
  const [cookbook, setCookbook] = useState<ChapterWithRecipeNotes[]>([])

  useEffect(() => {
    window.history.replaceState(null, '', '/cookbook')

    user && getCookbook(user.id).subscribe((v) => setCookbook(v))
  }, [user])

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
