const { initializeApp } = require("@firebase/app"),
  { getDatabase, set, ref, onValue } = require("@firebase/database");


const firebaseConfig = {
  apiKey: process.env.apiKey || 'AIzaSyAOWHS8P8hEH06RZ1_MDT53pk2j4WyW5Fo',
  authDomain: process.env.authDomain || 'banco-geral-412b6.firebaseapp.com',
  projectId: process.env.projectId || 'banco-geral-412b6',
  storageBucket: process.env.storageBucket || 'banco-geral-412b6.appspot.com',
  messagingSenderId: process.env.messagingSenderId || '396650962585',
  appId: process.env.appId || '1:396650962585:web:0b0922aa3a7820eece2208',
  measurementId: process.env.measurementId || 'G-4R2PG7XCPM'
};

try {
  const app = initializeApp(firebaseConfig);
  console.log('Connected to Firebase Database')
} catch (error) {
  console.log('Failed to Connect: ', error);
}


/*
=== FOR DB ADJUSTMENT === 
const db = getDatabase();
const dataWebSite = ref(db);
onValue(dataWebSite, (snapshot) => {
const array = [{q:"Teste", r:"aa"}]
  set(ref(db, "dataWebSite/faq"), array).then(() => {
    console.log("Adjusted");
  });
});
=========================
*/