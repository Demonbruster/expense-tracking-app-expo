import { Button, Input, Text } from '@rneui/themed'
import { Formik } from 'formik'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Yup from 'yup'
import { createExpenseBook } from './utils/function'
import { useAuth } from './context/Auth'

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
  name: Yup.string().required(),
  budget: Yup.number().required(),
  description: Yup.string()
})

function AddExpenseBookModal({ navigation }: { navigation: any }) {
  const { setWantToRefresh } = useAuth()
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
          New Book
        </Text>
      </View>
      <Formik
        initialValues={{ name: '', budget: '', description: '' }}
        onSubmit={(values) => {
          createExpenseBook({
            name: values.name,
            budget: Number(values.budget),
            description: values.description
          }).then((res) => {
            setWantToRefresh(true)
            navigation.navigate('Expense')
          })
        }}
        validationSchema={validationSchema}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <View style={styles.formContainer}>
            <Input
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              label="Name"
              placeholder="Name"
              errorMessage={errors.name}
            />
            <Input
              onChangeText={handleChange('budget')}
              onBlur={handleBlur('budget')}
              value={values.budget}
              label="Budget"
              placeholder="Budget"
              errorMessage={errors.budget}
              keyboardType="numeric"
            />
            <Input
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              value={values.description}
              label="Description"
              placeholder="Description"
              errorMessage={errors.description}
            />
            <Button onPress={() => handleSubmit()}>Submit</Button>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  )
}

export default AddExpenseBookModal
