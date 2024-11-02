import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'
import Login from './screens/Login';
import Home from './screens/Home';
import TrackMovements from './screens/TrackMovements';
import Users from './screens/Users';
import CreateUsers from './screens/CreateUsers';
import ListMov from './screens/ListMov';
import ListProducts from './screens/ListProducts';
import RegisterMov from './screens/RegisterMov';
import Mapa from './screens/Mapa'

const Stack = createStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' component={Login} options={{header: () => <></> }}/>
        <Stack.Screen name='Home' component={Home} options={{header: () => <></> }}/>
        <Stack.Screen name='Users' component={Users} options={{header: () => <></> }}/>
        <Stack.Screen name='CreateUsers' component={CreateUsers} options={{header: () => <></> }}/>
        <Stack.Screen name='ListProducts' component={ListProducts} options={{header: () => <></> }}/>
        <Stack.Screen name='ListMov' component={ListMov} options={{header: () => <></> }}/>
        <Stack.Screen name='RegisterMov' component={RegisterMov} options={{header: () => <></> }}/>
        <Stack.Screen name='TrackMovements' component={TrackMovements} options={{header: () => <></> }}/>
        <Stack.Screen name='Mapa' component={Mapa} />
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
