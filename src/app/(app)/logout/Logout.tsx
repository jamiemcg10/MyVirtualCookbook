'use client'

import { getAuth, signOut } from 'firebase/auth'
import { redirect } from 'next/navigation'
// import { useEffect } from 'react'

export default async function Logout() {
  // useEffect(async () => {
  //   const auth = getAuth()
  //   await signOut(auth)

  //   redirect('/login')
  // }, [])

  const auth = getAuth()
  await signOut(auth)

  redirect('/login')

  return <></>
}
