/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, Text, TouchableOpacity, View, Image, Alert} from "react-native";
import firebase from 'firebase/compat/app'; // Importez firebase depuis compat/app
import 'firebase/compat/auth'; // Importez le module d'authentification firebase

function HeaderBar(props) {
  const navigation = useNavigation();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };
  const closeMenu = () => {
    setMenuOpen(false);
  };
  const handleNavigation = (screen) => {
    closeMenu();
    navigation.navigate(screen);
  };
  const handlePlus = () => {
    // Logique de plus ici
  };

  const handleLogout = () => {
    firebase.auth().signOut() // Appel de la fonction de déconnexion de Firebase
      .then(() => {
        // Déconnexion réussie
        console.log('Déconnexion réussie');
        // Naviguez vers l'écran de connexion ou toute autre destination appropriée
        navigation.navigate('Login'); // Exemple : navigation vers l'écran de connexion
      })
      .catch((error) => {
        // Gestion des erreurs lors de la déconnexion
        console.error('Erreur lors de la déconnexion :', error.message);
        Alert.alert('Erreur', 'Une erreur est survenue lors de la déconnexion. Veuillez réessayer.');
      });
  };
  return (
    <View style={[styles.container, {backgroundColor: 'green'}]}>
      <TouchableOpacity style={styles.profileContainer} onPress={() => navigation.navigate('Profile')}>
        <Image
          source={require('../assets/logo.png')}
          style={{width: 40, height: 40}}
        />
      </TouchableOpacity>
      <Text style={styles.title}>HEALTHY EDUCATION</Text>
      {/* Ajout de la fonction handleLogout */}
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Image
          source={require('../assets/icones/fermer.png')}
          style={[styles.icon, {width: 40, height: 40}]}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderBottomWidth: 1,
    padding: 12,
    borderBottomColor: '#DDDDDD',
    zIndex: 100,
  },
  title: {
    fontSize: 18,
    color: 'white',
  },
  profileContainer: {
    marginRight: 10,
  },
  menuText: {
    fontSize: 16,
  },
});

export default HeaderBar;
