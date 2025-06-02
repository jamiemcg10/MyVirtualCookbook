'use server'

import * as admin from 'firebase-admin'

function getGCPCredentials() {
  return {
    projectId: process.env.GCP_PROJECT_ID || '',
    private_key: process.env.GCP_PRIVATE_KEY?.replaceAll('\\n', '\n') || '',
    clientEmail: process.env.GCP_SERVICE_ACCOUNT_EMAIL || ''
  }
}

const firebaseApp = (
  admin.apps?.length
    ? admin.apps[0]
    : admin.initializeApp({
        credential: admin.credential.cert(getGCPCredentials())
      })
) as admin.app.App

const db = admin.firestore(firebaseApp)

export async function getDB() {
  return db
}
