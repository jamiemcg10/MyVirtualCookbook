import Logo from './ui/Logo'
import HomePageTile from './ui/tiles/HomePageTile'
import Link from 'next/link'
import ThemedButton from './ui/ThemedButton'

export default function Home() {
  return (
    <div className="App">
      <div className="text-center pt-32">
        <Logo />
      </div>
      <div className="bg-mvc-green mt-10 mb-10 py-7 flex flex-wrap justify-around">
        <HomePageTile type="add" />
        <HomePageTile type="organize" />
        <HomePageTile type="notes" />
      </div>
      <div className="flex flex-wrap justify-center">
        <Link href="/about">
          <ThemedButton color="mvc-green" className="mt-5 mb-10 mx-20">
            Learn more
          </ThemedButton>
        </Link>
        <Link href="/login">
          <ThemedButton color="mvc-yellow" className="mt-5 mb-10 mx-20">
            Log in
          </ThemedButton>
        </Link>
      </div>
    </div>
  )
}
