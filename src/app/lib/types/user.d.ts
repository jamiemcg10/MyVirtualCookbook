import { AdditionalUserInfo, UserCredential } from 'firebase/auth'

export interface User {
  id: string
  username: string
  pictureUrl?: string
  chapterOrder: string[]
}

export interface FirebaseUser extends UserCredential, Partial<AdditionalUserInfo> {
  profile?: {
    given_name: string
    picture: string
  }
}
