import { db } from '@/src/db'
import { users } from '@/src/db/schema'
import type { SocialLinks } from '@/src/db/schema'
import { eq } from 'drizzle-orm'

const TARGET_USER_ID = 'user_38TOEPR0402TcBsQKJkOwTfZq8g'

async function createUser() {
  console.log(`🔧 Creating user record for: ${TARGET_USER_ID}`)
  
  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.clerkId, TARGET_USER_ID),
    })
    
    if (existingUser) {
      console.log('ℹ️  User already exists, updating...')
      await db.update(users)
        .set({
          bio: '개발하고 음악 듣는 게 좋아요 🎵💻',
          socialLinks: {
            instagram: 'dev.music.life',
            github: 'goongoom-dev',
          } as SocialLinks,
          questionSecurityLevel: 'anyone',
        })
        .where(eq(users.clerkId, TARGET_USER_ID))
      console.log('✅ User updated')
    } else {
      await db.insert(users).values({
        clerkId: TARGET_USER_ID,
        bio: '개발하고 음악 듣는 게 좋아요 🎵💻',
        socialLinks: {
          instagram: 'dev.music.life',
          github: 'goongoom-dev',
        } as SocialLinks,
        questionSecurityLevel: 'anyone',
      })
      console.log('✅ User created')
    }
    
    console.log('✨ Complete!')
  } catch (error) {
    console.error('❌ Failed:', error)
    throw error
  }
}

createUser()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
