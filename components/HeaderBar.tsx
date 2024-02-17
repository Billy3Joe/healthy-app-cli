/* eslint-disable prettier/prettier */
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
      {/* <Text style={styles.title}>Déconnexion</Text> */}
      <TouchableOpacity style={styles.profileContainer} onPress={() => navigation.navigate('Profile')}>
        <Image
          source={require('../assets/logo.png')}
          style={{width: 40, height: 40}}
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