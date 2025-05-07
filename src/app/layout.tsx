import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import { ReactNode } from 'react'

const roboto = Roboto({ weight: '700', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My Virtual Cookbook',
  description: 'Organize your recipes in one plac'
}

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>{children}</body>
    </html>
  )
}
