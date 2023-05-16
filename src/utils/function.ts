import * as SQLite from 'expo-sqlite'
import { Platform } from 'react-native'

export function openDatabase() {
  if (Platform.OS === 'web') {
    return {
      transaction: () => {
        return {
          executeSql: () => {}
        }
      }
    }
  }

  const db = SQLite.openDatabase('tracker.db')
  return db
}

export interface ExpenseBook {
  id?: number
  name: string
  description: string
  budget: number
}

export interface Expense {
  id: number
  amount: number
  date: string
  description: string
  created_at: string
  updated_at: string
  expense_book_id: number
}

export type User = {
  id: number
  email: string
  password: string
}

export type SQLiteDatabase =
  | SQLite.WebSQLDatabase
  | {
      transaction: () => {
        executeSql: () => void
      }
    }

export interface GetUserWithEmailAndPass {
  email: string
  password: string
}

export const getUserWithEmailAndPass = ({ email, password }: GetUserWithEmailAndPass) => {
  const db = openDatabase()
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password],
        (_, { rows }) => {
          resolve(rows._array)
        }
      )
    })
  })
}

export const createTablesIfNotExists = () => {
  const db = openDatabase()
  // create user table with id, email, password
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT)'
    )
  })

  // expense book table with id, name, description and budget as floating point number
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS expense_book (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, budget REAL)'
    )
  })

  // expense table with id, amount, date, description, created_at, updated_at as timestamp and expense_book_id as foreign key
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS expense (id INTEGER PRIMARY KEY AUTOINCREMENT, amount REAL, date TEXT, description TEXT, created_at TEXT, updated_at TEXT, expense_book_id INTEGER, FOREIGN KEY(expense_book_id) REFERENCES expense_book(id))'
    )
  })
}

export const createUser = ({ email, password }: { email: string; password: string }) => {
  return new Promise((resolve, reject) => {
    const db = openDatabase()
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, password],
        (_, { insertId, rows }) => {
          resolve(insertId)
        }
      )
    })
  })
}

export const getAllUsers = () => {
  const db = openDatabase()
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM users', [], (_, { rows }) => {
        resolve(rows._array)
      })
    })
  }) as Promise<User[]>
}

export const createExpenseBook = ({ name, description, budget }: ExpenseBook) => {
  const db = openDatabase()
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO expense_book (name, description, budget) VALUES (?, ?, ?)',
        [name, description, budget],
        (_, { insertId, rows }) => {
          resolve(insertId)
        }
      )
    })
  })
}

export const getAllExpenseBooks = () => {
  const db = openDatabase()
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('SELECT * FROM expense_book', [], (_, { rows }) => {
        resolve(rows._array)
      })
    })
  }) as Promise<ExpenseBook[]>
}

export const deleteExpenseBook = (id: number) => {
  const db = openDatabase()
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql('DELETE FROM expense_book WHERE id = ?', [id], (_, { rows }) => {
        resolve(rows._array)
      })
    })
  })
}
