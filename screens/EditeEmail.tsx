import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, Text, StyleSheet, Alert} from 'react-native';
import {useNavigation} from "@react-navigation/native";
// import Icon from 'react-native-vector-icons/Ionicons';
import BottomBar from '../components/BottomBar';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
const EditeEmail = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const handleEditEmail = () => {
    const user = firebase.auth().currentUser;
    if (user) {
      user.updateEmail(email)
        .then(() => {
          console.log('Email mis à jour avec succès');
          Alert.alert('Succès', 'Votre e-mail a été mis à jour avec succès.');
          setEmail('');
        })
        .catch((error) => {
          console.error('Erreur lors de la mise à jour de l\'e-mail:', error);
          Alert.alert('Erreur', 'Une erreur s\'est produite. Veuillez réessayer plus tard.');
        });
    } else {
      console.error('Utilisateur non trouvé');
      Alert.alert('Erreur', 'Utilisateur non trouvé. Veuillez vous reconnecter.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Profile')}>
          {/* <Ionicons onPress={() => navigation.navigate('Profile')} name="arrow-back" size={24} color="black" /> */}
          {/* <Text style={styles.title}>Retour</Text> */}
        </TouchableOpacity>
        <Text style={styles.title}>Modifier votre Email</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <TouchableOpacity style={styles.editeButton} onPress={handleEditEmail}>
          {/* <Ionicons name="pencil" size={20} color="white" /> */}
          <Text style={styles.buttonText}>Confirmer</Text>
        </TouchableOpacity>
      </View>
      <BottomBar namePage="EditeEmail" />
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
export default EditeEmail;
