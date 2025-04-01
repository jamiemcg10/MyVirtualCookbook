'use client'

import CookbookChapter from '@/app/ui/CookbookChapter'
import React, { useContext, useEffect, useState } from 'react'
import { getCookbook } from '../../utils/cookbook'
import { SessionContext } from '@/app/utils/Session'
import { ChapterWithRecipeNotes } from '@/app/lib/types'
// import Sidebar from '@/app/ui/Sidebar'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  ThemeProvider
} from '@mui/material'
import { theme } from '@/app/ui/.theme/theme'
import ThemedButton from '@/app/ui/buttons/ThemedButton'
import AddIcon from '@mui/icons-material/Add'
import { uid } from 'uid'
import { arrayRemove, arrayUnion } from 'firebase/firestore'
import { users } from '@/app/utils/firebase'
import CloseIcon from '@mui/icons-material/Close'

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [chapterToDelete, setChapterToDelete] = useState<string | null>(null)

  function openDeleteChapterDialog(id: string) {
    setChapterToDelete(id)
    setShowDeleteDialog(true)
  }

  function closeDeleteChapterDialog() {
    setChapterToDelete(null)
    setShowDeleteDialog(false)
  }

  async function deleteActiveChapter() {
    if (!user || !chapterToDelete) return

    await users(user.id).update({ chapterOrder: arrayRemove(chapterToDelete) })
    await users(user.id).chapters.delete(chapterToDelete)
    closeDeleteChapterDialog()
  }

  async function addNewChapter() {
    if (!user) return

    const newChapter = {
      id: uid(8),
      name: '',
      recipes: [],
      recipeOrder: []
    }

    await users(user.id).chapters.set(newChapter.id, newChapter)
    await users(user.id).update({ chapterOrder: arrayUnion(newChapter.id) })
  }

  useEffect(() => {
    window.history.replaceState(null, '', '/cookbook')

    user && getCookbook(user.id).subscribe((v) => setCookbook(v))
  }, [user])

  return (
    <div className="flex h-full flex-col">
      {cookbook ? (
        <>
          <ThemedButton color="mvc-white" className="my-4 ml-8" onClick={() => addNewChapter()}>
            <AddIcon
              style={{
                verticalAlign: 'top',
                height: 20,
                width: 20,
                marginLeft: -10,
                marginTop: -2
              }}></AddIcon>
            <span>Add Chapter</span>
          </ThemedButton>
          <div className="px-8 flex flex-col space-y-2 grow">
            {cookbook.length &&
              cookbook.map((chapter) => {
                return (
                  <CookbookChapter
                    chapter={chapter}
                    setShowDeleteDialog={() => openDeleteChapterDialog(chapter.id)}
                    key={chapter.id}
                  />
                )
              })}
            {!cookbook.length && (
              <div>Your cookbook is empty. Add chapters and recipes to get started.</div>
            )}
          </div>
          <Dialog
            open={showDeleteDialog}
            onClose={() => closeDeleteChapterDialog()}
            sx={{ '.MuiDialog-paper': { backgroundColor: '#e1e1e1', padding: '0 15px' } }}>
            <DialogTitle>Delete Chapter</DialogTitle>
            <IconButton
              onClick={() => closeDeleteChapterDialog()}
              aria-label="close"
              sx={(theme) => ({
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.grey[500]
              })}>
              <CloseIcon />
            </IconButton>
            <DialogContent>
              <DialogContentText>
                Are you sure? This chapter and the recipes in it will be permanently deleted. This
                can't be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <ThemedButton
                variant="outlined"
                color="mvc-gray"
                className="my-4 ml-8"
                onClick={() => {
                  setShowDeleteDialog(false)
                }}>
                <span>Cancel</span>
              </ThemedButton>
              <Button
                color="error"
                variant="contained"
                className="my-4 ml-8"
                onClick={deleteActiveChapter}>
                Permanently Delete
              </Button>
            </DialogActions>
          </Dialog>
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
