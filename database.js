const { initializeApp } = require("@firebase/app");
  require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId ,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
};

try {
  const app = initializeApp(firebaseConfig);
  console.log('Connected to Firebase Database')
} catch (error) {
  console.log('Failed to Connect: ', error);
}