import React, {useState} from 'react';
import {View, Text, TextInput, TouchableHighlight, TouchableOpacity, ImageBackground, StatusBar, StyleSheet, Alert, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {firebase} from '../lib/firebase';

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
        const defaultProfileImage = 'https://firebasestorage.googleapis.com/v0/b/recipes-app-c60eb.appspot.com/o/images%2FFMRB06ZBpmVSfRPb0eBhRLzavp22_1704573584096.jpg?alt=media&token=96238902-13b6-43bc-89fc-31551b4acc9c';
        firebase.firestore().collection('users').doc(user.uid).set({
          Email: email,
          Name: username,
          Profile_Image: defaultProfileImage,
          Friends: [],
        })
          .then(() => {
            Alert.alert('Inscription réussie', 'Votre compte a été créé avec succès.');
            setUsername('');
            setEmail('');
            setPassword('');
            navigation.navigate('Login');
          })
          .catch((error) => {
            console.error('Erreur lors de la création du document utilisateur :', error.message);
            Alert.alert('Erreur', 'Une erreur s\'est produite lors de l\'inscription. Veuillez réessayer.');
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Erreur lors de l\'inscription :', errorCode, errorMessage);
        if (errorCode === 'auth/email-already-in-use') {
          Alert.alert('Adresse e-mail déjà utilisée', 'Cette adresse e-mail est déjà associée à un autre compte.');
        } else if (errorCode === 'auth/weak-password') {
          Alert.alert('Mot de passe faible', 'Le mot de passe doit comporter au moins 6 caractères.');
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
            <Text style={{fontWeight: 'bold', textAlign: 'center', color: 'green'}}>Inscription</Text>
          </TouchableHighlight>
          <TouchableOpacity style={styles.signInButton}>
            <Text style={{color: 'white', fontWeight: 'bold', textAlign: 'center', color: 'green'}}>Login</Text>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#000',
  },
  input: {
    width: 225,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#000',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 20,
    padding: 15,
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
    padding: 15,
  },
});

export default Signup;
