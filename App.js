/* eslint-disable import/order */

/* eslint-disable no-unused-vars */
import { NavigationContainer } from '@react-navigation/native'
import { createTheme, lightColors, ThemeProvider } from '@rneui/themed'
import { Platform } from 'react-native'

import App from 'src/App'
import { AuthProvider } from 'src/context/Auth'

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
    <AuthProvider>
      <NavigationContainer>
        <App />
      </NavigationContainer>
    </AuthProvider>
  </ThemeProvider>
)
