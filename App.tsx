import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'
import Login from './screens/Login';
import Home from './screens/Home';
import Products from './screens/Products';
import Users from './screens/Users';
import CreateUsers from './screens/CreateUsers';

const Stack = createStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' component={Login} options={{header: () => <></> }}/>
        <Stack.Screen name='Home' component={Home} options={{header: () => <></> }}/>
        <Stack.Screen name='Products' component={Products} options={{header: () => <></> }}/>
        <Stack.Screen name='Users' component={Users}/>
        <Stack.Screen name='CreateUsers' component={CreateUsers}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
