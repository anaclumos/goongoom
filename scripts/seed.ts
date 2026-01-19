import { db } from '@/src/db'
import { users, questions, answers } from '@/src/db/schema'
import type { SocialLinks } from '@/src/db/schema'

async function seed() {
  console.log('🌱 Seeding database...')
  
  try {
    // Clear existing data (development only - idempotent)
    console.log('🗑️  Clearing existing data...')
    await db.delete(answers)
    await db.delete(questions)
    await db.delete(users)
    console.log('✅ Existing data cleared')
    
    // Sample Clerk user IDs (realistic format: user_xxxxxxxxxxxxxxxxxxxxx)
    const sampleClerkIds = [
      'user_2abc123def456ghi789jkl',
      'user_2mno456pqr789stu012vwx',
      'user_2yza789bcd012efg345hij',
      'user_2klm012nop345qrs678tuv',
      'user_2wxy345zab678cde901fgh',
      'user_2ijk678lmn901opq234rst',
      'user_2uvw901xyz234abc567def',
      'user_2ghi234jkl567mno890pqr',
    ] as const
    
    // Create sample users
    console.log('👥 Creating sample users...')
    const sampleUsers = [
      {
        clerkId: sampleClerkIds[0],
        bio: '음악 듣고 그림 그리는 걸 좋아해요 🎨🎵',
        socialLinks: {
          instagram: 'artlover_kim',
          twitter: 'kimartist',
        } as SocialLinks,
        questionSecurityLevel: 'anyone' as const,
      },
      {
        clerkId: sampleClerkIds[1],
        bio: '개발자 | 커피 중독자 ☕ | 고양이 집사 🐱',
        socialLinks: {
          github: 'devcat',
          twitter: 'dev_cat_meow',
        } as SocialLinks,
        questionSecurityLevel: 'anyone' as const,
      },
      {
        clerkId: sampleClerkIds[2],
        bio: '여행 좋아하는 대학생 ✈️ 맛집 탐방러 🍜',
        socialLinks: {
          instagram: 'travel_foodie',
        } as SocialLinks,
        questionSecurityLevel: 'anyone' as const,
      },
      {
        clerkId: sampleClerkIds[3],
        bio: '운동 좋아해요 💪 헬스 3년차',
        socialLinks: {
          instagram: 'fitness_junkie',
        } as SocialLinks,
        questionSecurityLevel: 'verified_anonymous' as const,
      },
      {
        clerkId: sampleClerkIds[4],
        bio: '책 읽고 글 쓰는 사람 📚✍️',
        socialLinks: {
          twitter: 'bookworm_writer',
        } as SocialLinks,
        questionSecurityLevel: 'anyone' as const,
      },
      {
        clerkId: sampleClerkIds[5],
        bio: null,
        socialLinks: null,
        questionSecurityLevel: 'anyone' as const,
      },
      {
        clerkId: sampleClerkIds[6],
        bio: '게임 좋아하는 직장인 🎮',
        socialLinks: null,
        questionSecurityLevel: 'anyone' as const,
      },
      {
        clerkId: sampleClerkIds[7],
        bio: '영화 보는 게 취미 🎬 넷플릭스 정주행러',
        socialLinks: {
          instagram: 'movie_marathon',
        } as SocialLinks,
        questionSecurityLevel: 'anyone' as const,
      },
    ]
    
    await db.insert(users).values(sampleUsers)
    console.log(`✅ Created ${sampleUsers.length} users`)
    
    // Create sample questions
    console.log('❓ Creating sample questions...')
    const sampleQuestions = [
      // Questions to user 0 (artlover)
      {
        recipientClerkId: sampleClerkIds[0],
        senderClerkId: null,
        content: '어떤 음악을 좋아하세요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: sampleClerkIds[0],
        senderClerkId: sampleClerkIds[1],
        content: '그림은 언제부터 그리기 시작했어요?',
        isAnonymous: 0,
      },
      {
        recipientClerkId: sampleClerkIds[0],
        senderClerkId: null,
        content: '가장 좋아하는 아티스트가 누구예요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: sampleClerkIds[0],
        senderClerkId: sampleClerkIds[2],
        content: '디지털 드로잉이랑 전통 드로잉 중에 뭐가 더 좋아요?',
        isAnonymous: 0,
      },
      
      // Questions to user 1 (developer)
      {
        recipientClerkId: sampleClerkIds[1],
        senderClerkId: null,
        content: '어떤 프로그래밍 언어를 주로 사용하세요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: sampleClerkIds[1],
        senderClerkId: sampleClerkIds[0],
        content: '고양이 이름이 뭐예요? 🐱',
        isAnonymous: 0,
      },
      {
        recipientClerkId: sampleClerkIds[1],
        senderClerkId: null,
        content: '개발자가 되고 싶은데 어떻게 시작하면 좋을까요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: sampleClerkIds[1],
        senderClerkId: sampleClerkIds[4],
        content: '하루에 커피 몇 잔 마셔요?',
        isAnonymous: 0,
      },
      
      // Questions to user 2 (traveler)
      {
        recipientClerkId: sampleClerkIds[2],
        senderClerkId: null,
        content: '가장 기억에 남는 여행지가 어디예요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: sampleClerkIds[2],
        senderClerkId: sampleClerkIds[3],
        content: '최근에 다녀온 맛집 추천해주세요!',
        isAnonymous: 0,
      },
      {
        recipientClerkId: sampleClerkIds[2],
        senderClerkId: null,
        content: '다음 여행지는 어디로 가고 싶어요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: sampleClerkIds[2],
        senderClerkId: sampleClerkIds[7],
        content: '여행 갈 때 꼭 챙기는 물건이 있어요?',
        isAnonymous: 0,
      },
      
      // Questions to user 3 (fitness)
      {
        recipientClerkId: sampleClerkIds[3],
        senderClerkId: null,
        content: '운동 초보자한테 추천하는 운동이 뭐예요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: sampleClerkIds[3],
        senderClerkId: sampleClerkIds[1],
        content: '헬스장 어디 다니세요?',
        isAnonymous: 0,
      },
      {
        recipientClerkId: sampleClerkIds[3],
        senderClerkId: null,
        content: '운동 루틴 공유해주실 수 있나요?',
        isAnonymous: 1,
      },
      
      // Questions to user 4 (bookworm)
      {
        recipientClerkId: sampleClerkIds[4],
        senderClerkId: null,
        content: '최근에 읽은 책 중에 재미있었던 거 있어요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: sampleClerkIds[4],
        senderClerkId: sampleClerkIds[2],
        content: '어떤 장르를 좋아하세요?',
        isAnonymous: 0,
      },
      {
        recipientClerkId: sampleClerkIds[4],
        senderClerkId: null,
        content: '글은 어디에 쓰세요? 블로그 있어요?',
        isAnonymous: 1,
      },
      
      // Questions to user 5 (basic profile)
      {
        recipientClerkId: sampleClerkIds[5],
        senderClerkId: null,
        content: '취미가 뭐예요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: sampleClerkIds[5],
        senderClerkId: sampleClerkIds[0],
        content: '주말에 뭐 하고 싶어요?',
        isAnonymous: 0,
      },
      
      // Questions to user 6 (gamer)
      {
        recipientClerkId: sampleClerkIds[6],
        senderClerkId: null,
        content: '요즘 어떤 게임 하세요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: sampleClerkIds[6],
        senderClerkId: sampleClerkIds[1],
        content: 'PC 게임이랑 콘솔 게임 중에 뭐가 더 좋아요?',
        isAnonymous: 0,
      },
      {
        recipientClerkId: sampleClerkIds[6],
        senderClerkId: null,
        content: '게임 추천해주세요!',
        isAnonymous: 1,
      },
      
      // Questions to user 7 (movie lover)
      {
        recipientClerkId: sampleClerkIds[7],
        senderClerkId: null,
        content: '최근에 본 영화 중 재미있었던 거 있어요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: sampleClerkIds[7],
        senderClerkId: sampleClerkIds[4],
        content: '넷플릭스 추천작 있어요?',
        isAnonymous: 0,
      },
      {
        recipientClerkId: sampleClerkIds[7],
        senderClerkId: null,
        content: '가장 좋아하는 영화 감독이 누구예요?',
        isAnonymous: 1,
      },
      
      // Additional variety questions
      {
        recipientClerkId: sampleClerkIds[0],
        senderClerkId: null,
        content: '가장 좋아하는 음식이 뭐예요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: sampleClerkIds[1],
        senderClerkId: null,
        content: '스트레스 받을 때 어떻게 푸세요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: sampleClerkIds[2],
        senderClerkId: null,
        content: '혼자 여행이랑 같이 여행 중에 뭐가 더 좋아요?',
        isAnonymous: 1,
      },
      {
        recipientClerkId: sampleClerkIds[3],
        senderClerkId: null,
        content: '운동 말고 다른 취미도 있어요?',
        isAnonymous: 1,
      },
    ]
    
    const insertedQuestions = await db.insert(questions).values(sampleQuestions).returning()
    console.log(`✅ Created ${insertedQuestions.length} questions`)
    
    const getQuestionId = (index: number): number => {
      const question = insertedQuestions[index]
      if (!question) {
        throw new Error(`Question at index ${index} not found`)
      }
      return question.id
    }
    
    // Create sample answers (some questions answered, some unanswered)
    console.log('💬 Creating sample answers...')
    const sampleAnswers = [
      // Answers from user 0 (artlover)
      {
        questionId: getQuestionId(0),
        content: '힙합이랑 알앤비 좋아해요! 최근에 DPR Live 많이 들어요 ㅎㅎ',
      },
      {
        questionId: getQuestionId(1),
        content: '중학교 때부터요! 처음엔 낙서로 시작했는데 점점 재미있어져서 계속하게 됐어요 🎨',
      },
      {
        questionId: getQuestionId(2),
        content: '음악은 DPR Live, 그림은 김정기 작가님 정말 좋아해요!',
      },
      {
        questionId: getQuestionId(26),
        content: '떡볶이!!! 진짜 못참아요 🌶️',
      },
      
      // Answers from user 1 (developer)
      {
        questionId: getQuestionId(4),
        content: 'TypeScript랑 Python 주로 써요! 요즘은 Next.js로 웹 개발 많이 하고 있어요',
      },
      {
        questionId: getQuestionId(5),
        content: '나비예요 🦋 너무 귀여워요 ㅠㅠ',
      },
      {
        questionId: getQuestionId(6),
        content: '일단 HTML/CSS/JavaScript 기초부터 탄탄히 하시고, 작은 프로젝트 만들어보면서 배우는 게 제일 좋아요! 유튜브 강의도 많으니까 활용하세요 💪',
      },
      {
        questionId: getQuestionId(27),
        content: '코딩하거나 고양이랑 놀아요 ㅋㅋ 산책도 가끔 해요!',
      },
      
      // Answers from user 2 (traveler)
      {
        questionId: getQuestionId(8),
        content: '제주도요! 바다 보면서 힐링했던 게 너무 좋았어요 🌊',
      },
      {
        questionId: getQuestionId(9),
        content: '홍대에 있는 "맛있는 파스타집" 진짜 맛있어요! 크림 파스타 강추 🍝',
      },
      {
        questionId: getQuestionId(10),
        content: '일본 오사카 가보고 싶어요! 음식도 맛있다고 하고 볼 것도 많대요',
      },
      {
        questionId: getQuestionId(28),
        content: '혼자 여행이 더 자유로워서 좋아요! 가고 싶은 곳 마음대로 갈 수 있잖아요 ✈️',
      },
      
      // Answers from user 3 (fitness)
      {
        questionId: getQuestionId(12),
        content: '스쿼트랑 플랭크 추천해요! 집에서도 할 수 있고 효과 좋아요 💪',
      },
      {
        questionId: getQuestionId(13),
        content: '강남에 있는 헬스장 다녀요! 시설 좋고 사람들도 친절해요',
      },
      
      // Answers from user 4 (bookworm)
      {
        questionId: getQuestionId(15),
        content: '"달러구트 꿈 백화점" 읽었는데 너무 따뜻하고 좋았어요 📚',
      },
      {
        questionId: getQuestionId(16),
        content: '판타지랑 SF 좋아해요! 가끔 에세이도 읽어요',
      },
      
      // Answers from user 5 (basic profile)
      {
        questionId: getQuestionId(18),
        content: '음악 듣고 산책하는 거 좋아해요!',
      },
      
      // Answers from user 6 (gamer)
      {
        questionId: getQuestionId(20),
        content: '발로란트랑 리그오브레전드 하고 있어요! 롤은 골드 티어예요 ㅎㅎ',
      },
      {
        questionId: getQuestionId(21),
        content: 'PC 게임이 더 익숙해서 PC 게임 더 좋아해요! 마우스 조작이 편해요',
      },
      
      // Answers from user 7 (movie lover)
      {
        questionId: getQuestionId(23),
        content: '"오펜하이머" 봤는데 진짜 대박이었어요! 영상미 미쳤어요 🎬',
      },
      {
        questionId: getQuestionId(24),
        content: '"더 글로리" 추천해요! 스토리 탄탄하고 배우들 연기 진짜 좋아요',
      },
    ]
    
    await db.insert(answers).values(sampleAnswers)
    console.log(`✅ Created ${sampleAnswers.length} answers`)
    
    // Summary
    console.log('\n📊 Seeding Summary:')
    console.log(`   👥 Users: ${sampleUsers.length}`)
    console.log(`   ❓ Questions: ${insertedQuestions.length}`)
    console.log(`   💬 Answers: ${sampleAnswers.length}`)
    console.log(`   📝 Unanswered Questions: ${insertedQuestions.length - sampleAnswers.length}`)
    console.log('\n✅ Seeding complete!')
    
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  }
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Fatal error:', err)
    process.exit(1)
  })
