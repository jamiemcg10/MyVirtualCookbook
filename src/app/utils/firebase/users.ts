import { collection, doc, setDoc } from "firebase/firestore"
import { db } from "./firebase"

const usersRef = collection(db, 'users')

interface User {
  id: string,
  username: string
  pictureUrl?: string
}

export const users = {
    set: async (id: string, user: User) => {
      await setDoc(doc(usersRef, id), user)
    }
  }