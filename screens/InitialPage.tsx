/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, ImageBackground, StatusBar} from 'react-native';
import {useNavigation} from '@react-navigation/native'; // Importez useNavigation depuis @react-navigation/native

/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDov17ALUBYKsRRPqR6xxYGLq2Xs66_rtw',
  authDomain: 'recipes-app-c60eb.firebaseapp.com',
  projectId: 'recipes-app-c60eb',
  storageBucket: 'recipes-app-c60eb.appspot.com',
  messagingSenderId: '708037718915',
  appId: '1:708037718915:web:acb4159698d39547693cb6',
  measurementId: 'G-Z1V69ZH6S3',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
// export default firebase;

const InitialPage: React.FC = () => {
  const navigation = useNavigation(); // Obtenez l'objet de navigation

  const actionNavigationSignin = () => {
    navigation.navigate('Login'); // Utilisez navigate pour aller à l'écran Login
  };

  const actionNavigationSignup = () => {
    navigation.navigate('Signup'); // Utilisez navigate pour aller à l'écran Signup
  };

  return (
    <ImageBackground
      source={require('../assets/logo.png')}
      style={styles.imageBackground}>
      <StatusBar />
      <View style={styles.container}>
        <View style={styles.title}>
          <Text style={styles.textAccountInformation}>
            Welcome
          </Text>
          <Text style={{fontStyle: 'italic', color:'green'}}>
            Join us to share with other users your best Healthy Recipes.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={actionNavigationSignin}
            style={[styles.item, {backgroundColor: 'green'}]}>
            <Text style={{fontWeight: 'bold'}}>Signin</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={actionNavigationSignup}
            style={[styles.item, {backgroundColor: 'white'}]}>
            <Text style={{fontWeight: 'bold', color:'#000'}}>Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default InitialPage;

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    alignItems: 'center',
    marginBottom: 10,
  },
  textAccountInformation: {
    fontSize: 40,
    fontWeight: 'bold',
    color:'green',
  },
  buttonContainer: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    width: 300,
    height: 50,
    backgroundColor: 'rgba(355, 355, 355, 0.3)',
    borderRadius: 3,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
