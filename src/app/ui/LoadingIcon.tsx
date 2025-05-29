import { CircularProgress, ThemeProvider } from '@mui/material'
import { theme } from './.theme/theme'

export default function LoadingIcon() {
  return (
    <div className="grow justify-center items-center flex">
      <ThemeProvider theme={theme}>
        <CircularProgress size="65px" color="mvc-yellow" />
      </ThemeProvider>
    </div>
  )
}
