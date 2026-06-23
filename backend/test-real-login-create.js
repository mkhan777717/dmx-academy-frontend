const http = require('http');

const loginData = JSON.stringify({
  email: 'admin@synapse.com',
  password: 'admin123'
});

const reqLogin = http.request({
  hostname: '127.0.0.1',
  port: 5001,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData)
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log("LOGIN STATUS:", res.statusCode);
    const loginRes = JSON.parse(data);
    console.log("LOGIN RESPONSE:", loginRes);
    
    if (res.statusCode === 200 && loginRes.success) {
      createProblem(loginRes.token);
    }
  });
});

reqLogin.on('error', (e) => {
  console.error("LOGIN ERROR:", e);
});

reqLogin.write(loginData);
reqLogin.end();

function createProblem(token) {
  const problemData = JSON.stringify({
    title: "Test Real Problem " + Date.now(),
    difficulty: "MEDIUM",
    statement: "This is a test problem statement of at least ten characters.",
    inputFormat: "Standard input format",
    outputFormat: "Standard output format",
    constraints: "Constraints description",
    explanation: "Explanation description",
    testCases: [
      {
        input: "test input",
        expectedOutput: "test output",
        isSample: true
      }
    ]
  });

  const reqCreate = http.request({
    hostname: '127.0.0.1',
    port: 5001,
    path: '/api/problems',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Length': Buffer.byteLength(problemData)
    }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log("CREATE STATUS:", res.statusCode);
      try {
        console.log("CREATE RESPONSE:", JSON.parse(data));
      } catch (err) {
        console.log("CREATE RESPONSE TEXT:", data);
      }
    });
  });

  reqCreate.on('error', (e) => {
    console.error("CREATE ERROR:", e);
  });

  reqCreate.write(problemData);
  reqCreate.end();
}
