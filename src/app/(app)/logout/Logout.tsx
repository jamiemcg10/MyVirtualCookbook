'use client'

import { getAuth, signOut } from 'firebase/auth'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function Logout() {
  useEffect(() => {
    const auth = getAuth()
    signOut(auth).finally(() => {
      redirect('/login')
    })
  }, [])
  return <></>
}
