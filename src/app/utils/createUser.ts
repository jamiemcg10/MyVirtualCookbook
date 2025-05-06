import { FirebaseUser } from '../lib/types'
import { users } from './firebase'

export const createUser = async (user: FirebaseUser) => {
  const id = user.user.uid

  if (user.providerId === 'google.com' && user.profile) {
    const displayName = user.profile.given_name
    const pictureUrl = user.profile.picture

    await users(id).set({
      id,
      username: displayName,
      pictureUrl,
      chapterOrder: []
    })
  } else if (user.user.email) {
    await users(id).set({
      id,
      username: user.user.email,
      chapterOrder: []
    })
  }
}
