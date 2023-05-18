import { Text } from '@rneui/themed'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { useAuth } from 'src/context/Auth'
import { createTablesIfNotExists, getAllUsers } from 'src/utils/function'

import Login from './Login'
import Navigation from './Navigation'
import Register from './Register'

type UserType = 'new' | 'logged-in' | 'existing' | null

export default function App(): ReactElement {
  const [userType, setUserType] = useState<UserType>(null)
  const { user } = useAuth()

  useEffect(() => {
    createTablesIfNotExists()
    if (user) setUserType('logged-in')
    else
      getAllUsers().then((users) => {
        if (users.length > 0) {
          setUserType('existing')
        } else {
          setUserType('new')
        }
      })
  }, [user])

  const child = useMemo(() => {
    switch (userType) {
      case 'new':
        return <Register />
      case 'existing':
        return <Login />
      case 'logged-in':
        return <Navigation />
      default:
        return <Text> Loading... </Text>
    }
  }, [userType])

  return <SafeAreaProvider>{child}</SafeAreaProvider>
}
