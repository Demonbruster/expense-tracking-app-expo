import { createContext, useContext, useState } from 'react'

import { createUser, getUserWithEmailAndPass } from 'src/utils/function'

type User = {
  email: string
  loggedIn: boolean
}

export type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<unknown>
  logout: () => void
  register: (email: string, password: string) => Promise<void>
  isError: boolean
  wantToRefresh: boolean
  setWantToRefresh: (value: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useProvider()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider')
  }

  return context
}

const useProvider = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isError, setIsError] = useState(false)
  const [wantToRefresh, setWantToRefresh] = useState(false)

  const login = async (email: string, password: string) => {
    return getUserWithEmailAndPass({ email, password }).then((user: User[]) => {
      if (user.length > 0) {
        setUser(user[0])
        setIsError(false)
      } else {
        setUser(null)
        setIsError(true)
      }
      return user
    })
  }

  const register = async (email: string, password: string) => {
    createUser({ email, password }).then((user: User) => {
      setUser(user)
      setIsError(false)
    })
  }

  const logout = () => {
    setUser(null)
  }

  return { user, login, register, logout, isError, wantToRefresh, setWantToRefresh }
}
