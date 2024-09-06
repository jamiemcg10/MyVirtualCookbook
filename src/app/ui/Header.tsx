'use client'

import Link from 'next/link'
import Logo from './Logo'
import { useContext } from 'react'
import { SessionContext } from '../utils/Session'
// import { SessionContext } from '../utils/Session'
// import supabase from '../utils/supabase'

function getLogoLink(loggedIn: boolean) {
  return loggedIn ? '/main' : './'
}

export default function Header() {
  const session = useContext(SessionContext)
  console.log({ session })
  const loggedIn = !!session

  console.log(session)

  const greeting = session?.displayName ? `Hi ${session.displayName}!` : 'Hi!'

  return (
    <div className="bg-mvc-green flex h-20 items-center justify-between px-5">
      <Link href={getLogoLink(loggedIn)}>
        <Logo small />
      </Link>
      {loggedIn ? (
        <div className="text-white">
          {greeting} |
          <a href="/logout" className="ml-1">
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
