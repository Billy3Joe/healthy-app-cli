import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

const BottomBar = (/*{navigation}: {navigation:any}*/) => {
  // const [setModalVisible] = useState(false);

  // const handleSettings = () => {
  //   setModalVisible(true);
  // };

  // const closeModal = () => {
  //   setModalVisible(false);
  // };

  useFocusEffect(
    React.useCallback(() => {
      // Réinitialiser la valeur de modalVisible lorsque le composant est monté
      // setModalVisible(false);

      return () => {
        // Réinitialiser la valeur de modalVisible lorsque le composant est démonté
        // setModalVisible(false);
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.modalItem}>Informations profile</Text>
      <Text style={styles.modalItem}>Mes publications</Text>
      <Text style={styles.modalItem}>Ma liste d'amis</Text>
      <Text style={styles.modalItem}>Découvrir des personnes</Text>
      <Text style={styles.modalItem}>Déconnexion</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalItem: {
    fontSize: 18,
    marginVertical: 10,
  },
});

export default BottomBar;
