import { collection, doc, setDoc } from "firebase/firestore"
import { db } from "./firebase"
import { User } from "@/app/lib/types/user"

const usersRef = collection(db, 'users')


export const users = (id:string) => {
  return {
    getRef: () => {
      return doc(db, `users/${id}`)
    },
    set: async (user: User) => {
      await setDoc(doc(usersRef, id), user)
    }
  }
}