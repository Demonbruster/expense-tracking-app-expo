// eslint-disable-next-line no-unused-vars
import { createTheme, lightColors, ThemeProvider } from '@rneui/themed'
import { Platform } from 'react-native'

// eslint-disable-next-line no-unused-vars
import App from 'src/App'

const theme = createTheme({
  lightColors: {
    ...Platform.select({
      default: lightColors.platform.android,
      ios: lightColors.platform.ios
    })
  },
  darkColors: {
    primary: '#000'
  },
  mode: 'light'
})

export default () => (
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
)
