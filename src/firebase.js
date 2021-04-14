import firebase from 'firebase'
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseApp = firebase.initializeApp(
    {
  apiKey: "AIzaSyAPS2l69ex9gWRscXds0zkB5xhaOj6tlSQ",
  authDomain: "instagram-clone-react-5d0f3.firebaseapp.com",
  projectId: "instagram-clone-react-5d0f3",
  storageBucket: "instagram-clone-react-5d0f3.appspot.com",
  messagingSenderId: "442760184487",
  appId: "1:442760184487:web:6abe09ed4c140f05d95182",
  measurementId: "G-J0QY8WBGNL"
}
)

 const db = firebaseApp.firestore();
 const auth = firebase.auth()
 const storage = firebase.storage()

 export { db, auth, storage }
