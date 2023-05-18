import { AntDesign } from '@expo/vector-icons'
import { Button, Divider, FAB, ListItem, Text } from '@rneui/themed'
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useAuth } from './context/Auth'
import { deleteExpense, Expense, ExpenseBook, getExpensesByExpenseBookId } from './utils/function'

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  contentListContainer: {
    flex: 1,
    padding: 16
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  floatBtn: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0
  },
  lightLabel: {
    color: '#8F9BB3'
  },
  labelRed: {
    color: '#FF4D4F'
  },
  labelGreen: {
    color: '#52C41A'
  }
})

function ExpenseDetailsScreen({ route, navigation }: { navigation: any; route: any }) {
  const { expenseBook } = route.params as { expenseBook: ExpenseBook }
  const [expenseBookDetails, setExpenseBookDetails] = useState<Expense[]>([])
  const { wantToRefresh } = useAuth()

  useLayoutEffect(() => {
    navigation.setOptions({
      title: expenseBook.name
    })
  }, [navigation, expenseBook.name])

  useLayoutEffect(() => {
    getExpensesByExpenseBookId(expenseBook.id ?? 0).then((res) => {
      setExpenseBookDetails(res)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenseBook.id, wantToRefresh === true])

  const data: {
    netBalance: number
    budget: number
    totalExpense: number
    netBalanceColor: string
  } = useMemo(() => {
    const totalExpense = expenseBookDetails.reduce((acc, cur) => acc + cur.amount, 0)
    const budget = expenseBook.budget ?? 0
    const netBalance = budget - totalExpense
    const netBalanceColor = netBalance < 0 ? '#FF4D4F' : '#52C41A'
    return { netBalance, budget, totalExpense, netBalanceColor }
  }, [expenseBookDetails, expenseBook.budget])

  const handleOpenModal = useCallback(() => {
    navigation.navigate('AddExpenseModal', {
      expenseBook
    })
  }, [expenseBook, navigation])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.lightLabel}>Net Balance</Text>
          <Text h4 h4Style={{ color: data.netBalanceColor }}>
            {data.netBalance}
          </Text>
        </View>
        <View>
          <Text style={styles.lightLabel}>Budget</Text>
          <Text h4>{data.budget}</Text>
        </View>
        <View>
          <Text style={styles.lightLabel}>Total Expense</Text>
          <Text h4 style={styles.labelRed}>
            {data.totalExpense}
          </Text>
        </View>
      </View>
      <Divider />
      <View style={styles.contentListContainer}>
        {expenseBookDetails.length <= 0 ? (
          <EmptyExpenses />
        ) : (
          <ExpenseList expenseBookDetails={expenseBookDetails} />
        )}
      </View>
      <FAB style={styles.floatBtn} onPress={handleOpenModal}>
        <AntDesign name="plus" size={24} color="white" />
      </FAB>
    </SafeAreaView>
  )
}

const EmptyExpenses = () => {
  return (
    <View style={styles.emptyContainer}>
      <Text h4>Expenses are empty</Text>
      <Text> Please create some </Text>
    </View>
  )
}

const ExpenseList = ({ expenseBookDetails }: { expenseBookDetails: Expense[] }) => {
  const handleDelete = useCallback((id: number) => {
    if (id === 0) return
    deleteExpense(id)
  }, [])

  return (
    <>
      {expenseBookDetails.map((expense) => (
        <ListItem.Swipeable
          key={expense.id}
          rightContent={(reset) => (
            <Button
              title="Delete"
              onPress={() => {
                handleDelete(expense.id ?? 0)
              }}
              icon={{ name: 'delete', color: 'white' }}
              buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
            />
          )}
          leftWidth={80}
          rightWidth={90}
          bottomDivider
        >
          <ListItem.Content>
            <ListItem.Title>
              {expense.description} - {expense.amount}
            </ListItem.Title>
            <ListItem.Subtitle>{expense.date}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem.Swipeable>
      ))}
    </>
  )
}

export default ExpenseDetailsScreen
