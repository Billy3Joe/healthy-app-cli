import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// Configuration Firebase
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId:'YOUR_APP_ID',
};

// Initialisez Firebase avec la configuration
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Exportez l'instance initialisée de Firebase par défaut
export default firebase;
