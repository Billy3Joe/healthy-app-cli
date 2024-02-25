/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import BottomBar from '../components/BottomBar';
import HeaderBar from '../components/HeaderBar';
import {firebase, db} from '../lib/firebase'; 

export default function Home() {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [commentingPostId, setCommentingPostId] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState({});


 // Utilisation du hook useEffect pour effectuer une opération asynchrone lors du chargement initial du composant
useEffect(() => {
  // Définition de la fonction fetchPosts pour récupérer les publications depuis la base de données
  const fetchPosts = async () => {
    try {
      // Récupération d'un snapshot contenant les données des documents dans la collection 'posts'
      const snapshot = await firebase.firestore().collection('posts').get();
      // Initialisation du tableau qui contiendra les publications récupérées
      const fetchedPosts = [];
      // Itération à travers les documents du snapshot
      for (const doc of snapshot.docs) {
        // Extraction des données du document
        const postData = doc.data();
        // Extraction de la date de la publication, si elle est définie
        const date = postData.date ? postData.date.toDate() : null; // Vérifier si postData.date est défini
        // Récupération des données de l'utilisateur qui a publié le message
        const userSnapshot = await firebase.firestore().collection('users').doc(postData.user).get();
        // Vérification de l'existence de l'utilisateur dans la base de données
        if (userSnapshot.exists) {
          // Extraction des données de l'utilisateur
          const userData = userSnapshot.data();
          // Vérification de l'existence de l'image de profil de l'utilisateur
          if (userData && userData.Profile_Image) {
            // Création de l'objet représentant la publication avec les données de l'utilisateur et la date
            const post = {
              id: doc.id,
              ...postData,
              date, // Utiliser la valeur de date définie ou null
              user: {
                name: userData.Name,
                profileImage: userData.Profile_Image,
              },
            };
            // Ajout de la publication au tableau des publications récupérées
            fetchedPosts.push(post);
          } else {
            // Consignation d'une erreur si les données de l'utilisateur ou l'image de profil de l'utilisateur ne sont pas trouvées
            console.error('Données utilisateur ou champ Profile_Image introuvable pour la publication', doc.id);
          }
        } else {
          // Consignation d'une erreur si les données de l'utilisateur ne sont pas trouvées
          console.error('Données utilisateur introuvables pour la publication', doc.id);
        }
      }
      // Mise à jour de l'état avec les publications récupérées
      setPosts(fetchedPosts);
    } catch (error) {
      // Consignation d'une erreur s'il y a une erreur lors de la récupération des publications
      console.error('Erreur lors de la récupération des publications :', error);
    }
  };
  // Appel de la fonction fetchPosts pour récupérer les publications lors du chargement initial du composant
  fetchPosts();
}, []); // Le tableau de dépendances est vide, ce qui signifie que cette opération ne sera exécutée qu'une fois, lors du chargement initial


  // Fonction handleRefresh pour gérer la logique de rafraîchissement des publications
const handleRefresh = async () => {
  setRefreshing(true); // Activer l'indicateur de chargement

  try {
    // Réaliser ici la logique de rafraîchissement
    // Récupérer un snapshot contenant les données des documents dans la collection 'posts'
    const snapshot = await firebase.firestore().collection('posts').get();
    // Initialiser le tableau qui contiendra les publications récupérées
    const fetchedPosts = [];

    // Itération à travers les documents du snapshot
    for (const doc of snapshot.docs) {
      // Extraction des données du document
      const postData = doc.data();
      // Extraction de la date de la publication
      const date = postData.date.toDate();

      // Récupération des données de l'utilisateur qui a publié le message
      const userSnapshot = await firebase.firestore().collection('users').doc(postData.user).get();

      // Vérification de l'existence de l'utilisateur dans la base de données
      if (userSnapshot.exists) {
        // Extraction des données de l'utilisateur
        const userData = userSnapshot.data();

        // Vérification de l'existence des données utilisateur et du champ Profile_Image
        if (userData && userData.Profile_Image) {
          // Création de l'objet représentant la publication avec les données de l'utilisateur et la date
          const post = {
            id: doc.id,
            ...postData,
            date,
            user: {
              name: userData.Name,
              profileImage: userData.Profile_Image,
            },
          };
          // Ajout de la publication au tableau des publications récupérées
          fetchedPosts.push(post);
        } else {
          // Consignation d'une erreur si les données utilisateur ou le champ Profile_Image ne sont pas trouvés
          console.error('Données utilisateur ou champ Profile_Image introuvable pour la publication', doc.id);
        }
      } else {
        // Consignation d'une erreur si les données utilisateur ne sont pas trouvées
        console.error('Données utilisateur introuvables pour la publication', doc.id);
      }
    }
    // Mise à jour de l'état avec les publications récupérées
    setPosts(fetchedPosts);

    // Désactiver l'indicateur de chargement une fois l'actualisation terminée
    setRefreshing(false);
  } catch (error) {
    // Consignation d'une erreur s'il y a une erreur lors du rafraîchissement
    console.error('Erreur lors de l\'actualisation :', error);
    // Assurer la désactivation de l'indicateur de chargement en cas d'erreur
    setRefreshing(false);
  }
};


 // Fonction handleSearchPress pour gérer la recherche de publications
const handleSearchPress = async () => {
  try {
    // Extraire la requête de recherche en convertissant le texte en minuscules et en supprimant les espaces blancs
    const searchQuery = searchText.trim().toLowerCase();
    // Vérifier si la requête de recherche est vide
    if (searchQuery === '') {
      // Si la requête est vide, récupérer toutes les publications
      fetchPosts();
      // Réinitialiser les résultats de recherche et les messages d'erreur
      setSearchResults([]);
      setSearchError(null);
    } else {
      // Sinon, exécuter une requête pour récupérer les publications correspondant à la recherche
      const querySnapshot = await firebase
        .firestore()
        .collection('posts')
        .where('title', '>=', searchQuery) // Recherche les publications dont le titre est supérieur ou égal à la requête
        .where('title', '<=', searchQuery + '\uf8ff') // Recherche les publications dont le titre est inférieur ou égal à la requête suivie du dernier caractère Unicode
        .get();
      // Initialiser un tableau pour stocker les résultats de recherche
      const results = [];
      // Parcourir les documents correspondants à la recherche
      querySnapshot.forEach((doc) => {
        // Ajouter les données du document au tableau des résultats
        results.push(doc.data());
      });
      // Vérifier s'il y a des résultats de recherche
      if (results.length === 0) {
        // Si aucun résultat n'est trouvé, réinitialiser les résultats de recherche et définir un message d'erreur approprié
        setSearchResults([]);
        setSearchError('Recette indisponible pour le moment.');
      } else {
        // Sinon, mettre à jour les résultats de recherche et réinitialiser les messages d'erreur
        setSearchResults(results);
        setSearchError(null);
      }
    }
  } catch (error) {
    // Consigner une erreur s'il y a un problème lors de la recherche dans Firebase
    console.error('Erreur lors de la recherche dans Firebase :', error);
    // Définir un message d'erreur en cas d'échec de la recherche
    setSearchError('Erreur lors de la recherche.');
  }
};

// Fonction handleCommentButtonPress pour gérer l'ouverture de la section de commentaire pour une publication spécifique
const handleCommentButtonPress = (postId) => {
  // Définir l'identifiant de la publication sur laquelle l'utilisateur souhaite commenter
  setCommentingPostId(postId);
};


  // Fonction handleCommentSubmit pour soumettre un commentaire pour une publication spécifique
const handleCommentSubmit = async (postId) => {
  try {
      // Vérifier si le commentaire n'est pas vide
      if (!comment.trim()) {
          // Afficher une alerte si le commentaire est vide et arrêter l'exécution de la fonction
          alert('Veuillez entrer un commentaire avant de soumettre.');
          return;
      }
      // Ajouter le commentaire à la collection 'comments' dans la base de données
      await db.collection('comments').add({
          postId, // ID de la publication à laquelle le commentaire est associé
          content: comment, // Contenu du commentaire
          timestamp: firebase.firestore.FieldValue.serverTimestamp(), // Horodatage du serveur au moment de la soumission du commentaire
      });
      // Réinitialiser le champ de saisie du commentaire après l'avoir soumis avec succès
      setComment('');
      // Réinitialiser l'ID de la publication sur laquelle l'utilisateur a commenté
      setCommentingPostId('');
      // Actualiser les commentaires pour afficher le nouveau commentaire soumis
      fetchComments(postId);
  } catch (error) {
      // Consigner une erreur s'il y a un problème lors de la soumission du commentaire
      console.error('Erreur lors de la soumission du commentaire :', error);
  }
};


 // Fonction handleViewComments pour afficher ou masquer les commentaires d'une publication
const handleViewComments = async (postId) => {
  // Appeler la fonction fetchComments pour récupérer les commentaires de la publication
  fetchComments(postId);
  // Inverser l'état de l'affichage des commentaires
  setShowComments(!showComments);
};

// Fonction fetchComments pour récupérer les commentaires d'une publication spécifique
const fetchComments = async (postId) => {
  try {
      // Récupérer les commentaires de la collection 'comments' qui correspondent à l'ID de la publication
      const snapshot = await db.collection('comments').where('postId', '==', postId).get();
      // Initialiser un tableau pour stocker les commentaires récupérés
      const fetchedComments = [];

      // Parcourir les documents dans le snapshot
      snapshot.forEach((doc) => {
          // Ajouter les données du document (commentaire) au tableau des commentaires
          fetchedComments.push(doc.data());
      });

      // Mettre à jour l'état des commentaires avec les commentaires récupérés
      setComments(fetchedComments);
  } catch (error) {
      // Consigner une erreur s'il y a un problème lors de la récupération des commentaires
      console.error('Erreur lors de la récupération des commentaires :', error);
  }
};

// Fonction handleLikeButtonPress pour gérer l'ajout ou la suppression des likes
const handleLikeButtonPress = (postId) => {
  // Vérifier si la publication a déjà été aimée par l'utilisateur
  if (likes[postId]) {
    // Si la publication est déjà aimée, remettre le compteur de likes à zéro
    const updatedLikes = { ...likes };
    updatedLikes[postId] = 0;
    setLikes(updatedLikes); // Mettre à jour l'état des likes
    return;
  }

  // Ajouter le like en incrémentant le compteur
  const updatedLikes = { ...likes, [postId]: 1 };
  setLikes(updatedLikes); // Mettre à jour l'état des likes
};




  return (
    <View style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
        <HeaderBar namePage="Home" />
        <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher..."
          onChangeText={(text) => setSearchText(text)}
          value={searchText}
        />
        <TouchableOpacity onPress={handleSearchPress}>
          <Image 
            source={require('../assets/icones/rechercher.png')}
            style={[styles.icon, {width: 24, height: 24, marginRight:20 }]}
          />
          {/* <Text style={styles.searchIcon}>Search</Text> */}
        </TouchableOpacity>
      </View>
      <View style={styles.errorContainer}>
        {searchError && (
          <Text style={styles.errorText}>{searchError}</Text>)}
      </View>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
          {/* <Ionicons name="arrow-back" size={24} color="black" /> */}
        </TouchableOpacity>
        {/* <Text style={styles.title}>Espace barre de recherche</Text> */}
      </View>
      <FlatList
        data={posts}
        renderItem={({item}) => (
          <View style={styles.postContainer}>
            <View style={styles.userInfo}>
              <Image source={{ uri: item.user.profileImage }} style={styles.userImage} />
              <Text style={styles.userName}>{item.user.name}</Text>
            </View>
            <Image source={{ uri: item.imageURL }} style={styles.postImage} />
            <View style={styles.contentContainer}>
              <Text style={styles.postDate}>Publié le {item.date.toLocaleString()}</Text>
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postContent}>{item.content}</Text>
            </View>
            <View style={styles.actionsContainer}>
              {commentingPostId === item.id ? (
                <View style={styles.commentContainer}>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Enter your comment..."
                    value={comment}
                    onChangeText={setComment}
                  />
                  <TouchableOpacity onPress={() => handleCommentSubmit(item.id)} style={styles.commentButton}>
                  <Image
                      source={require('../assets/icones/envoyer.png')}
                      style={[styles.icon, {width: 24, height: 24}]}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity  onPress={() => handleCommentButtonPress(item.id)}>
                  <Image
                    source={require('../assets/icones/commenter.png')}
                    style={[styles.icon, {width: 24, height: 24, marginLeft:10}]}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => handleLikeButtonPress(item.id)}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={require('../assets/icones/liker.png')}
                    style={[styles.icon, { width: 24, height: 24, tintColor: likes[item.id] ? 'orange' : 'gray', marginLeft: 5 }]}
                  />
                  <Text style={{ color: 'orange' }}>{likes[item.id] || 0}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <Image
                  source={require('../assets/icones/partager.png')}
                  style={[styles.icon, {width: 24, height: 24}]}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleViewComments(item.id)} style={styles.actionButton}>
                <Text style={styles.actionViewComment}>{showComments ? 'Close comments' : 'View comments'}</Text>
              </TouchableOpacity>
            </View>
            {showComments && comments.length > 0 && (
              <View style={{backgroundColor: '#fff'}}>
                <Text style={styles.commentsHeading}>Comments :</Text>
                <FlatList
                  data={comments}
                  renderItem={({item}) => (
                    <View style={styles.commentItem}>
                      <Text style={styles.commentContent}>{item.content}</Text>
                      <Text style={styles.commentTimestamp}>{item.timestamp.toDate().toLocaleString("fr-FR")}</Text>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            )}
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
       <BottomBar handleRefresh={handleRefresh} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
    marginTop:25,
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 5,
    marginRight:10,
    marginLeft:20,
  },
  searchIcon: {
    color: 'orange',
    fontSize: 20,
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  backButton: {
    position: 'absolute',
    left: 16,
  },
  title: {
    fontSize: 25,
    color: 'green',
  },
  postContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
    borderRadius: 10,
  },
  contentContainer: {},
  postDate: {
    color: '#888',
    marginBottom: 5,
  },
  postTitle: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postContent: {
    color: '#000',
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    color:'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  commentButton: {
    padding: 8,
    backgroundColor: 'orange',
    borderRadius: 5,
  },
  icon: {
    width: 24,
    height: 24,
  },
  actionButton: {
    backgroundColor: 'orange',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  actionViewComment: {
    color: '#fff',
    fontWeight: 'bold',
  },
  commentsHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  commentItem: {
    marginBottom: 10,
  },
  commentContent: {
    color: 'green',
  },
  commentTimestamp: {
    color: '#888',
  },
});