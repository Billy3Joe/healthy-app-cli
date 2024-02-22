/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, Text, StyleSheet, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
// import Icon from 'react-native-vector-icons/Ionicons';
import BottomBar from '../components/BottomBar';
import HeaderBar from '../components/HeaderBar';
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
const db = firebase.firestore();
const EditeName = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');

  const handleEditName = () => {
    const user = firebase.auth().currentUser;
    if (user) {
      db.collection('users').doc(user.uid).update({
        Name: name
      })
      .then(() => {
        console.log('Nom mis à jour avec succès');
        Alert.alert('Succès', 'Votre nom a été mis à jour avec succès.');
        setName('');
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour du nom:', error);
        Alert.alert('Erreur', 'Une erreur s\'est produite. Veuillez réessayer plus tard.');
      });
    } else {
      console.error('Utilisateur non trouvé');
      Alert.alert('Erreur', 'Utilisateur non trouvé. Veuillez vous reconnecter.');
    }
  };

  return (
    <View style={styles.container}>
      <HeaderBar namePage="Home" />
      <View style={styles.header}>
        {/* <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.title}>Retour</Text>
        </TouchableOpacity> */}
        <Text style={styles.title}>Modifier votre nom</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder='Nom'
          value={name}
          onChangeText={text => setName(text)}
        />
        <TouchableOpacity style={styles.editeButton} onPress={handleEditName}>
          {/* <Ionicons name="pencil" size={20} color="white" /> */}
          <Text style={styles.buttonText}>Confirmer</Text>
        </TouchableOpacity>
      </View>
      <BottomBar namePage='EditeName' />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    margin: 0,
    color: 'green',
  },
  formContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  editeButton: {
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderRadius: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
});
export default EditeName;
