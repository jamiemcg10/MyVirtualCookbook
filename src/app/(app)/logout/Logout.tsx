'use client'

import { resetSession } from '@/app/lib/utils/Session'
import { getAuth, signOut } from 'firebase/auth'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function Logout() {
  useEffect(() => {
    const auth = getAuth()

    const _signOut = async () => {
      localStorage.removeItem('user')
      resetSession()
      await signOut(auth)
    }

    _signOut()

    redirect('/login')
  }, [])
  return <></>
}
