const prisma = require('../prisma');

/**
 * Ensures there are default questions in the database for a few subjects.
 */
const seedQuestionsIfNeeded = async () => {
  const count = await prisma.vivaQuestion.count();
  if (count > 0) return;

  const defaultQuestions = [
    // JavaScript
    {
      subject: "JavaScript",
      questionText: "What are the differences between var, let, and const in JavaScript?",
      expectedAnswer: "var is function-scoped and hoisted. let and const are block-scoped, hoisted but in temporal dead zone, and const cannot be reassigned.",
      keywords: "scope, hoist, block, reassign, var, let, const",
      difficulty: "EASY"
    },
    {
      subject: "JavaScript",
      questionText: "Explain the concept of closures in JavaScript and provide a common use case.",
      expectedAnswer: "A closure is a function that remembers its outer variables even after the outer function has returned. Common use cases include data privacy (encapsulation) or maintaining state in callbacks.",
      keywords: "lexical, scope, outer, function, preserve, private, variable, state, closure",
      difficulty: "MEDIUM"
    },
    {
      subject: "JavaScript",
      questionText: "How does the JavaScript Event Loop work?",
      expectedAnswer: "JavaScript is single-threaded. The event loop handles asynchronous callbacks by pushing them to the callback queue (or microtask queue) and running them when the call stack is empty.",
      keywords: "single-threaded, stack, queue, microtask, macrotask, callback, asynchronous, blocking, event loop",
      difficulty: "HARD"
    },
    // Python
    {
      subject: "Python",
      questionText: "What is the difference between list and tuple in Python?",
      expectedAnswer: "Lists are mutable, meaning they can be changed after creation. Tuples are immutable, meaning they cannot be changed. Lists use brackets [], tuples use parentheses ().",
      keywords: "mutable, immutable, bracket, parentheses, change, memory, performance, list, tuple",
      difficulty: "EASY"
    },
    {
      subject: "Python",
      questionText: "What are decorators in Python and how do you use them?",
      expectedAnswer: "A decorator is a function that takes another function as an argument, extends its behavior without modifying it, and returns the modified function. They are prefixed with @.",
      keywords: "wrapper, modify, function, argument, syntax, prefix, @, metadata, decorator",
      difficulty: "MEDIUM"
    },
    // DBMS
    {
      subject: "DBMS",
      questionText: "Explain the ACID properties in database management systems.",
      expectedAnswer: "ACID stands for Atomicity (all or nothing), Consistency (preserves database rules), Isolation (transactions don't interfere), and Durability (transactions persist after system failure).",
      keywords: "atomicity, consistency, isolation, durability, transaction, rollback, commit, persist, acid",
      difficulty: "MEDIUM"
    },
    // Computer Networks
    {
      subject: "Computer Networks",
      questionText: "What is the difference between TCP and UDP protocols?",
      expectedAnswer: "TCP is connection-oriented, reliable, guarantees packet ordering, and uses congestion control. UDP is connectionless, fast, unreliable, and has low overhead.",
      keywords: "connection, reliable, order, speed, congestion, overhead, handshake, tcp, udp",
      difficulty: "EASY"
    }
  ];

  await prisma.vivaQuestion.createMany({ data: defaultQuestions });
  console.log("Seeded Viva Questions.");
};

/**
 * Evaluates the answer based on keywords matching.
 */
const evaluateAnswer = (question, answerText) => {
  if (!answerText || answerText.trim() === "") {
    return {
      score: 0,
      feedback: "No answer provided. Please try to answer the question to receive feedback."
    };
  }

  const normalizedAnswer = answerText.toLowerCase();
  const keywords = question.keywords.split(',').map(kw => kw.trim().toLowerCase());
  const matchedKeywords = keywords.filter(kw => normalizedAnswer.includes(kw));
  const missingKeywords = keywords.filter(kw => !normalizedAnswer.includes(kw));

  let matchRatio = keywords.length > 0 ? matchedKeywords.length / keywords.length : 0;
  let score = Math.round(matchRatio * 10);
  if (score === 0 && answerText.trim().length > 10) score = 2;

  let feedback = "";
  if (score >= 8) {
    feedback = `Excellent answer! You correctly mentioned key concepts such as ${matchedKeywords.join(', ')}. Your understanding of the topic is very strong.`;
  } else if (score >= 5) {
    feedback = `Good job! You mentioned important terms like ${matchedKeywords.join(', ')}. To improve, you could expand on concepts like ${missingKeywords.slice(0, 3).join(', ')}.`;
  } else if (score >= 2) {
    feedback = `Partial answer. You touched upon ${matchedKeywords.length > 0 ? matchedKeywords.join(', ') : 'some aspects'}, but missed core elements. Try explaining more about ${missingKeywords.join(', ')}.`;
  } else {
    feedback = `Your answer did not match key concepts for this topic. Be sure to study and mention terms like ${keywords.slice(0, 4).join(', ')} next time.`;
  }

  return { score, feedback };
};

/**
 * Starts a new Viva Session.
 * DB columns: id, userId, subject, status, score, feedback, createdAt, updatedAt
 */
const startVivaSession = async (userId, subject) => {
  await seedQuestionsIfNeeded();

  const totalQuestions = await prisma.vivaQuestion.count({ where: { subject } });
  if (totalQuestions === 0) {
    throw new Error(`No questions available for subject: ${subject}`);
  }

  // Create session using only columns that exist in DB
  const session = await prisma.vivaSession.create({
    data: {
      userId,
      subject,
      status: "IN_PROGRESS"
    }
  });

  const firstQuestion = await prisma.vivaQuestion.findFirst({ where: { subject } });

  return {
    sessionId: session.id,
    nextQuestion: {
      id: firstQuestion.id,
      questionText: firstQuestion.questionText
    },
    progress: { current: 1, total: totalQuestions },
    isCompleted: false
  };
};

