import { ReactElement } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import Login from './Login'

export default function App(): ReactElement {
  return (
    <SafeAreaProvider>
      <Login />
    </SafeAreaProvider>
  )
}
