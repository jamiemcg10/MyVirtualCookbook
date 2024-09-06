'use client'

import Link from 'next/link'
import Logo from './Logo'
import { useContext } from 'react'
// import { SessionContext } from '../utils/Session'
// import supabase from '../utils/supabase'

function getLogoLink(loggedIn: boolean) {
  return loggedIn ? '/main' : './'
}

export default function Header() {
  // const session = useContext(SessionContext)
  const loggedIn = false // !!session

  // console.log(session)

  return (
    <div className="bg-mvc-green flex h-20 items-center justify-between px-5">
      <Link href={getLogoLink(loggedIn)}>
        <Logo small />
      </Link>
      {loggedIn ? (
        <div className="text-white">
          Hi, {'NAME'}! |{' '}
          <a href="/" onClick={() => {}}>
            Log Out
          </a>
        </div>
      ) : (
        <div className="text-white">
          <a href="./login" className="hover:overline">
            Log In
          </a>
        </div>
      )}
    </div>
  )
}
