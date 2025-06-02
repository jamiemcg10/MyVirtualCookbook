import { getApps, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

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
