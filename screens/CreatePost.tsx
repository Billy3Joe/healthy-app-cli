/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  // Image,
  StyleSheet,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'react-native-image-picker';
import BottomBar from '../components/BottomBar';
import HeaderBar from '../components/HeaderBar';

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

export default function CreatePost() {
  const navigation = useNavigation();
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const handleAddPost = async () => {
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
        const post = {
          user: uid,
          title: title,
          content: description,
          imageURL: imageURL,
          date: new Date(),
          isLiked: false,
          comments: [],
          likes: 0,
        };
        await firebase.firestore().collection('posts').add(post);
        // Affichez un message de confirmation
        Alert.alert('Succès', 'Le post a été créé avec succès.', [
          {
            text: 'OK',
            onPress: () => {
              // Réinitialisez les champs après la création du post
              setImage('');
              setTitle('');
              setDescription('');
              // Redirigez l'utilisateur vers la page Home
              navigation.navigate('Home');
            },
          },
        ]);
      } else {
        // Affichage d'une alerte si aucune image n'est sélectionnée
        Alert.alert(
          'Erreur',
          'Veuillez sélectionner une image avant de créer le post',
        );
      }
    } catch (error) {
      // Affichage d'une alerte en cas d'erreur lors de l'ajout du post
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de la création du post. Veuillez réessayer.',
      );
      console.error('Error adding post:', error);
    }
  };
  const pickImage = async () => {
    try {
      const options = {
        mediaType: 'photo',
        quality: 1,
      };

      ImagePicker.launchImageLibrary(options, response => {
        if (!response.didCancel && response.assets) {
          setImage(response.assets[0].uri);
        }
      });
    } catch (error) {
      console.error("Erreur lors de la sélection de l'image :", error);
    }
  };
  return (
    <View style={styles.container}>
      <HeaderBar namePage="CreatePost" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}>
             {/* <Ionicons name="add-outline" size={24} color="black" /> */}
        </TouchableOpacity>
        <Text style={styles.title}>Publier votre recette</Text>
      </View>
      <View style={styles.formContainer}>
        <TouchableOpacity style={styles.addButton} onPress={pickImage}>
          <Text style={styles.buttonText}>Sélectionner une image</Text>
        </TouchableOpacity>
        <Text />
        <TextInput
          style={styles.input}
          placeholder="Titre"
          value={title}
          onChangeText={text => setTitle(text)}
        />
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Description"
          multiline
          value={description}
          onChangeText={text => setDescription(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddPost}>
          <Text style={styles.buttonText}>Confirmer</Text>
        </TouchableOpacity>
      </View>
      <BottomBar namePage="CreatePost" />
    </View>
  );
}
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
    color:'#000',
  },
  descriptionInput: {
    height: 150,
    color:'#000',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 0,
    color:'#000',
  },
  addButton: {
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
});
