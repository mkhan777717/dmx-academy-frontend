const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  createSession,
  generateToken,
  getActiveSession,
  getAllSessions,
  endSession,
  deleteSession,
  getSessionChat,
  postChatMessage,
} = require('../controllers/livekitController');

// ─── Public Routes ──────────────────────────────────────────────────
router.get('/session/active', getActiveSession);    // Anyone can check if a session is live
router.get('/sessions', getAllSessions);             // Anyone can see past sessions

// ─── Protected Routes ───────────────────────────────────────────────
router.post('/token', protect, generateToken);      // Any logged-in user can request a token
router.get('/session/:id/chat', protect, getSessionChat);   // Get chat history for a session
router.post('/session/:id/chat', protect, postChatMessage); // Post a new chat message

// ─── Admin/Mentor Only ──────────────────────────────────────────────
router.post('/session', protect, restrictTo('ADMIN', 'MENTOR'), createSession);
router.patch('/session/:id/end', protect, restrictTo('ADMIN', 'MENTOR'), endSession);
router.delete('/session/:id', protect, restrictTo('ADMIN', 'MENTOR'), deleteSession);

module.exports = router;