/**
 * Submits an answer for the active session, evaluates it, and gets next question.
 * DB VivaAnswer columns: id, sessionId, questionId (required), answerText, score, feedback, createdAt
 */
const submitAnswer = async (userId, sessionId, questionText, studentAnswer) => {
  const session = await prisma.vivaSession.findUnique({
    where: { id: sessionId },
    include: { vivaAnswers: true }
  });

  if (!session) throw new Error("Session not found");
  if (session.userId !== userId) throw new Error("Unauthorized access to session");
  if (session.status === "COMPLETED" || session.status === "ABORTED") throw new Error("Session already finished");

  // Find question by text to get its ID (required by DB)
  const question = await prisma.vivaQuestion.findFirst({ where: { questionText } });
  if (!question) throw new Error("Question not found");

  const existingAnswer = session.vivaAnswers.find(a => a.questionId === question.id);
  if (existingAnswer) throw new Error("Question already answered");

  const evaluation = evaluateAnswer(question, studentAnswer);

  // Save answer using actual DB column names (answerText, not studentAnswer)
  await prisma.vivaAnswer.create({
    data: {
      sessionId,
      questionId: question.id,
      answerText: studentAnswer,   // DB column is answerText
      score: evaluation.score,
      feedback: evaluation.feedback
    }
  });

  const allAnswers = await prisma.vivaAnswer.findMany({ where: { sessionId } });
  const answeredIds = allAnswers.map(a => a.questionId);

  const nextQuestion = await prisma.vivaQuestion.findFirst({
    where: {
      subject: session.subject,
      id: { notIn: answeredIds }
    }
  });

  const totalQCount = await prisma.vivaQuestion.count({ where: { subject: session.subject } });

  return {
    answer: { score: evaluation.score, feedback: evaluation.feedback },
    nextQuestion: nextQuestion
      ? { id: nextQuestion.id, questionText: nextQuestion.questionText }
      : null,
    progress: { current: allAnswers.length + (nextQuestion ? 1 : 0), total: totalQCount },
    isCompleted: !nextQuestion
  };
};

/**
 * Complete a session and calculate final score.
 * DB VivaSession columns for update: status, score, feedback (no totalScore/completedAt)
 */
const completeSession = async (userId, sessionId) => {
  const session = await prisma.vivaSession.findUnique({
    where: { id: sessionId },
    include: { vivaAnswers: true }
  });

  if (!session) throw new Error("Session not found");
  if (session.userId !== userId) throw new Error("Unauthorized");
  if (session.status === "COMPLETED") return normalizeSession(session);

  const totalQCount = await prisma.vivaQuestion.count({ where: { subject: session.subject } });
  const rawScore = session.vivaAnswers.reduce((sum, a) => sum + a.score, 0);
  const maxScore = totalQCount * 10;
  const finalScorePercentage = maxScore > 0 ? Math.round((rawScore / maxScore) * 100) : 0;

  let overallFeedback = "";
  if (finalScorePercentage >= 80) overallFeedback = "Outstanding performance! You have a deep understanding of this subject.";
  else if (finalScorePercentage >= 50) overallFeedback = "Good effort! You know the basics but could brush up on a few details.";
  else overallFeedback = "You might need to review this subject again. Focus on the core concepts.";

  // Update using only actual DB columns (score not totalScore, no completedAt/startedAt)
  const updatedSession = await prisma.vivaSession.update({
    where: { id: sessionId },
    data: {
      status: "COMPLETED",
      score: finalScorePercentage,
      feedback: overallFeedback
    }
  });

  return normalizeSession(updatedSession);
};

/**
 * Retrieves details of a single session with answers.
 * Normalizes DB field names to what the frontend expects.
 */
const getSessionDetails = async (userId, sessionId) => {
  const session = await prisma.vivaSession.findUnique({
    where: { id: sessionId },
    include: { vivaAnswers: { include: { question: true } } }
  });

  if (!session) throw new Error("Session not found");
  if (session.userId !== userId) throw new Error("Unauthorized");

  return normalizeSession(session);
};

/**
 * Retrieves history of all sessions for user.
 */
const getUserSessions = async (userId) => {
  const sessions = await prisma.vivaSession.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  return sessions.map(normalizeSession);
};

/**
 * Expose available subjects
 */
const getSubjects = async () => {
  await seedQuestionsIfNeeded();
  const questions = await prisma.vivaQuestion.findMany({
    select: { subject: true },
    distinct: ['subject']
  });
  return questions.map(q => q.subject);
};

/**
 * Normalizes DB field names to what the frontend expects.
 * DB uses: score, createdAt, answerText
 * Frontend expects: totalScore, startedAt, completedAt, totalQuestions, studentAnswer
 */
const normalizeSession = (session) => {
  const normalized = {
    ...session,
    totalScore: session.score ?? 0,
    startedAt: session.createdAt,
    completedAt: session.status === "COMPLETED" ? session.updatedAt : null,
  };

  // Normalize answers if included
  if (session.vivaAnswers) {
    normalized.vivaAnswers = session.vivaAnswers.map(a => ({
      ...a,
      studentAnswer: a.answerText,
      questionText: a.question?.questionText ?? a.questionText ?? ""
    }));
    normalized.totalQuestions = session.vivaAnswers.length > 0
      ? normalized.vivaAnswers.length
      : undefined;
  }

  return normalized;
};

module.exports = {
  seedQuestionsIfNeeded,
  startVivaSession,
  submitAnswer,
  completeSession,
  getSessionDetails,
  getUserSessions,
  getSubjects
};
