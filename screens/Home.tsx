import React, {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const snapshot = await firebase.firestore().collection('posts').get();
        const fetchedPosts = [];
        for (const doc of snapshot.docs) {
          const postData = doc.data();
          const date = postData.date ? postData.date.toDate() : null; // Vérifier si postData.date est défini
          const userSnapshot = await firebase.firestore().collection('users').doc(postData.user).get();
          if (userSnapshot.exists) {
            const userData = userSnapshot.data();
            if (userData && userData.Profile_Image) {
              const post = {
                id: doc.id,
                ...postData,
                date, // Utiliser la valeur de date définie ou null
                user: {
                  name: userData.Name,
                  profileImage: userData.Profile_Image,
                },
              };
              fetchedPosts.push(post);
            } else {
              console.error('User data or Profile_Image field not found for post', doc.id);
            }
          } else {
            console.error('User data not found for post', doc.id);
          }
        }
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);  

  const handleRefresh = async () => {
    setRefreshing(true); // Activer l'indicateur de chargement

    try {
      // Réalisez ici votre logique d'actualisation
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
              date,
              user: {
                name: userData.Name,
                profileImage: userData.Profile_Image,
              },
            };
            fetchedPosts.push(post);
          } else {
            console.error('User data or Profile_Image field not found for post', doc.id);
          }
        } else {
          console.error('User data not found for post', doc.id);
        }
      }
      setPosts(fetchedPosts);

      // Désactiver l'indicateur de chargement une fois l'actualisation terminée
      setRefreshing(false);
    } catch (error) {
      console.error('Erreur lors de l\'actualisation :', error);
      setRefreshing(false); // Assurez-vous de désactiver l'indicateur de chargement en cas d'erreur
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

  const handleCommentButtonPress = (postId) => {
    setCommentingPostId(postId);
  };

  const handleCommentSubmit = async (postId) => {
    try {
      if (!comment.trim()) {
        alert('Veuillez entrer un commentaire avant de soumettre.');
        return;
      }
      await db.collection('comments').add({
        postId,
        content: comment,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setComment('');
      setCommentingPostId('');
      fetchComments(postId);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleViewComments = async (postId) => {
    fetchComments(postId);
    setShowComments(!showComments);
  };

  const fetchComments = async (postId) => {
    try {
      const snapshot = await db.collection('comments').where('postId', '==', postId).get();
      const fetchedComments = [];

      snapshot.forEach((doc) => {
        fetchedComments.push(doc.data());
      });

      setComments(fetchedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
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
          <Text style={styles.errorText}>{searchError}</Text>
          )}
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
              <TouchableOpacity>
                <Image
                  source={require('../assets/icones/liker.png')}
                  style={[styles.icon, {width: 24, height: 24}]}
                />
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
