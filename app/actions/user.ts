import { cookies } from 'next/headers'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getOrCreateUser() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('user_id')

  if (!userId) {
    throw new Error('No user ID found in cookies')
  }

  // Try to find existing user
  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, userId.value),
  })

  if (existingUser) {
    // Update last seen
    await db
      .update(users)
      .set({ lastSeen: new Date() })
      .where(eq(users.id, userId.value))
    return existingUser
  }

  // Create new user
  const newUser = await db.insert(users).values({
    id: userId.value,
    createdAt: new Date(),
    lastSeen: new Date(),
  }).returning()

  return newUser[0]
} 