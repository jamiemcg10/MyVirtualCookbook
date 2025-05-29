'use client'

import { getAuth, signOut } from 'firebase/auth'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function Logout() {
  useEffect(() => {
    const auth = getAuth()

    const _signOut = async () => {
      await signOut(auth)
      console.log('should be signed out')
    }

    _signOut()

    redirect('/login')
  }, [])
  return <></>
}
