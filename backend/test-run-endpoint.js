const http = require('http');

const body = JSON.stringify({
  language: "PYTHON",
  code: `
import sys
input_data = sys.stdin.read().strip()
print(f"Hello {input_data} from Python!")
`,
  input: "Ishaan"
});

const req = http.request({
  hostname: '127.0.0.1',
  port: 5001,
  path: '/api/submissions/run',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-bypass-auth': 'true',
    'x-bypass-role': 'ADMIN',
    'Content-Length': Buffer.byteLength(body)
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

req.write(body);
req.end();
