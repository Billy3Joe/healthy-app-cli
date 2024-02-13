import React, {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import BottomBar from '../components/BottomBar';
import HeaderBar from '../components/HeaderBar';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
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
import placeholderImage from '../assets/img-profiles/avatar.jpg';
export default function Profile() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const uid = firebase.auth().currentUser.uid;
    firebase.firestore().collection('users').doc(uid).get()
      .then((doc) => {
        if (doc.exists) {
          setUser(doc.data());
        } else {
          console.log("User document not found");
        }
      })
      .catch((error) => {
        console.error("Error retrieving user document:", error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Édition de l'utilisateur</Text>
      </View>
      <Image source={placeholderImage} style={styles.profileImage} />
      <View style={styles.editIconContainer}>
        <Ionicons name="pencil" size={20} color="white" />
      </View>
      <View style={styles.userInfoContainer}>
        <Text style={styles.name}>{user?.Name}</Text>
      </View>
      <View style={styles.emailContainer}>
        <Text style={styles.details}>EMAIL: {user?.Email}</Text>
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
  },
  details: {
    fontSize: 16,
    marginBottom: 5,
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