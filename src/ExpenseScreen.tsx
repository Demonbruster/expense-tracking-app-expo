/* eslint-disable import/order */
import { Button, FAB, ListItem, Text } from '@rneui/themed'
import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { deleteExpenseBook, ExpenseBook, getAllExpenseBooks } from 'src/utils/function'

import { useAuth } from './context/Auth'
import AntDesign from '@expo/vector-icons/AntDesign'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  floatBtn: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0
  }
})

function ExpenseScreen({ navigation }: { navigation: any; route: any }) {
  const { wantToRefresh, setWantToRefresh } = useAuth()
  const [expenseBook, setExpenseBook] = useState<ExpenseBook[]>([])

  useEffect(() => {
    getAllExpenseBooks().then((res) => {
      setExpenseBook(res)
      setWantToRefresh(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wantToRefresh === true])

  const handleOpenModal = useCallback(() => {
    navigation.navigate('AddExpenseBookModal')
  }, [navigation])

  return (
    <SafeAreaView style={styles.container}>
      {expenseBook.length <= 0 ? (
        <EmptyExpenseBook />
      ) : (
        <ExpenseBookList expenseBook={expenseBook} navigation={navigation} />
      )}
      <FAB style={styles.floatBtn} onPress={handleOpenModal}>
        <AntDesign name="plus" size={24} color="white" />
      </FAB>
    </SafeAreaView>
  )
}

const EmptyExpenseBook = () => {
  return (
    <View style={styles.container}>
      <Text h4>Expense Book is empty</Text>
      <Text> Please create some </Text>
    </View>
  )
}

const ExpenseBookList = ({
  expenseBook,
  navigation
}: {
  expenseBook: ExpenseBook[]
  navigation: any
}) => {
  const { setWantToRefresh } = useAuth()
  const handleDelete = useCallback(
    (id: number) => {
      // eslint-disable-next-line eqeqeq
      if (id == 0) return

      deleteExpenseBook(id).then((res) => {
        setWantToRefresh(true)
      })
    },
    [setWantToRefresh]
  )

  return (
    <View
      style={{
        width: '100%',
        height: '100%'
      }}
    >
      {expenseBook.map((item, index: number) => (
        <ListItem.Swipeable
          key={index}
          rightContent={(reset) => (
            <Button
              title="Delete"
              onPress={() => {
                handleDelete(item.id ?? 0)
              }}
              icon={{ name: 'delete', color: 'white' }}
              buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
            />
          )}
          leftWidth={80}
          rightWidth={90}
          bottomDivider
          onPress={() => {
            navigation.navigate('ExpenseDetail', { expenseBook: item })
          }}
        >
          <ListItem.Content>
            <ListItem.Title>
              {item.name} - {item.budget}
            </ListItem.Title>
            <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem.Swipeable>
      ))}
    </View>
  )
}

export default ExpenseScreen
