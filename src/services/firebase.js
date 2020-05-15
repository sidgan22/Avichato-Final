import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyCkl_LxuEK_LWlgxGgoQC4Kz4Q5qX6KlBY",
    authDomain: "aviatodj.firebaseapp.com",
    databaseURL: "https://aviatodj.firebaseio.com",
    projectId: "aviatodj",
    storageBucket: "aviatodj.appspot.com",
    messagingSenderId: "420662836074",
    appId: "1:420662836074:web:6668fec540858b69a18313",
    measurementId: "G-EZ2BCBR7JY"
  };
firebase.initializeApp(config);
export const auth = firebase.auth;
export const db = firebase.database();