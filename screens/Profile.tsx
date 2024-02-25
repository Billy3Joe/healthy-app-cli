/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BottomBar from '../components/BottomBar';
import placeholderImage from '../assets/img-profiles/avatar.jpg';
import {firebase} from '../lib/firebase';

export default function Profile() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  // Démarre un effet de côté pour récupérer les données de l'utilisateur actuellement connecté
useEffect(() => {
  // Récupère l'utilisateur actuellement connecté à l'application
  const currentUser = firebase.auth().currentUser;
  // Vérifie s'il y a un utilisateur connecté
  if (currentUser) {
      // Récupère l'identifiant unique de l'utilisateur
      const uid = currentUser.uid;
      // Récupère le document utilisateur correspondant à partir de la collection "users" dans Firestore
      firebase.firestore().collection('users').doc(uid).get()
          .then((doc) => {
              // Gère la réponse de la requête de récupération du document utilisateur
              if (doc.exists) {
                  // Récupère les données du document utilisateur
                  const userData = doc.data();
                  // Affiche les données de l'utilisateur dans la console pour vérification
                  console.log("User data:", userData);
                  // Met à jour l'état de l'utilisateur avec les données récupérées
                  setUser(userData);
              } else {
                  // Si le document utilisateur n'existe pas, affiche un message d'erreur
                  console.log("User document not found");
              }
          })
          .catch((error) => {
              // Gère les erreurs éventuelles lors de la récupération du document utilisateur
              console.error("Error retrieving user document:", error);
          });
  } else {
      // Si aucun utilisateur n'est connecté, affiche un message indiquant que l'utilisateur n'est pas connecté
      console.log("User not logged in");
  }
}, []);


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Édition de l'utilisateur</Text>
      </View>
      <Image source={placeholderImage} style={styles.profileImage} />
      <View style={styles.userInfoContainer}>
        <Text style={styles.name}>{user?.Name}</Text>
      </View>
      <View style={styles.emailContainer}>
        <Text style={styles.details}>{user?.Email}</Text>
      </View>
      <View style={styles.infosContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('EditePhoto')} style={[styles.editButton]}>
          <Text style={{fontWeight:'bold', color:'#FFF'}}>Image</Text>
          <MaterialIcons name="chevron-right" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('EditeName')} style={[styles.editButton]}>
          <Text style={{fontWeight:'bold', color:'#FFF'}}>Nom</Text>
          <MaterialIcons name="chevron-right" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('EditeEmail')} style={[styles.editButton]}>
          <Text style={{fontWeight:'bold', color:'#FFF'}}>Email</Text>
          <MaterialIcons name="chevron-right" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <BottomBar namePage="Profile" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 75,
  },
  title: {
    fontSize: 25,
    color: 'green',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'green',
    borderRadius: 15,
    padding: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  details: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000',
  },
  editButton: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: 'green',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 190,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
