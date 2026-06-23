const jwt = require('jsonwebtoken');
const http = require('http');

const secret = "nfkbregbkjedbfverivjerlsgvuergvirklkuchgvirjgvekeyrghiotrt";
const token = jwt.sign({ id: "demo-1" }, secret);

const problemData = JSON.stringify({
  title: "Test Problem String ID",
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

const req = http.request({
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
    console.log("STATUS:", res.statusCode);
    console.log("RESPONSE:", JSON.parse(data));
  });
});

req.on('error', (e) => {
  console.error("ERROR:", e);
});

req.write(problemData);
req.end();
