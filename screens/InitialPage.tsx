/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, ImageBackground, StatusBar} from 'react-native';
import {useNavigation} from '@react-navigation/native'; // Importez useNavigation depuis @react-navigation/native

const InitialPage: React.FC = () => {
  const navigation = useNavigation(); // Obtenez l'objet de navigation

  const actionNavigationSignin = () => {
    navigation.navigate('Login'); // Utilisez navigate pour aller à l'écran Login
  };

  const actionNavigationSignup = () => {
    navigation.navigate('Signup'); // Utilisez navigate pour aller à l'écran Signup
  };

  return (
    <ImageBackground
      source={require('../assets/logo.png')}
      style={styles.imageBackground}>
      <StatusBar />
      <View style={styles.container}>
        <View style={styles.title}>
          <Text style={styles.textAccountInformation}>
            Welcome
          </Text>
          <Text style={{fontStyle: 'italic', color:'green'}}>
            Join us to share with other users your best Healthy Recipes.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={actionNavigationSignin}
            style={[styles.item, {backgroundColor: 'green'}]}>
            <Text style={{fontWeight: 'bold'}}>Signin</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={actionNavigationSignup}
            style={[styles.item, {backgroundColor: 'white'}]}>
            <Text style={{fontWeight: 'bold', color:'#000'}}>Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default InitialPage;

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    alignItems: 'center',
    marginBottom: 10,
  },
  textAccountInformation: {
    fontSize: 40,
    fontWeight: 'bold',
    color:'green',
  },
  buttonContainer: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    width: 300,
    height: 50,
    backgroundColor: 'rgba(355, 355, 355, 0.3)',
    borderRadius: 3,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
