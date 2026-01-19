import { db } from '@/src/db'
import { users, questions, answers } from '@/src/db/schema'
import { count } from 'drizzle-orm'

async function verify() {
  const [userCount] = await db.select({ count: count() }).from(users)
  const [questionCount] = await db.select({ count: count() }).from(questions)
  const [answerCount] = await db.select({ count: count() }).from(answers)
  
  console.log('📊 Database Verification:')
  console.log(`   Users: ${userCount?.count ?? 0}`)
  console.log(`   Questions: ${questionCount?.count ?? 0}`)
  console.log(`   Answers: ${answerCount?.count ?? 0}`)
  
  // Show sample user
  const sampleUser = await db.query.users.findFirst()
  console.log('\n👤 Sample User:')
  console.log(`   Clerk ID: ${sampleUser?.clerkId}`)
  console.log(`   Bio: ${sampleUser?.bio}`)
  
  // Show sample question
  const sampleQuestion = await db.query.questions.findFirst({
    with: { answers: true }
  })
  console.log('\n❓ Sample Question:')
  console.log(`   Content: ${sampleQuestion?.content}`)
  console.log(`   Anonymous: ${sampleQuestion?.isAnonymous === 1 ? 'Yes' : 'No'}`)
  console.log(`   Answered: ${sampleQuestion?.answers.length ? 'Yes' : 'No'}`)
}

verify()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Error:', err)
    process.exit(1)
  })
