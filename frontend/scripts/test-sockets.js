const { io } = require('socket.io-client');

const socket = io('http://127.0.0.1:5001', {
  transports: ['websocket', 'polling']
});

console.log('Connecting to WebSocket server at http://127.0.0.1:5001...');

socket.on('connect', () => {
  console.log('✅ Connected successfully to Socket.io server!');
  
  const contestId = 18;
  console.log(`Joining contest room: contest_${contestId}...`);
  socket.emit('joinContest', contestId);
  
  console.log('Listening for leaderboard and submission updates...');
});

socket.on('newLiveSubmission', (data) => {
  console.log('📬 Received newLiveSubmission event:', data.id);
});

socket.on('contestLeaderboardUpdate', (data) => {
  console.log('📬 Received contestLeaderboardUpdate event:', data.contest.title);
  console.log('✅ Real-time contest updates verified!');
  socket.disconnect();
  process.exit(0);
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error.message);
  process.exit(1);
});

setTimeout(() => {
  console.error('❌ Connection or event timed out.');
  socket.disconnect();
  process.exit(1);
}, 12000);
