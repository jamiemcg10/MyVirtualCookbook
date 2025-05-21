import Logo from './ui/Logo'
import HomePageTile from './ui/tiles/HomePageTile'
import Link from 'next/link'
import ThemedButton from './ui/buttons/ThemedButton'

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
          <ThemedButton
            color="mvc-green"
            sx={{
              margin: '1.25rem 5rem 2.5rem'
            }}>
            Learn more
          </ThemedButton>
        </Link>
        <Link href="/login">
          <ThemedButton
            color="mvc-yellow"
            sx={{
              margin: '1.25rem 5rem 2.5rem'
            }}>
            Log in
          </ThemedButton>
        </Link>
      </div>
    </div>
  )
}
