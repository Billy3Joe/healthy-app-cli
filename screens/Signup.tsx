import React, {useState} from 'react';
import {View, Text, TextInput, TouchableHighlight, TouchableOpacity, ImageBackground, StatusBar, StyleSheet, Alert} from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {useNavigation} from '@react-navigation/native';

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

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleSignup = () => {
    if (!username.trim()) {
      Alert.alert('Nom d\'utilisateur requis', 'Veuillez entrer votre nom d\'utilisateur.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Email requis', 'Veuillez entrer votre adresse e-mail.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Mot de passe requis', 'Veuillez entrer votre mot de passe.');
      return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        firebase.firestore().collection('users').doc(user.uid).set({
          Email: email,
          Name: username,
          Profile_Image: '',
          Friends: [],
        })
          .then(() => {
            Alert.alert('Inscription réussie', 'Votre compte a été créé avec succès.');
            setUsername('');
            setEmail('');
            setPassword('');
            navigation.navigate('Login'); // Redirection vers la page de connexion
          })
          .catch((error) => {
            console.error('Erreur lors de la création du document utilisateur :', error.message);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Erreur lors de l\'inscription :', errorCode, errorMessage);
        if (errorCode === 'auth/email-already-in-use') {
          Alert.alert('Adresse e-mail déjà utilisée', 'Cette adresse e-mail est déjà associée à un autre compte.');
        } else {
          Alert.alert('Inscription échouée', errorMessage);
        }
      });
  };

  return (
    <ImageBackground
      source={require('../assets/images/imgSignup.webp')}
      style={styles.imageBackground}>
      <StatusBar />
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Formulaire d'inscription</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom d'utilisateur"
            value={username}
            onChangeText={setUsername}
          />
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
            onPress={() => handleSignup()}
            style={[styles.button, styles.shadowProp]}
            underlayColor="#fff">
            <Text style={{ fontWeight: "bold", textAlign: "center" }}>S'inscrire</Text>
          </TouchableHighlight>
          <TouchableOpacity
            style={styles.signInButton}>
            <Text style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Aller à la page de connexion</Text>
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

export default Signup;
