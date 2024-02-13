import React, {useState} from 'react';
import {View, Text, TextInput, Button, ImageBackground, StatusBar, StyleSheet, Alert, TouchableOpacity, TouchableHighlight} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';

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

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Connexion réussie
        console.log('Connexion réussie');
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
            <Text style={{ fontWeight: "bold", textAlign: "center" }}>Connexion</Text>
          </TouchableHighlight>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => navigation.navigate('Signup')}>
            <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Aller à l'inscription</Text>
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
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    width: 225,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 20,
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default Login;
