import React from 'react';
// import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './screens/Home';
import EditePhoto from './screens/EditePhoto';
import EditeEmail from './screens/EditeEmail';
import EditeName from './screens/EditeName';
import Profile from './screens/Profile';
import CreatePost from './screens/CreatePost';
import SignIn from './screens/Login';
import SignUp from './screens/Signup';
import InitialPage from './screens/InitialPage';
import messaging from '@react-native-firebase/messaging';

const Stack = createNativeStackNavigator();

export default function App() {
  messaging().requestPermission().then((permission) => {
    if(permission) {
      console.log('Permission granted');
    } else {
      console.log('Permission denied');
    }
  });
 
// Handle incoming notifications when app is in foreground
messaging().onMessage(async (remoteMessage) => {
  console.log('Received foreground notification: ', remoteMessage);
});

// Handle incoming notifications when app is in background
messaging().onNotificationOpenedApp(async (remoteMessage) => {
  console.log('Received background notification: ', remoteMessage);
});

// Handle incoming notifications when app is closed
messaging().getInitialNotification().then(async (remoteMessage) => {
  console.log('Received closed app notification: ', remoteMessage);
});

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="InitialPage"
        // screenOptions={{
        //   headerShown: false,
        // }}
      >
        <Stack.Screen name="InitialPage" component={InitialPage} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={SignIn} options={{ headerShown: false }}/>
        <Stack.Screen name="CreatePost" component={CreatePost} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="EditeName" component={EditeName} />
        <Stack.Screen name="EditeEmail" component={EditeEmail} />
        <Stack.Screen name="EditePhoto" component={EditePhoto} />
        <Stack.Screen
          options={{
            // animation: "none",
            gestureEnabled: false,
          }}
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
