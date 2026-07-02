const express = require('express');
const path = require('path');
const multer = require('multer');

const {
  getSubjects, startSession, submitQuestionAnswer,
  completeSession, getSession, getHistory, correctTranscript
} = require('../controllers/vivaController');


const {
  listQuestions, listSubjects, listTopics,
  getQuestion, createQuestion, updateQuestion, deleteQuestion
} = require('../controllers/questionBankController');

const {
  list: listMaterials, get: getMaterial, upload: uploadMaterial,
  retry: retryExtraction, generate: generateQuestions,
  saveQuestions, remove: deleteMaterial
} = require('../controllers/studyMaterialController');

const { protect, restrictTo } = require('../middleware/authMiddleware');
const { UPLOADS_DIR } = require('../services/studyMaterialService');

// ── Multer: PDF uploads ──────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ts = Date.now();
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${ts}-${safe}`);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Only PDF files are allowed.'), false);
};
const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

const router = express.Router();

// ── Public ───────────────────────────────────────────────────────────
router.get('/subjects', getSubjects);

// ── Question Bank (read: all authenticated) ──────────────────────────
router.get('/questions/subjects', protect, listSubjects);
router.get('/questions/topics',   protect, listTopics);
router.get('/questions',          protect, listQuestions);
router.get('/questions/:id',      protect, getQuestion);

// ── Question Bank (write: mentor/admin only) ─────────────────────────
router.post(  '/questions',      protect, restrictTo('ADMIN', 'MENTOR', 'INSTITUTE_ADMIN', 'BATCH_MANAGER'), createQuestion);
router.put(   '/questions/:id',  protect, restrictTo('ADMIN', 'MENTOR', 'INSTITUTE_ADMIN', 'BATCH_MANAGER'), updateQuestion);
router.delete('/questions/:id',  protect, restrictTo('ADMIN', 'MENTOR', 'INSTITUTE_ADMIN', 'BATCH_MANAGER'), deleteQuestion);

// ── Study Materials (mentor/admin only) ──────────────────────────────
// save-questions must come BEFORE /:id routes to avoid param collision
router.post('/materials/save-questions', protect, restrictTo('ADMIN', 'MENTOR', 'INSTITUTE_ADMIN', 'BATCH_MANAGER'), saveQuestions);

router.get(   '/materials',          protect, restrictTo('ADMIN', 'MENTOR', 'INSTITUTE_ADMIN', 'BATCH_MANAGER'), listMaterials);
router.post(  '/materials',          protect, restrictTo('ADMIN', 'MENTOR', 'INSTITUTE_ADMIN', 'BATCH_MANAGER'), uploadMiddleware.single('file'), uploadMaterial);
router.get(   '/materials/:id',      protect, restrictTo('ADMIN', 'MENTOR', 'INSTITUTE_ADMIN', 'BATCH_MANAGER'), getMaterial);
router.delete('/materials/:id',      protect, restrictTo('ADMIN', 'MENTOR', 'INSTITUTE_ADMIN', 'BATCH_MANAGER'), deleteMaterial);
router.post(  '/materials/:id/retry',    protect, restrictTo('ADMIN', 'MENTOR', 'INSTITUTE_ADMIN', 'BATCH_MANAGER'), retryExtraction);
router.post(  '/materials/:id/generate', protect, restrictTo('ADMIN', 'MENTOR', 'INSTITUTE_ADMIN', 'BATCH_MANAGER'), generateQuestions);

// ── Session routes (all protected) ───────────────────────────────────
router.use(protect);
router.get( '/history',              getHistory);
router.get( '/history/:sessionId',   getSession);
router.post('/session/start',        startSession);
router.post('/session/correct-transcript', correctTranscript);
 router.post('/session/answer',       submitQuestionAnswer);

router.post('/session/complete',     completeSession);

module.exports = router;
