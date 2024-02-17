/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet, TextInput, ScrollView, RefreshControl, TouchableOpacity} from 'react-native';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
// Importez AsyncStorage depuis '@react-native-async-storage/async-storage'
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/auth';
import BottomBar from '../components/BottomBar';
import HeaderBar from '../components/HeaderBar';

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

const db = firebase.firestore();

export default function Home()  {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([])

  useEffect(() => {
    //Récupérer les likes depuis AsyncStorage lors du chargement de la page
    retrieveLikesFromStorage();
    //fetchPosts() pour récupérer les publications depuis Firebase
    fetchPosts();
  }, []);
  const fetchPosts = async () => {
    try {
      const snapshot = await firebase.firestore().collection('posts').get();
      const fetchedPosts = [];
      for (const doc of snapshot.docs) {
        const postData = doc.data();
        const date = postData.date.toDate();
        const userSnapshot = await firebase.firestore().collection('users').doc(postData.user).get();
        if (userSnapshot.exists) {
          const userData = userSnapshot.data();
          if (userData && userData.Profile_Image) {
            const post = {
              id: doc.id,
              ...postData,
              date: date.toLocaleDateString(), // Formatage de la date en chaîne de caractères
              user: {
                Name: userData.Name,
                profileImage: userData.Profile_Image,
              },
            };
            fetchedPosts.push(post);
          } else {
            console.error('Données utilisateur ou champ Profile_Image introuvables pour le post', doc.id);
          }
        } else {
          console.error('Données utilisateur introuvables pour le post', doc.id);
        }
      }
        setPosts(fetchedPosts);

    } catch (error) {
      console.error('Erreur lors de la récupération des posts :', error);
    }
  };


  const handleSearchPress = async () => {
    try {
      const searchQuery = searchText.trim().toLowerCase();
      if (searchQuery === '') {
        fetchPosts();
        setSearchResults([]);
        setSearchError(null);
      } else {
        const querySnapshot = await firebase
          .firestore()
          .collection('posts')
          .where('title', '>=', searchQuery)
          .where('title', '<=', searchQuery + '\uf8ff')
          .get();
        const results = [];
        querySnapshot.forEach((doc) => {
          results.push(doc.data());
        });
        if (results.length === 0) {
          setSearchResults([]);
          setSearchError('Recette indisponible pour le moment.');
        } else {
          setSearchResults(results);
          setSearchError(null);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la recherche dans Firebase :', error);
      setSearchError('Erreur lors de la recherche.');
    }
  };
// Dans la fonction handleViewComments
const handleViewComments = async (postId) => {
  try {
    const postRef = firebase.firestore().collection('posts').doc(postId);
    const postDoc = await postRef.get();

    if (postDoc.exists) {
      const post = postDoc.data();
      const postComments = post.comments || [];
      console.log('Comments for post:', postComments); 
      setComments(postComments); // Mettre à jour les commentaires dans l'état
      setShowComments(prevState => !prevState); // Inverser l'état actuel de showComments
    } else {
      console.error('Post not found:', postId);
    }
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
};

  const handleCommentPress = (postId) => {
    setCommentInputs((prevInputs) => ({
      ...prevInputs,
      [postId]: !prevInputs[postId], // Inverser l'état actuel
    }));
  };
  // Dans la fonction handleCommentChange
const handleCommentChange = (postId, text) => {
  setPosts((prevPosts) =>
    prevPosts.map((post) => {
      if (post.id === postId) {
        return { ...post, comment: text };
      }
      return post;
    })
  );
};
const handleLikePress = async (postId) => {
  try {
    // Récupérer les likes depuis AsyncStorage
    let savedLikes = await AsyncStorage.getItem('likes');
    // Convertir les likes en un objet JavaScript
    savedLikes = savedLikes ? JSON.parse(savedLikes) : [];

    // Mettre à jour les likes dans l'état
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const updatedLikes = post.isLiked ? post.likes - 1 : post.likes + 1;
          const updatedPost = { ...post, likes: updatedLikes, isLiked: !post.isLiked };

          // Mettre à jour les likes dans les données récupérées depuis AsyncStorage
          const updatedSavedLikes = savedLikes.map((savedPost) => {
            if (savedPost.id === postId) {
              return updatedPost;
            }
            return savedPost;
          });

          // Enregistrer les likes mis à jour dans AsyncStorage
          AsyncStorage.setItem('likes', JSON.stringify(updatedSavedLikes));

          return updatedPost;
        }
        return post;
      })
    );
  } catch (error) {
    console.error('Error updating likes:', error);
  }
};

// Fonction pour enregistrer le nombre de likes dans AsyncStorage
const saveLikesToStorage = async (likesData) => {
  try {
    // Enregistrez le nombre de likes dans AsyncStorage
    await AsyncStorage.setItem('likes', JSON.stringify(likesData));
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du nombre de likes dans AsyncStorage:", error);
  }
};

