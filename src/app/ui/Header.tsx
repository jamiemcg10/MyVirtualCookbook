'use client'

import Link from 'next/link'
import Logo from './Logo'
import { useContext } from 'react'
import { SessionContext } from '../utils/Session'

function getLogoLink(loggedIn: boolean) {
	return loggedIn ? '/cookbook' : './'
}

export default function Header() {
	const user = useContext(SessionContext)
	const loggedIn = !!user

	const greeting = user?.username ? `Hi ${user.username}!` : 'Hi!'

	return (
		<div className="bg-mvc-green flex h-16 items-center justify-between px-5">
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
