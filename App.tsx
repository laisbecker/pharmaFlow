import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, StatusBar } from 'react-native';
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
import { PaperProvider } from 'react-native-paper';

const Stack = createStackNavigator()

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
      <StatusBar/>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' component={Login} options={{ headerShown: false }}/>
        <Stack.Screen name='Home' component={Home} options={{ headerShown: false }}/>
        <Stack.Screen name='Users' component={Users} options={{ headerShown: false }}/>
        <Stack.Screen name='CreateUsers' component={CreateUsers} options={{ headerShown: false }}/>
        <Stack.Screen name='ListProducts' component={ListProducts} options={{ headerShown: false }}/>
        <Stack.Screen name='ListMov' component={ListMov} options={{ headerShown: false }}/>
        <Stack.Screen name='RegisterMov' component={RegisterMov} options={{ headerShown: false }}/>
        <Stack.Screen name='TrackMovements' component={TrackMovements} options={{ headerShown: false }}/>
        <Stack.Screen name='Mapa' component={Mapa} options={{headerBackTitle: 'Voltar'}}/>
      </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
