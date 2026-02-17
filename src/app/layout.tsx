import './globals.css'
import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { ReactNode } from 'react'
import { Analytics } from '@vercel/analytics/next'

const roboto = Roboto({ weight: '700', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My Virtual Cookbook',
  description: 'Organize your recipes in one place'
}

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
