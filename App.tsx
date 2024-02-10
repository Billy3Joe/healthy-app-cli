import React from 'react';
// import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './screens/Home';
import SignIn from './screens/Login';
import SignUp from './screens/Signup';
import InitialPage from './screens/InitialPage';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="InitialPage"
        // screenOptions={{
        //   headerShown: false,
        // }}
      >
        <Stack.Screen name="InitialPage" component={InitialPage} />
        <Stack.Screen name="Signup" component={SignUp} />
        <Stack.Screen name="Login" component={SignIn} />
        <Stack.Screen
          options={{
            // animation: "none",
            gestureEnabled: false,
          }}
          name="Home"
          component={Home}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
