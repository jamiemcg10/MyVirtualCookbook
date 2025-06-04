import Logo from './ui/Logo'
import HomePageTile from './ui/tiles/HomePageTile'
import ThemedButton from './ui/buttons/ThemedButton'
import { homeButtonStyles } from './lib/styles/homeButtonStyles'

export default function Home() {
  return (
    <div className="App">
      <div className="text-center pt-8 [@media(min-width:560px)]:pt-32">
        <Logo />
      </div>
      <div className="bg-mvc-green mt-10 mb-10 sm:py-4 flex flex-wrap justify-around">
        <HomePageTile type="add" />
        <HomePageTile type="organize" />
        <HomePageTile type="notes" />
      </div>
      <div className="flex flex-wrap justify-center mt-14 sm:mt-0">
        <div className="w-full xs:w-1/2 lg:w-1/3 px-4 sm:px-16 lg:pl-24 lg:pr-20">
          <ThemedButton color="mvc-green" href="/about" sx={homeButtonStyles}>
            Learn more
          </ThemedButton>
        </div>
        <div className="w-full xs:w-1/2 lg:w-1/3 px-4 sm:px-16 lg:pr-24 lg:pl-20">
          <ThemedButton color="mvc-yellow" href="/login" sx={homeButtonStyles}>
            Log in
          </ThemedButton>
        </div>
      </div>
    </div>
  )
}
