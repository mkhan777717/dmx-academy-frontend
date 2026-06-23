const http = require('http');

http.get('http://localhost:5001/health', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log("HEALTH CHECK STATUS:", res.statusCode);
    console.log("HEALTH CHECK RESPONSE:", JSON.parse(data));
  });
}).on('error', (err) => {
  console.error("HEALTH CHECK ERROR:", err);
});
