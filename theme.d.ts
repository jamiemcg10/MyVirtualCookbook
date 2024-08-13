import { Theme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface CustomTheme extends Theme {
    palette: {
      'mvc-green': any, // change later
      'mvc-yellow': any
    };
  }
  // allow configuration using `createTheme`
  interface CustomThemeOptions extends ThemeOptions {
    palette?: {
      'mvc-green'?: any
      'mvc-yellow'?: any
    };
  }

  export function createTheme(options?: CustomThemeOptions): CustomTheme;
}