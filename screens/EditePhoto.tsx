/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Alert, Platform} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import BottomBar from '../components/BottomBar';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import ImagePicker from 'react-native-image-picker'; // Utilisez react-native-image-picker
const EditePhoto = () => {
  const [image, setImage] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();
  const handleEditePhoto = async () => {
    try {
      const uid = firebase.auth().currentUser.uid;
      const storageRef = firebase.storage().ref();
      if (image !== '') {
        const filename = `${uid}_${Date.now()}.jpg`;
        const imageUri = image;
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const imageRef = storageRef.child(`images/${filename}`);
        await imageRef.put(blob);
        const imageURL = await imageRef.getDownloadURL();
        await firebase.firestore().collection('users').doc(uid).update({
          Profile_Image: imageURL,
        });
        console.log('Image de profil mise à jour avec succès');
        setImage('');
        setConfirmationMessage('Image de profil mise à jour avec succès');
        setTimeout(() => {
          setConfirmationMessage('');
        }, 3000);
      } else {
        setErrorMessage('Veuillez sélectionner une image');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'image de profil :', error.message);
      setErrorMessage('Erreur lors de la mise à jour de l\'image de profil. Veuillez réessayer.');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };
  const pickImage = () => {
    const options = {
      title: 'Sélectionnez une photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('L\'utilisateur a annulé la sélection de l\'image');
      } else if (response.error) {
        console.error('Erreur:', response.error);
      } else {
        const source = {uri: response.uri};
        setImage(response.uri);
      }
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.title}>Retour</Text>
        </TouchableOpacity> */}
        <Text style={styles.title}>Modifier votre Photo</Text>
      </View>
      <View style={styles.formContainer}>
        <TouchableOpacity style={styles.updateButton} onPress={pickImage}>
          <Text style={styles.buttonText}>Sélectionner une image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.updateButton} onPress={handleEditePhoto}>
          {/* <Ionicons name="pencil" size={20} color="white" /> */}
          <Text style={styles.buttonText}>Confirmer</Text>
        </TouchableOpacity>
        {confirmationMessage ? (
          <Text style={styles.confirmationMessage}>{confirmationMessage}</Text>
        ) : null}
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}
      </View>
      <BottomBar namePage="CreatePost" />
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
    updateButton: {
      backgroundColor: 'green',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      borderRadius: 4,
      marginBottom: 10,
    },
    buttonText: {
      color: '#FFF',
    },
    confirmationMessage: {
      color: 'green',
      textAlign: 'center',
    },
    errorMessage: {
      color: 'red',
      textAlign: 'center',
    },
  });
  export default EditePhoto;