// Fonction pour récupérer le nombre de likes depuis AsyncStorage
// Fonction pour récupérer le nombre de likes depuis AsyncStorage
const retrieveLikesFromStorage = async () => {
  try {
    // Récupérez le nombre de likes depuis AsyncStorage
    const savedLikes = await AsyncStorage.getItem('likes');
    if (savedLikes !== null) {
      // Convertissez le nombre de likes récupéré en objet JavaScript
      const parsedLikes = JSON.parse(savedLikes);
      // Mettez à jour les likes dans l'état des publications
      setPosts(parsedLikes);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du nombre de likes depuis AsyncStorage:", error);
  }
};

// Utilisez useEffect pour récupérer le nombre de likes depuis AsyncStorage lors du chargement de la page
useEffect(() => {
  retrieveLikesFromStorage();
}, []);



  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBar namePage="Home"/>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher..."
          onChangeText={(text) => setSearchText(text)}
          value={searchText}
        />
        <TouchableOpacity onPress={handleSearchPress}>
          <Text style={styles.searchIcon}>Search</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.errorContainer}>
        {searchError && (
          <Text style={styles.errorText}>{searchError}</Text>
        )}
      </View>

      <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
        {posts.length === 0 ? (
          <View style={styles.RecipeContainer}>
            <Text style={styles.RecipeText}>Soyez le premier/ la première à partager votre recette saine.</Text>
            <Image source={require('../assets/logo.png')}/>
            <Text style={styles.RecipeText}>Merci pour votre confiance.</Text>
          </View>
        ) : (
          posts.map((post) => (
            <View style={styles.card} key={post.id}>
              <View style={styles.userContainer}>
                <Image source={{ uri: post.user.profileImage }} style={styles.imageProfile} />
                <Text style={styles.userName}>{post.user.Name}</Text>
              </View>
              <Image source={{ uri: post.imageURL }} style={styles.image} />
              <View style={styles.content}>
                <Text style={styles.date}>Publié le {post.date}</Text>
                <Text style={styles.title}>{post.title}</Text>
                <Text style={styles.description}>{post.content}</Text>
                <View style={styles.iconsContainer}>
                  <TouchableOpacity onPress={() => handleCommentPress(post.id)}>
                    <Image
                      source={require('../assets/commenter.png')}
                      style={[styles.icon, { width: 24, height: 24 }]}
                    />
                  </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleLikePress(post.id)}>
                      <Image
                        source={post.isLiked ? require('../assets/likerRouge.png') : require('../assets/liker.png')}
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                    <Text style={styles.likes}>{post.likes}</Text>
                   <TouchableOpacity>
                    <Image
                      source={require('../assets/partager.png')}
                      style={[styles.icon, { width: 24, height: 24 }]}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleViewComments(post.id)} style={styles.actionButton}>
                    <Text style={styles.viewComments}>View comment</Text>
                  </TouchableOpacity>

                  {showComments && comments.length > 0 && (
                    <View>
                      <Text style={styles.commentsHeading}>Comments :</Text>
                      {comments.map((comment, index) => (
                        <View key={index} style={styles.commentItem}>
                          <Text style={styles.commentContent}>{comment.text}</Text>
                          <Text style={styles.commentTimestamp}>{comment.date}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
                {commentInputs[post.id] && (
                  <View style={styles.commentContainer}>
                    <TextInput
                      style={styles.commentInput}
                      placeholder='Ajouter un commentaire...'
                      value={post.comment}
                      onChangeText={(text) => handleCommentChange(post.id, text)}
                    />
                    <TouchableOpacity onPress={() => handleCommentSubmit(post.id)}>
                      <Image
                      source={require('../assets/envoyer.png')}
                      style={[styles.icon, {width: 24, height: 24}]}
                    />
                      {/* <Text style={styles.sendIcon}>Envoyer</Text> */}
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <BottomBar namePage="Home"/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 5,
    marginRight: 10,
    paddingLeft: 10,
  },
  searchIcon: {
    color: 'orange',
    fontSize: 20,
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
  },
  RecipeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  RecipeText: {
    fontSize: 24,
    color: 'green',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    elevation: 2,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: '100%',
    height: 400,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 8,
  },
  imageProfile: {
    width: '15%',
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
    overflow: 'hidden',
  },
  userName: {
    color:'#000',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginLeft:10,
  },
  content: {
    padding: 16,
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  title: {
    color:'#000',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#444',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
  likes: {
    fontSize: 16,
    color: 'gray',
    marginTop: 4,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  commentInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
  },
  viewComments: {
    color:'green',
    fontSize: 16,
    marginLeft: 8,
  },
  sendIcon: {
    color:'#000',
    marginLeft: 8,
  },
});
