/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {StyleSheet, Text, Image, TouchableOpacity, View, Modal} from 'react-native';
import {useNavigation} from "@react-navigation/native";
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function BottomBar({ handleRefresh }) {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')} >
        {/* <Text style={styles.buttonText}>Home</Text> */}
        <Image
          source={require('../assets/icones/accueil.png')}
          style={[styles.icon, {width: 38, height: 38}]}
        />
        {/* <MaterialIcons name="Home" size={24} color="black" />  */}
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreatePost')}>
        {/* <Text style={styles.buttonText}>Post</Text> */}
        <Image
          source={require('../assets/icones/ajouter.png')}
          style={[styles.icon, {width: 45, height: 45}]}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
        {/* <Text style={styles.buttonText}>Profile</Text> */}
        <Image
          source={require('../assets/icones/profil.png')}
          style={[styles.icon, {width: 45, height: 45}]}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleRefresh}>
        <Image
          source={require('../assets/icones/actualiser.png')}
          style={[styles.icon, { width: 35, height: 35 }]}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#DDDDDD',
    paddingVertical: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 16,
    color:'#fff',
  },
});

