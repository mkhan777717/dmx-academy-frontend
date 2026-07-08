const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', 'backend', '.env') });
const { io } = require('socket.io-client');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { submitUserCode } = require('../../backend/src/services/submissionService');

async function test() {
  console.log('Starting end-to-end WebSocket integration test...');
  
  // 1. Create unique test objects
  const randomSuffix = Math.floor(Math.random() * 1000000);
  const username = `socket_user_${randomSuffix}`;
  const email = `socket_user_${randomSuffix}@example.com`;
  
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: 'socketpassword123',
    }
  });
  console.log(`Created user: ${username} (ID: ${user.id})`);
  
  const contest = await prisma.contest.create({
    data: {
      title: `Socket Test Contest ${randomSuffix}`,
      description: 'Socket test description',
      startTime: new Date(Date.now() - 60000), // active now
      endTime: new Date(Date.now() + 3600000),
    }
  });
  console.log(`Created contest: "${contest.title}" (ID: ${contest.id})`);
  
  // Register a practice problem as a contest problem with points
  const problem = await prisma.problem.findFirst({
    include: { testCases: true }
  });
  
  if (!problem) {
    throw new Error('No problems found in database. Run seed first.');
  }
  
  await prisma.contestProblem.create({
    data: {
      contestId: contest.id,
      problemId: problem.id,
      points: 100
    }
  });
  console.log(`Linked problem "${problem.title}" (ID: ${problem.id}) to contest`);
  
  // Register user participation in the contest
  await prisma.contestParticipation.create({
    data: {
      userId: user.id,
      contestId: contest.id,
      completed: false,
      username: user.username,
      contestTitle: contest.title
    }
  });
  console.log('Registered participation in DB');

  // 2. Setup Socket.io client to connect
  const socket = io('http://127.0.0.1:5001', {
    transports: ['websocket', 'polling']
  });

  return new Promise((resolve, reject) => {
    socket.on('connect', () => {
      console.log('✅ Socket client connected to server!');
      
      // Join the contest room
      socket.emit('joinContest', contest.id);
      console.log(`Joined contest room: contest_${contest.id}`);
      
      // Setup the event listener
      socket.on('contestLeaderboardUpdate', async (data) => {
        console.log('📬 Received contestLeaderboardUpdate event via WebSockets!');
        console.log('Contest title:', data.contest.title);
        console.log('Leaderboard rankings:', data.leaderboard);
        
        if (data.contest.id === contest.id) {
          console.log('✅ SUCCESS! Leaderboard updates pushed successfully via Socket.io!');
          
          // Cleanup
          console.log('Cleaning up...');
          await prisma.contestParticipation.deleteMany({ where: { contestId: contest.id } });
          await prisma.contestProblem.deleteMany({ where: { contestId: contest.id } });
          await prisma.contest.delete({ where: { id: contest.id } });
          await prisma.user.delete({ where: { id: user.id } });
          console.log('Cleanup completed successfully.');
          
          socket.disconnect();
          resolve();
        }
      });
      
      // Setup live submission listener
      socket.on('newLiveSubmission', (data) => {
        console.log('📬 Received newLiveSubmission event via WebSockets:', data.id);
      });
      
      // Trigger a submission
      console.log('Triggering code submission execution...');
      submitUserCode({
        userId: user.id,
        problemId: problem.id,
        language: 'JAVASCRIPT',
        code: 'function solution() { return true; }' // dummy code
      }).catch(reject);
    });

    socket.on('connect_error', (error) => {
      reject(new Error(`Socket connection failed: ${error.message}`));
    });

    setTimeout(() => {
      socket.disconnect();
      reject(new Error('Timeout waiting for WebSocket events'));
    }, 15000);
  });
}

test()
  .then(() => {
    console.log('🎉 WebSocket integration test PASSED!');
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('❌ Test FAILED:', err);
    // Attempt database cleanup on failure if objects were created
    try {
      await prisma.contestParticipation.deleteMany({ where: { username: { startsWith: 'socket_user_' } } });
      await prisma.contestProblem.deleteMany({ where: { contest: { title: { startsWith: 'Socket Test Contest' } } } });
      await prisma.contest.deleteMany({ where: { title: { startsWith: 'Socket Test Contest' } } });
      await prisma.user.deleteMany({ where: { username: { startsWith: 'socket_user_' } } });
    } catch (cleanupErr) {
      console.error('Failed to cleanup after failure:', cleanupErr);
    }
    process.exit(1);
  });
