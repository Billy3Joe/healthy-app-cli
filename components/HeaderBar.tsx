import React, {useState} from 'react';
import {useNavigation} from "@react-navigation/native";
import {StyleSheet, Text, TouchableOpacity, View, Image, Alert} from "react-native";
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
  return (
    <View style={[styles.container, { backgroundColor: 'green' }]}>
      <Text style={styles.title}>HEALTHY EDUCATION</Text>
      {/* Ajout de l'image à côté du profil */}
      <TouchableOpacity style={styles.profileContainer} onPress={() => navigation.navigate('Profile')}>
        <Image
          source={require('../assets/logo.png')}
          style={{ width: 40, height: 40 }}
        />
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.modalItem} onPress={() => navigation.navigate('Profile')}>
         <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity> */}
      {isMenuOpen && (
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('Home')}>
            <Text style={styles.menuText}>0 à 12 mois</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('CreatePost')}>
            <Text style={styles.menuText}>1 à 3 ans</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('Profile')}>
            <Text style={styles.menuText}>3 à 5 ans</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleNavigation}>
            <Text style={styles.menuText}>5 à 12 ans</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handlePlus}>
            <Text style={styles.menuText}>plus</Text>
          </TouchableOpacity>
        </View>
      )}
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

  menuContainer: {
    position: 'absolute',
    left: 0,
    top: 60, // Ajustez la position verticale selon vos besoins
    backgroundColor: 'white',
    width: 200,
    elevation: 5, // Pour ajouter une ombre sur Android
    shadowColor: 'black', // Pour ajouter une ombre sur iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  menuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },

  menuText: {
    fontSize: 16,
  },
});
export default HeaderBar;