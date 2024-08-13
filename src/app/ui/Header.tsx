import Link from 'next/link'
import Logo from './Logo'

function getLogoLink(loggedIn: boolean) {
  return loggedIn ? '/main' : './'
}

export default function Header() {
  return (
    <div className="bg-mvc-green flex h-20 items-center justify-between px-5">
      <Link href={getLogoLink(false)}>
        <Logo small />
      </Link>
      {false ? (
        <div className="text-white">
          Hi, {'NAME'}! | <a href="/logout">Log Out</a>
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
