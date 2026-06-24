const prisma = require('../prisma');
const { submissionSchema } = require('../utils/validators');
const { submitUserCode } = require('../services/submissionService');

/**
 * Submit code for a problem
 */
const submitSolution = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const pid = parseInt(problemId);

    if (isNaN(pid)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid problem ID format.',
      });
    }

    // Validate submission input
    const validatedData = submissionSchema.parse(req.body);
    const { language, code } = validatedData;

    const userId = req.user.id; // From protect middleware

    // Run execution and store result
    const submissionResult = await submitUserCode({
      userId,
      problemId: pid,
      language,
      code,
    });

    res.status(201).json({
      success: true,
      message: 'Code execution completed.',
      submission: submissionResult,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all submissions (with optional filtering by user, problem, or status)
 */
const getAllSubmissions = async (req, res, next) => {
  try {
    const { userId, problemId, status } = req.query;

    const whereClause = {};

    if (userId) {
      whereClause.userId = parseInt(userId);
    }
    if (problemId) {
      whereClause.problemId = parseInt(problemId);
    }
    if (status) {
      whereClause.status = status;
    }

    const submissions = await prisma.submission.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        problem: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to recent 50 submissions for performance
    });

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get details of a single submission
 */
const getSingleSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const submissionId = parseInt(id);

    if (isNaN(submissionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid submission ID format.',
      });
    }

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        user: {
          select: { id: true, username: true },
        },
        problem: {
          select: { id: true, title: true, slug: true },
        },
      },
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found.',
      });
    }

    // Only the author or an admin should see the source code (optional privacy rule, let's keep it visible or private based on preference. Let's allow public display or restrict it. Usually CP platforms allow public view unless private. Let's let it be readable but keep safety).
    res.status(200).json({
      success: true,
      submission,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Run user code once with custom inputs in real-time (without database persistence)
 */
const runCode = async (req, res, next) => {
  try {
    const { language, code, input } = req.body;

    if (!language || !code) {
      return res.status(400).json({
        success: false,
        message: 'Language and code are required.',
      });
    }

    const { runCustomCode } = require('../services/executionService');
    const result = await runCustomCode(language, code, input || '');

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitSolution,
  getAllSubmissions,
  getSingleSubmission,
  runCode,
};
