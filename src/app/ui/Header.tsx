'use client'

import Link from 'next/link'
import Logo from './Logo'
import { useContext } from 'react'
import { SessionContext } from '../utils/Session'

function getLogoLink(loggedIn: boolean) {
  return loggedIn ? '/cookbook' : './'
}

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
          {greeting} |{/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/logout" className="ml-1 hover:overline">
            Log Out
          </a>
        </div>
      ) : (
        <div className="text-white text-sm sm:text-base">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="./login" className="hover:overline">
            Log In
          </a>
        </div>
      )}
    </div>
  )
}
