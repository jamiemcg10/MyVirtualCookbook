import { Theme, ThemeOptions, PaletteColor } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface CustomTheme extends Theme {
    palette: {
      'mvc-green': PaletteColor
      'mvc-yellow': PaletteColor
      'mvc-white': PaletteColor
      'mvc-gray': PaletteColor
    }
  }

  interface CustomThemeOptions extends ThemeOptions {
    palette?: {
      'mvc-green'?: PaletteColor
      'mvc-yellow'?: PaletteColor
      'mvc-white': PaletteColor
      'mvc-gray': PaletteColor
    }
  }

  export function createTheme(options?: CustomThemeOptions): CustomTheme
}
