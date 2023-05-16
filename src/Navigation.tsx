/* eslint-disable import/order */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'

import Ionicons from '@expo/vector-icons/AntDesign'

import AddExpenseBookModal from './AddExpenseBookModal'
import ExpenseScreen from './ExpenseScreen'
import HomeScreen from './HomeScreen'
import ExpenseDetailsScreen from './ExpenseDetailsScreen'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

function BottomNavigation() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
          headerShown: false
        }}
      />
      <Tab.Screen
        name="Expense"
        component={ExpenseScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="creditcard" color={color} size={size} />,
          headerShown: false
        }}
      />
    </Tab.Navigator>
  )
}

function Navigation() {
  return (
    <Stack.Navigator initialRouteName="Initial">
      <Stack.Screen
        name="Initial"
        component={BottomNavigation}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="ExpenseDetail"
        component={ExpenseDetailsScreen}
        options={{
          title: 'Expense Detail'
        }}
      />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          name="AddExpenseBookModal"
          component={AddExpenseBookModal}
          options={{
            title: 'Add Expense Book'
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  )
}

export default Navigation
