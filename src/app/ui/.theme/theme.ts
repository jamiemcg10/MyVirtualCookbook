import { createTheme, alpha, getContrastRatio } from '@mui/material/styles'

function computeVariants(variant: 'text' | 'outlined' | 'contained') {
  return (Object.keys(palette) as Array<keyof typeof palette>).map((key) => {
    return {
      props: { variant: variant as 'text' | 'outlined' | 'contained', color: key },
      style: {
        '&:hover': {
          backgroundColor: alpha(palette[key].main, 0.3)
        }
      }
    }
  })
}

const greenBase = '#6aa84f'
const greenMain = alpha(greenBase, 0.7)

const yellowBase = '#ffd966'
const yellowMain = alpha(yellowBase, 0.7)

const whiteBase = '#fff'
const whiteMain = alpha(whiteBase, 0.7)

const grayBase = '#808080'
const grayMain = alpha(grayBase, 0.7)

const palette = {
  'mvc-green': {
    main: greenMain,
    light: alpha(greenBase, 0.5),
    dark: alpha(greenBase, 0.9),
    contrastText: getContrastRatio(greenMain, '#fff') > 4.5 ? '#fff' : '#303030'
  },
  'mvc-yellow': {
    main: yellowMain,
    light: alpha(yellowBase, 0.5),
    dark: alpha(yellowBase, 0.9),
    contrastText: getContrastRatio(yellowMain, '#fff') > 4.5 ? '#fff' : '#303030'
  },
  'mvc-white': {
    main: whiteMain,
    light: alpha(whiteBase, 0.5),
    dark: alpha(whiteBase, 0.9),
    contrastText: '#303030'
  },
  'mvc-gray': {
    main: grayMain,
    light: alpha(grayBase, 0.5),
    dark: alpha(grayBase, 0.9),
    contrastText: '#303030'
  }
}

export const theme = createTheme({
  typography: {
    fontFamily: 'inherit'
  },
  components: {
    MuiButton: {
      variants: computeVariants('text')
    }
  },
  palette
})
