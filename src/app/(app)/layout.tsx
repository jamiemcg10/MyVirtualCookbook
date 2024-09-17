'use client'
import Session from '../utils/Session'
import Header from '../ui/Header'

interface AppProps {
  children: any
}

export default function App({ children }: AppProps) {
  return (
    <Session>
      <Header />
      {children}
    </Session>
  )
}
