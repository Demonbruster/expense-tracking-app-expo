import { Card, Text } from '@rneui/themed'
import React, { useLayoutEffect, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useAuth } from './context/Auth'
import { Expense, getAllExpenses } from './utils/function'

function HomeScreen() {
  const { wantToRefresh } = useAuth()
  const [expenses, setExpenses] = useState<Expense[]>([])

  useLayoutEffect(() => {
    getAllExpenses().then((expenses) => {
      setExpenses(expenses)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wantToRefresh === true])

  const data: { week: number; month: number; total: number } = useMemo(() => {
    const today = new Date()
    const week = expenses
      .filter((expense) => {
        const weekAgo = new Date()
        weekAgo.setDate(today.getDate() - 7)
        return new Date(expense.date) >= weekAgo
      })
      .reduce((acc, expense) => {
        return acc + expense.amount
      }, 0)

    const month = expenses
      .filter((expense) => {
        const monthAgo = new Date()
        monthAgo.setDate(today.getDate() - 30)
        return new Date(expense.date) >= monthAgo
      })
      .reduce((acc, expense) => {
        return acc + expense.amount
      }, 0)

    const total = expenses.reduce((acc, expense) => {
      return acc + expense.amount
    }, 0)

    return { week, month, total }
  }, [expenses])

  return (
    <SafeAreaView>
      {/** Total expenses (weekly, monthly, total) */}
      <Card>
        <Text h4>Total expenses</Text>
        <Text>Weekly: {data.week}</Text>
        <Text>Monthly: {data.month}</Text>
        <Text>Total: {data.total}</Text>
      </Card>
    </SafeAreaView>
  )
}

export default HomeScreen
