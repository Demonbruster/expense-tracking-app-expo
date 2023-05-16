import { Button, Input, Text } from '@rneui/themed'
import { Formik } from 'formik'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Yup from 'yup'

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
  email: Yup.string().email().required(),
  password: Yup.string().required(),
  cPassword: Yup.string().oneOf([Yup.ref('password'), ''], 'Passwords must match')
})

function Register() {
  const { register } = useAuth()
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text h3> Sign Up, Here </Text>
      </View>
      <Formik
        initialValues={{ email: '', password: '', cPassword: '' }}
        onSubmit={(values) => {
          register(values.email, values.password)
        }}
        validationSchema={validationSchema}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <SafeAreaView style={styles.formContainer}>
            <Input
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              keyboardType="email-address"
              placeholder="example@email.com"
              label="Email"
              errorMessage={errors.email}
            />
            <Input
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry
              placeholder="Password"
              label="Password"
              errorMessage={errors.password}
            />
            <Input
              onChangeText={handleChange('cPassword')}
              onBlur={handleBlur('cPassword')}
              value={values.cPassword}
              secureTextEntry
              placeholder="Confirm Password"
              label="Confirm Password"
              errorMessage={errors.cPassword}
            />
            <View>
              <Button onPress={() => handleSubmit()} title="Submit" />
            </View>
          </SafeAreaView>
        )}
      </Formik>
    </View>
  )
}

export default Register
