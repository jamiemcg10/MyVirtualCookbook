'use client'

import CookbookChapter from '@/app/ui/CookbookChapter'
import React, { useContext, useEffect, useState } from 'react'
import { getCookbook } from '../../utils/cookbook'
import { SessionContext } from '@/app/utils/Session'
import { ChapterWithRecipeNotes } from '@/app/lib/types'
import Footer from '@/app/ui/Footer'
import { CircularProgress, Drawer, ThemeProvider } from '@mui/material'
import { theme } from '@/app/ui/.theme/theme'

declare module '@mui/material/CircularProgress' {
  // eslint-disable-next-line no-unused-vars
  interface CircularProgressPropsColorOverrides {
    'mvc-green': true
    'mvc-yellow': true
    'mvc-white': true
    'mvc-gray': true
  }
}

export default function Cookbook() {
  const user = useContext(SessionContext)
  const [cookbook, setCookbook] = useState<ChapterWithRecipeNotes[] | null>(null)

  useEffect(() => {
    window.history.replaceState(null, '', '/cookbook')

    user && getCookbook(user.id).subscribe((v) => setCookbook(v))
  }, [user])

  return (
    <div className="flex h-full">
      {cookbook ? (
        <>
          <div className="p-8 flex flex-col space-y-2 grow">
            {cookbook.length ? (
              cookbook.map((chapter) => {
                return <CookbookChapter chapter={chapter} key={chapter.id} />
              })
            ) : (
              <div>Your cookbook is empty. Add chapters and recipes to get started.</div>
            )}
          </div>
          <Footer />
        </>
      ) : (
        <div className="grow justify-center items-center flex">
          <ThemeProvider theme={theme}>
            <CircularProgress size="65px" color="mvc-yellow" />
          </ThemeProvider>
        </div>
      )}
    </div>
  )
}
