import { Button } from '@rneui/base'
import { Input, Text } from '@rneui/themed'
import { Formik } from 'formik'
import React, { useLayoutEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Yup from 'yup'

import { useAuth } from './context/Auth'
import { createExpense, ExpenseBook } from './utils/function'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 16
  }
})

const validationSchema = Yup.object().shape({
  amount: Yup.number().required(),
  description: Yup.string()
})

function AddExpenseModal({ route, navigation }: { navigation: any; route: any }) {
  const { expenseBook } = route.params as { expenseBook: ExpenseBook }
  const { setWantToRefresh } = useAuth()

  //Change the header title
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'New expense for ' + expenseBook.name
    })
  }, [expenseBook.name, navigation])

  return (
    <SafeAreaView>
      <View style={styles.titleContainer}>
        <Text
          h4
          h4Style={{
            opacity: 0.5
          }}
        >
          {' '}
          New Expense
        </Text>
      </View>
      <Formik
        initialValues={{
          amount: '',
          description: ''
        }}
        onSubmit={(values) => {
          createExpense({
            amount: Number(values.amount),
            description: values.description,
            date: new Date().toDateString(),
            expense_book_id: (expenseBook.id as number) ?? 0
          }).then((res) => {
            setWantToRefresh(true)
            navigation.goBack()
          })
        }}
        validationSchema={validationSchema}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <View style={styles.formContainer}>
            <Input
              placeholder="Amount"
              onChangeText={handleChange('amount')}
              onBlur={handleBlur('amount')}
              value={values.amount}
              errorMessage={errors.amount}
              keyboardType="numeric"
              label="Amount"
            />
            <Input
              placeholder="Description"
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              value={values.description}
              errorMessage={errors.description}
              label="Description"
            />
            <Button onPress={() => handleSubmit()}>Submit</Button>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  )
}

export default AddExpenseModal
