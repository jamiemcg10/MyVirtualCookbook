'use server'

import * as admin from 'firebase-admin'

function getGoogleCredentials() {
  return {
    projectId: process.env.GOOGLE_PROJECT_ID || '',
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replaceAll('\\n', '\n') || '',
    clientEmail: process.env.GOOGLE_CLIENT_EMAIL || ''
  }
}

const firebaseApp = (
  admin.apps?.length
    ? admin.apps[0]
    : admin.initializeApp({
        credential: admin.credential.cert(getGoogleCredentials())
      })
) as admin.app.App

const db = admin.firestore(firebaseApp)

export async function getDB() {
  return db
}
