import { db } from '@/src/db'
import { questions, answers } from '@/src/db/schema'

const TARGET_USER_ID = 'user_38TOEPR0402TcBsQKJkOwTfZq8g'

async function seedQuestions() {
  console.log(`🌱 Seeding questions for user: ${TARGET_USER_ID}`)
  
  try {
    const sampleQuestions = [
      {
        recipientClerkId: TARGET_USER_ID,
        senderClerkId: null,
        content: '가장 좋아하는 음악 장르는 뭐예요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: TARGET_USER_ID,
        senderClerkId: null,
        content: '요즘 어떤 취미 생활 하고 있어요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: TARGET_USER_ID,
        senderClerkId: null,
        content: '가장 기억에 남는 여행지는 어디예요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: TARGET_USER_ID,
        senderClerkId: null,
        content: '커피 vs 차 중에 뭐 더 좋아해요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: TARGET_USER_ID,
        senderClerkId: null,
        content: '좋아하는 영화나 드라마 추천해주세요!',
        isAnonymous: 1,
      },
      {
        recipientClerkId: TARGET_USER_ID,
        senderClerkId: null,
        content: '주말에 주로 뭐 하면서 보내요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: TARGET_USER_ID,
        senderClerkId: null,
        content: '가장 최근에 배운 것 중에 재밌었던 거 있어요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: TARGET_USER_ID,
        senderClerkId: null,
        content: '스트레스 받을 때 어떻게 풀어요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: TARGET_USER_ID,
        senderClerkId: null,
        content: '인생 좌우명이 있다면?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: TARGET_USER_ID,
        senderClerkId: null,
        content: '가장 좋아하는 계절은 언제예요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: TARGET_USER_ID,
        senderClerkId: null,
        content: '밤형 인간이에요 아침형 인간이에요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: TARGET_USER_ID,
        senderClerkId: null,
        content: '요즘 관심 있는 분야가 있나요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: TARGET_USER_ID,
        senderClerkId: null,
        content: '10년 후 자신의 모습은 어떨 것 같아요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: TARGET_USER_ID,
        senderClerkId: null,
        content: '좋아하는 음식이 뭐예요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: TARGET_USER_ID,
        senderClerkId: null,
        content: '가장 최근에 읽은 책은 뭐예요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: TARGET_USER_ID,
        senderClerkId: null,
        content: '운동 좋아하세요? 어떤 운동 하세요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: TARGET_USER_ID,
        senderClerkId: null,
        content: '요즘 가장 하고 싶은 일이 뭐예요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: TARGET_USER_ID,
        senderClerkId: null,
        content: '친구들이 당신을 어떻게 묘사해요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: TARGET_USER_ID,
        senderClerkId: null,
        content: '가장 좋아하는 간식은?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: TARGET_USER_ID,
        senderClerkId: null,
        content: '하루 중 가장 좋아하는 시간대는 언제예요?',
        isAnonymous: 1,
      },
    ]
    
    const insertedQuestions = await db.insert(questions).values(sampleQuestions).returning()
    console.log(`✅ Created ${insertedQuestions.length} questions`)
    
    const answeredIndices = [0, 1, 3, 5, 7, 10, 13, 16]
    const answerContents = [
      '힙합이랑 R&B 진짜 좋아해요! 요즘은 국내 힙합 많이 듣는 편이에요 🎵',
      '요즘 사진 찍는 게 재밌어서 주말마다 카메라 들고 돌아다녀요 📷',
      '커피 중독자예요 ☕ 하루에 아메리카노 3잔은 기본...',
      '보통 늦잠 자고 일어나서 브런치 먹고 카페 가거나 산책해요!',
      '운동하거나 친구들 만나서 수다 떨면서 풀어요! 가끔 게임도 하고요',
      '완전 밤형 인간이에요! 밤에 집중력이 더 좋더라구요',
      '라면!!! 특히 신라면 블랙... 🍜',
      '여행 가고 싶어요 진짜... 제주도 한 달 살기 해보고 싶음',
    ]
    
    const sampleAnswers = answeredIndices.map((index, i) => {
      const question = insertedQuestions[index]
      if (!question) {
        throw new Error(`Question at index ${index} not found`)
      }
      return {
        questionId: question.id,
        content: answerContents[i] || '',
      }
    })
    
    await db.insert(answers).values(sampleAnswers)
    console.log(`✅ Created ${sampleAnswers.length} answers (${insertedQuestions.length - sampleAnswers.length} questions left unanswered)`)
    
    console.log('✨ Seeding complete!')
    console.log('📊 Summary:')
    console.log(`   - ${insertedQuestions.length} questions created`)
    console.log(`   - ${sampleAnswers.length} answered`)
    console.log(`   - ${insertedQuestions.length - sampleAnswers.length} unanswered`)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  }
}

seedQuestions()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
