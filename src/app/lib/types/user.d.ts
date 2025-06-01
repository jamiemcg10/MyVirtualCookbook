import { AdditionalUserInfo, UserCredential } from 'firebase/auth'
import { ChapterWithRecipeNotes } from './chapter'

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

export interface Session {
  user: User | undefined
  cookbook: ChapterWithRecipeNotes[] | undefined
}
