/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {View, Text, TextInput, Button, ImageBackground, StatusBar, StyleSheet, Alert, TouchableOpacity, TouchableHighlight} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';

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

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    // Vérifiez si l'email ou le mot de passe est vide
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Connexion réussie
        console.log('Connexion réussie'); // Ajoutez cette ligne
        // Redirection vers la page d'accueil
        navigation.navigate('Home');
      })
      .catch((error) => {
        console.log('Erreur lors de la connexion :', error);
        // Afficher une alerte ou gérer l'erreur
        if (error.code === 'auth/user-not-found') {
          Alert.alert('Erreur', 'Utilisateur non trouvé. Veuillez vous inscrire.');
        } else if (error.code === 'auth/wrong-password') {
          Alert.alert('Erreur', 'Mot de passe incorrect. Veuillez réessayer.');
        } else {
          Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer plus tard.');
        }
      });
  };  
  return (
    <ImageBackground
      source={require('../assets/images/imgSignin.webp')}
      style={styles.imageBackground}>
      <StatusBar />
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Écran de connexion</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableHighlight
            onPress={handleSignIn}
            style={[styles.button, styles.shadowProp]}
            underlayColor="#fff">
            <Text style={{fontWeight: 'bold', color: 'green'}}>Login</Text>
          </TouchableHighlight>
          <TouchableOpacity
            style={[styles.button, styles.signInButton, styles.shadowProp]}
            onPress={() => navigation.navigate('Signup')}>
            <Text style={{color: 'green', fontWeight: 'bold'}}>Inscription</Text>
          </TouchableOpacity>
        </View>
      </View>

    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center', // Ajout de cette ligne
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color:'#000',
  },
  input: {
    width: 225,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color:'#000',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 20,
    padding:15,
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  signInButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    padding:15,
  },
});
export default Login;
