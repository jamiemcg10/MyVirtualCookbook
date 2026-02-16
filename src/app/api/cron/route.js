import { NextResponse } from 'next/server'
import { getDB } from '../../lib/utils/firebase/firebaseAdmin'

export async function GET() {
  try {
    const db = await getDB()

    const anonUsersQuery = await db.collectionGroup('users').where('isDemo', '==', true).get()

    const docs = anonUsersQuery.docs

    console.log(`Deleting ${docs.length} doc(s)`)

    await Promise.all(
      docs.map((doc) => {
        db.collection('users').doc(doc.id).delete()
      })
    )

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ ok: false })
  }
}
