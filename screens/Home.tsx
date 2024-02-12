import React from 'react';
import {View, Text, StyleSheet} from 'react-native'; 
// import HeaderBar from '../components/HeaderBar';
const Home = () => {
  return (
    <>
      {/* <HeaderBar namePage="Home" /> */}
      <View style={styles.container}>
        <Text style={styles.title}>Healty Education!</Text>
        <Text style={styles.subtitle}>This is a simple example... </Text>
      </View>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
  },
});
