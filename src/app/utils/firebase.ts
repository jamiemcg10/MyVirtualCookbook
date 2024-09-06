// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import 'dotenv/config'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

console.log(process.env, process.env.REACT_APP_FIREBASE_PROJECT_ID, process)

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: 'AIzaSyDU2W7bspCNvDsWON17mPjggl2GGE0gBsA',
  authDomain: 'my-virtual-cookbook.firebaseapp.com',
  projectId: 'my-virtual-cookbook',
  storageBucket: 'my-virtual-cookbook.appspot.com',
  messagingSenderId: '248888218454',
  appId: '1:248888218454:web:f5def7e35ab33bc70abcf7',
  measurementId: 'G-TCJRM94DGC'
}

// Initialize Firebase
// export const app = initializeApp(firebaseConfig)
export const initializeFirebase = () => {
  const app = initializeApp(firebaseConfig)
  // getAnalytics(app)
}
