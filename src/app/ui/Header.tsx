'use client'

import Link from 'next/link'
import Logo from './Logo'
import { useContext } from 'react'
import { SessionContext } from '../lib/utils/Session'

function getLogoLink(loggedIn: boolean) {
  return loggedIn ? '/cookbook' : './'
}

/* eslint-disable @next/next/no-html-link-for-pages */
export default function Header() {
  // NOTE: use a instead of Link for auth links to avoid prefetching
  const { user } = useContext(SessionContext)
  const loggedIn = !!user

  const greeting = user?.username ? `Hi ${user.username}!` : 'Hi!'

  return (
    <div className="bg-mvc-green flex h-16 items-center justify-between px-5">
      <Link href={getLogoLink(loggedIn)}>
        <Logo small />
      </Link>
      {loggedIn ? (
        <div className="text-white text-sm sm:text-base">
          {greeting} |
          <a href="/logout" className="ml-1 hover:overline">
            Log Out
          </a>
        </div>
      ) : (
        <div className="text-white text-sm sm:text-base">
          <a href="./login" className="hover:overline">
            Log In
          </a>
        </div>
      )}
    </div>
  )
}
