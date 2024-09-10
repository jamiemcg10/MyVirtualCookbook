// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from 'firebase/app'
// import { getAnalytics } from 'firebase/analytics'
import { collection, doc, getFirestore, setDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

export const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0]
export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
// getAnalytics(firebaseApp)

// file needs to be broken up
const usersRef = collection(db, 'users')

interface User {
  id: string,
  username: string
}

export const users = {
    set: async (id: string, user: User) => {
      await setDoc(doc(usersRef, id), user)
    }
  }