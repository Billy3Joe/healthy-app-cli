import React, {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet, FlatList, TouchableOpacity, TextInput} from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import BottomBar from '../components/BottomBar';
import HeaderBar from '../components/HeaderBar';
// import {format} from 'date-fns';

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

const Home = () => {
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
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleCommentButtonPress = (postId) => {
    setCommentingPostId(postId);
  };

  const handleCommentSubmit = async (postId) => {
    try {
      // Vérifier si le champ de commentaire n'est pas vide
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
    <View style={styles.container}>
      <HeaderBar namePage="Home"/>
      {/* <Text style={styles.heading}>Recèttes Saines</Text> */}
      <FlatList
        data={posts}
        renderItem={({item}) => (
          <View style={styles.postContainer} style={[{backgroundColor: 'green',   borderRadius: 5}]}>
            <View style={styles.userInfo}>
              <Image source={{uri: item.user.profileImage}} style={styles.userImage} />
              <Text style={styles.userName}>{item.user.name}</Text>
            </View>
            <Image source={{uri: item.imageURL}} style={styles.postImage} />
            <View style={styles.contentContainer}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postContent}>{item.content}</Text>
              <Text style={styles.postDate}>{item.date.toLocaleString()}</Text>
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
                    <Text style={styles.commentButtonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={() => handleCommentButtonPress(item.id)} style={styles.actionButton}>
                  <Text style={styles.actionWriteComment}>Write Comments</Text>
                </TouchableOpacity>
              )}
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
                      {/* <Text style={styles.commentUserName}>{item.Name}</Text> */}
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
        <BottomBar namePage="Home"/>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 10,
    backgroundColor: '#fff', // Fond de la page en vert
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  postContainer: {
    marginBottom: 20,
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
    marginLeft: 10,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  postTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 10,
  },
  postContent: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
  },
  postDate: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 10,
    // color: '#888',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    backgroundColor: 'orange',
    borderRadius: 5,
  },
  actionWriteComment: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  actionViewComment: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  commentButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'orange',
    borderRadius: 5,
  },
  commentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  commentsHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 10,
  },
  commentItem: {
    marginBottom: 10,
    marginLeft: 10,
  },
  commentUserName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentContent: {
    marginBottom: 5,
    color: 'green',
  },
  commentTimestamp: {
    color: '#888',
  },
});
export default Home;
