// Node.js Dedicated Course Data
// Formatted for dynamic catalog consumption and lesson viewer parsing

export const allPhases = [
  {
    id: "nd-phase-1",
    title: "Phase 1: Runtime Core, Event Loop & Express Server Basics (Weeks 1–2)",
    description: "Learn Node.js single-thread execution loops, filesystem manipulation, stream processing, Express routes, body parsing, and middleware rules.",
    modules: [
      {
        id: "nd-m-1",
        title: "Module 1: Node.js Runtime Core",
        duration: "1 Week",
        difficulty: "Beginner",
        objectives: [
          "Explain thread architecture and V8 engine Event Loop execution",
          "Compare ES Modules declarations with CommonJS patterns",
          "Read and write files asynchronously using fs core scripts",
          "Emit and listen to events using EventEmitters",
          "Stream huge files to optimize server memory usage"
        ],
        lessons: [
          {
            id: "nd-l-1-1",
            title: "V8 Engine & Single-Thread Event Loop Execution",
            time: "45 min",
            summary: "Single-thread process limits, libuv thread pools, and non-blocking I/O callbacks.",
            content: `
### Node.js Thread Architecture

Traditional web servers (like Apache) spin up a new operating system thread for each incoming connection. Under heavy traffic, this consumes massive RAM. Node.js operates on a **Single-Thread Event Loop**, offloading blocking tasks to the operating system kernel or a background worker thread pool (managed by libuv).

#### How the Event Loop Works:
1. **Call Stack:** Standard synchronous JS code runs sequentially.
2. **Async Handoff:** Operations like database checks or filesystem reads are offloaded to the OS kernel or libuv.
3. **Queue Entry:** Once the async task completes, the OS places its callback function into the Event Queue.
4. **Stack Check:** When the Call Stack is empty, the Event Loop pushes the next callback onto the stack to run.

#### Event Loop Flow Visual:
\`\`\`
[Sync Call Stack] ===> Offload Blocking Task ===> [libuv Thread Pool]
       ^                                                |
       |-- Push Callback when Call Stack is empty <== [Callback Queue]
\`\`\`

#### Quiz Questions:
1. **What engine compiles JavaScript directly into native machine code inside Node.js?**
   *   a) Libuv
   *   b) V8 Engine (Correct)
   *   c) SpiderMonkey
2. **What occurs if you execute a heavy synchronous CPU calculation (like sorting 10 million array records) on the main stack?**
   *   a) Node.js runs it in the background automatically
   *   b) The main thread blocks, freezing responses for all other concurrent web users (Correct)
   *   c) The server scales horizontally

#### Interview Questions:
* **How does Node.js handle thousands of concurrent connections on a single thread?**
  *   *Answer:* By using non-blocking asynchronous I/O. When a connection requests a database query, Node offloads the query to the OS kernel and continues handling other user connections. When the database responds, its callback is queued and processed when the main thread is idle, keeping latency low.
* **What is libuv, and what is its role in Node.js?**
  *   *Answer:* Libuv is a multi-platform C library that Node.js uses to manage asynchronous I/O. It maintains a thread pool (default size of 4) to execute blocking filesystem, DNS, or cryptographic operations in the background.

#### Summary:
Node.js uses a single-thread event loop for high concurrency, offloading blocking tasks to the OS or libuv to keep threads free.
            `,
            exercise: "Write down a brief explanation of how executing an sync loop blocks other client requests on a local Node server."
          },
          {
            id: "nd-l-1-2",
            title: "ES Modules (ESM) vs. CommonJS (CJS) Modules",
            time: "40 min",
            summary: "package.json structure, script configs, importing ES Modules vs CommonJS modules.",
            content: `
### ES Modules vs. CommonJS Modules

Node.js supports two module formats to import and export code.

#### 1. CommonJS (CJS):
* The legacy default format.
* Uses \`require()\` to import and \`module.exports\` to export.
* Synchronous loading, resolve files at runtime.
\`\`\`javascript
// Import
const fs = require('fs');
// Export
module.exports = { myFunction };
\`\`\`

#### 2. ES Modules (ESM):
* The modern standard.
* Uses \`import\` and \`export\` statements.
* Asynchronous loading, resolved statically at compile-time.
* Requires setting \`"type": "module"\` in \`package.json\`, or using the \`.mjs\` file extension.
\`\`\`javascript
// Import
import fs from 'fs';
// Export
export { myFunction };
\`\`\`

#### Quiz Questions:
1. **Which property must be added to package.json to enable ES Modules (import/export) globally in a Node.js project?**
   *   a) "modules": "esm"
   *   b) "type": "module" (Correct)
   *   c) "compile": "modern"
2. **Is CommonJS require() loading synchronous or asynchronous?**
   *   a) Synchronous (Correct)
   *   b) Asynchronous
   *   c) Non-blocking

#### Interview Questions:
* **Why can't you use require() inside an ES Module?**
  *   *Answer:* Because ES Modules load asynchronously and statically. \`require()\` is a synchronous runtime function that is not defined in the ESM context. Use \`import\` statements instead.
* **Explain how node_modules resolutions find directories.**
  *   *Answer:* When you import a package, Node.js searches the local \`node_modules\` folder. If not found, it traverses up parent directories recursively until it finds a matching module folder or hits the file system root.

#### Summary:
CommonJS (\`require\`) loads synchronously at runtime. ES Modules (\`import\`) load asynchronously at compile-time. Set type: module in package.json to enable ESM.
            `,
            exercise: "Initialize a project with a package.json file, configure it to support ES Modules, and write a script import statement."
          },
          {
            id: "nd-l-1-3",
            title: "File System Core: Callbacks vs. Promises",
            time: "45 min",
            summary: "Synchronous vs callback vs promise-based fs modules, reading/writing files, and error boundaries.",
            content: `
### File System (fs) Core Module

Node.js offers the built-in \`fs\` module to manipulate files and directories on disk.

#### API Styles:
1. **Synchronous (Blocking):** Blocks the entire event loop. Avoid in web servers:
   \`\`\`javascript
   const data = fs.readFileSync('file.txt', 'utf8');
   \`\`\`
2. **Callbacks (Asynchronous, Non-Blocking):** Multi-nested callbacks can lead to **Callback Hell**:
   \`\`\`javascript
   fs.readFile('file.txt', 'utf8', (err, data) => { ... });
   \`\`\`
3. **Promises (Asynchronous, Recommended):** Clean, readable syntax using \`async/await\`:
   \`\`\`javascript
   import fs from 'fs/promises';
   const data = await fs.readFile('file.txt', 'utf8');
   \`\`\`

#### Promises Code Example:
\`\`\`javascript
import fs from 'fs/promises';

async function processFile() {
  try {
    // Write file
    await fs.writeFile('output.txt', 'Hello Node.js!');
    // Read file
    const content = await fs.readFile('output.txt', 'utf-8');
    print("File Content:", content);
  } catch (error) {
    console.error("FS Error:", error);
  }
}
\`\`\`

#### Quiz Questions:
1. **Which fs import path is used to access the modern Promise-based asynchronous file system APIs?**
   *   a) 'fs/sync'
   *   b) 'fs/promises' (Correct)
   *   c) 'fs/callbacks'
2. **Why should you avoid using readFileSync() inside web server routes?**
   *   a) It deletes files
   *   b) It blocks the single-threaded Event Loop, pausing server responses during disk reads (Correct)
   *   c) It consumes port variables

#### Interview Questions:
* **How do you handle errors in Promise-based fs operations?**
  *   *Answer:* By wrapping the asynchronous commands inside standard \`try-catch\` blocks, catching filesystem issues (like missing files) safely without crashing the server process.
* **What is the difference between fs.writeFile() and fs.appendFile()?**
  *   *Answer:* \`fs.writeFile()\` overwrites the file contents if it already exists. \`fs.appendFile()\` appends the new text data to the end of the file, preserving old contents.

#### Summary:
Avoid sync fs methods in web routes. Use Promise-based \`fs/promises\` with \`try-catch\` blocks to read and write files asynchronously.
            `,
            exercise: "Write an async function that reads a configuration file, parses its JSON contents, and handles missing file errors."
          },
          {
            id: "nd-l-1-4",
            title: "Node.js EventEmitters: Custom Event Loops",
            time: "45 min",
            summary: "Event-driven architecture, EventEmitter class, custom events registration, parameters passing, and listeners limits.",
            content: `
### Node.js EventEmitters

Node.js is an event-driven runtime. Core components (like web servers, streams, and databases) communicate by raising and listening to events.

#### The EventEmitter Class:
Located in the \`events\` module, it allows registering listeners and emitting custom events:
* **on(event, listener):** Registers a listener callback function.
* **emit(event, arguments):** Triggers the event, invoking all registered listeners with the passed arguments.
* **once(event, listener):** Registers a listener that runs only once and is then removed.

#### EventEmitter Code Example:
\`\`\`javascript
import { EventEmitter } from 'events';

// 1. Instantiate emitter
const userEmitter = new EventEmitter();

// 2. Register listener
userEmitter.on('login', (username) => {
  console.log(\`User logged in: \${username}\`);
});

// 3. Emit event triggering listener
userEmitter.emit('login', 'Alice');
\`\`\`

#### Quiz Questions:
1. **Which method is used to trigger an event, invoking all its registered listeners?**
   *   a) trigger()
   *   b) emit() (Correct)
   *   c) call()
2. **What occurs if you register a listener using the once() method?**
   *   a) It runs on every event
   *   b) It runs only once and is then automatically removed from the event listener list (Correct)
   *   c) It blocks other events

#### Interview Questions:
* **What is a memory leak in the context of EventEmitters, and how do you prevent it?**
  *   *Answer:* If you keep registering listeners without removing them, they persist in memory, consuming RAM. Prevent this by removing listeners using \`removeListener()\` or \`off()\` during cleanup.
* **Why does Node.js rely on EventEmitters?**
  *   *Answer:* It decouples components. A module can emit events (e.g. database connected) without needing to know which other modules are listening to handle those events.

#### Summary:
EventEmitters decouple components. Register listeners with \`on()\` or \`once()\`, and trigger callbacks using \`emit()\`.
            `,
            exercise: "Create an EventEmitter class named OrderProcess, register a 'payment' listener, and emit it passing order metrics."
          },
          {
            id: "nd-l-1-5",
            title: "Stream Processing & Memory Optimizations",
            time: "45 min",
            summary: "Readable/Writable streams, buffer bottlenecks, memory leaks prevention, and pipes piping transfers.",
            content: `
### Stream Processing & Memory Optimizations

Reading huge files (e.g. 5GB log files) using standard \`fs.readFile()\` reads the entire file into RAM at once, which can crash the server process. **Streams** solve this by reading and writing files in small, sequential chunks.

#### Stream Types:
* **Readable:** Streams you read from (e.g. HTTP requests, file reads).
* **Writable:** Streams you write to (e.g. HTTP responses, file writes).
* **Duplex/Transform:** Streams that can read, write, and modify data chunks in flight (e.g. GZIP compression).
* **pipe():** Connects a readable stream directly to a writable stream:
  \`\`\`javascript
  readStream.pipe(writeStream);
  \`\`\`

#### Streams Code Example:
\`\`\`javascript
import fs from 'fs';

// Stream chunks of a large file rather than reading it into memory
const src = fs.createReadStream('huge_logs.log');
const dest = fs.createWriteStream('backup_logs.log');

// Pipe manages backpressure and transfers chunks automatically
src.pipe(dest);

src.on('end', () => console.log("Stream copy completed."));
\`\`\`

#### Quiz Questions:
1. **Why do streams optimize memory usage when handling large files?**
   *   a) They compress data on disk
   *   b) They process data in small, sequential chunks instead of loading the entire file into RAM (Correct)
   *   c) They run on native threads
2. **What method connects a readable stream directly to a writable stream?**
   *   a) connect()
   *   b) pipe() (Correct)
   *   c) join()

#### Interview Questions:
* **What is backpressure in Node.js streams?**
  *   *Answer:* Backpressure occurs when a readable stream reads data faster than the writable stream can write it. The buffer fills up. \`pipe()\` manages backpressure automatically, pausing the readable stream until the buffer clears.
* **Explain the difference between buffer-based and stream-based API operations.**
  *   *Answer:* Buffer-based APIs load the entire dataset into memory before returning. Stream-based APIs yield data sequentially in small chunks, keeping memory usage low and constant.

#### Summary:
Streams process files sequentially to optimize memory. Use \`pipe()\` to transfer data chunks between readable and writable streams safely.
            `,
            exercise: "Build a Node server route that reads a local file using a read stream and pipes the chunks directly to the response object."
          }
        ]
      },
      {
        id: "nd-m-2",
        title: "Module 2: Express.js Web Server Framework",
        duration: "1 Week",
        difficulty: "Intermediate",
        objectives: [
          "Configure Express applications, ports, and route systems",
          "Parse JSON body payloads and query parameters",
          "Build custom logger middleware and authorization guards",
          "Assemble centralized error handling boundaries"
        ],
        lessons: [
          {
            id: "nd-l-2-1",
            title: "Express.js Architecture & Basic Routing",
            time: "50 min",
            summary: "Express minimalist wrappers, routing systems, path parameters, status codes, and server instances initialization.",
            content: `
### Express.js Architecture & Routing

Express is a fast, minimalist web framework that wraps Node.js HTTP servers, simplifying routing and middleware configurations.

#### Routing Basics:
Express routes match HTTP verbs (GET, POST, PUT, DELETE) and URL paths:
* **Path Parameters:** Dynamic URL variables prefixed with a colon (e.g. \`/api/users/:id\`), accessed via \`req.params.id\`.
* **Query Parameters:** Key-value pairs appended to the URL (e.g. \`?q=search\`), accessed via \`req.query.q\`.

#### Routing Code Example:
\`\`\`javascript
import express from 'express';
const app = express();

// Basic route returning status code and JSON
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const filter = req.query.filter;
  res.status(200).json({ id: userId, searchFilter: filter });
});

app.listen(5000, () => console.log("Server running on port 5000"));
\`\`\`

#### Quiz Questions:
1. **How do you access a path parameter value from a route declared as '/api/items/:itemId'?**
   *   a) req.query.itemId
   *   b) req.params.itemId (Correct)
   *   c) req.body.itemId
2. **What status code is standard for successfully creating a resource?**
   *   a) 200 (OK)
   *   b) 201 (Created) (Correct)
   *   c) 404 (Not Found)

#### Interview Questions:
* **How does Express handle routes matching under the hood?**
  *   *Answer:* Express maintains an internal routing stack. It traverses the stack in order, evaluating each route path regex until it finds a match and executes its callback function.
* **Explain the difference between req.params, req.query, and req.body.**
  *   *Answer:* \`req.params\` accesses dynamic route variables in the URL path. \`req.query\` parses key-value query parameters appended to the URL. \`req.body\` holds the payload parsed from the request body (e.g. JSON data).

#### Summary:
Express routes handle requests. Access path parameters using \`req.params\`, query parameters using \`req.query\`, and return correct status codes.
            `,
            exercise: "Write an Express route that handles a POST request to '/api/login', reading credentials from the request body."
          },
          {
            id: "nd-l-2-2",
            title: "Request Body Parsing & Data Formats",
            time: "40 min",
            summary: "JSON body middleware parser, urlencoded data, and handling parsed bodies.",
            content: `
### Request Body Parsing

By default, Express does not parse incoming request bodies, yielding \`undefined\` when accessing \`req.body\`.

#### Body Parser Middleware:
To read payloads, we must use built-in body-parsing middleware before route handlers:
* **express.json():** Parses incoming requests with JSON payloads.
* **express.urlencoded():** Parses incoming requests with URL-encoded payloads (standard form submissions).

#### Parsing Code Example:
\`\`\`javascript
import express from 'express';
const app = express();

// Setup parsers before routes!
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/register', (req, res) => {
  // Access parsed JSON body fields
  const { email, password } = req.body;
  res.status(201).json({ status: "success", userEmail: email });
});
\`\`\`

#### Quiz Questions:
1. **What is the value of req.body in an Express route if no body parsing middleware is registered?**
   *   a) Empty object {}
   *   b) undefined (Correct)
   *   c) Null
2. **Which middleware parses incoming JSON request bodies?**
   *   a) express.urlencoded()
   *   b) express.json() (Correct)
   *   c) express.text()

#### Interview Questions:
* **Why must body-parsing middleware be registered before route handlers?**
  *   *Answer:* Express processes request middleware sequentially. If a route handler is declared before \`express.json()\`, the route executes before the body is parsed, leaving \`req.body\` as undefined.
* **What does the 'extended: true' configuration do in urlencoded parsing?**
  *   *Answer:* It enables parsing rich nested objects and arrays using the \`qs\` library rather than simple key-value string structures.

#### Summary:
Register \`express.json()\` and \`express.urlencoded()\` before routes to parse incoming request payloads.
            `,
            exercise: "Create a route handler that receives a payload, validates that required fields exist, and returns a 400 error if missing."
          },
          {
            id: "nd-l-2-3",
            title: "Custom Middleware & Execution Lifecycle",
            time: "45 min",
            summary: "The req-res middleware loop, writing global loggers, route-specific guards, and calling next().",
            content: `
### Express Middleware Lifecycle

Middleware functions execute sequentially during the request-response cycle.

#### Middleware Structure:
A middleware function receives three parameters: \`req\` (request), \`res\` (response), and \`next\` (callback):
\`\`\`javascript
function myMiddleware(req, res, next) {
  // Execute checks or modify req/res here
  next(); // Pass execution control to the next middleware/route handler
}
\`\`\`

#### Critical Rules:
A middleware must either:
1. Call \`next()\` to pass control forward.
2. End the request-response cycle by sending a response (e.g. \`res.send()\`).
If it does neither, the request hangs indefinitely.

#### Quiz Questions:
1. **What must you call at the end of a custom middleware function to pass execution control forward?**
   *   a) res.end()
   *   b) next() (Correct)
   *   c) return true
2. **If a middleware detects that a user is unauthenticated and sends 'res.status(401).send()', should it call next()?**
   *   a) Yes
   *   b) No (Correct)
   *   c) Only if it is a GET request

#### Interview Questions:
* **How do you restrict middleware execution to a specific route?**
  *   *Answer:* By passing the middleware function as an argument to the route definition: \`app.get("/private", authMiddleware, routeHandler)\`.
* **What is the difference between application-level and router-level middleware?**
  *   *Answer:* Application-level middleware is bound globally using \`app.use()\`. Router-level middleware is bound to specific routers using \`router.use()\`, grouping endpoints.

#### Summary:
Middleware inspects or modifies requests. Call \`next()\` to pass control forward, or return a response to end the cycle.
            `,
            exercise: "Write an auth guard middleware that checks the headers for an 'authorization' key, returning 403 if missing."
          },
          {
            id: "nd-l-2-4",
            title: "Centralized Error Handling Middleware",
            time: "45 min",
            summary: "Express error intercepts, 4-parameter error handlers, capturing async errors, and custom API error classes.",
            content: `
### Centralized Error Handling

Writing \`try-catch\` blocks in every route handler leads to duplicate code. Express supports centralized error handling.

#### Error Handling Middleware:
Must accept four arguments: \`err\`, \`req\`, \`res\`, and \`next\`. Express automatically routes all errors thrown in the application here:
\`\`\`javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error"
  });
});
\`\`\`

#### Triggering the Error Handler:
* In sync routes: Throw an error directly.
* In async routes: Pass the error to \`next(error)\`.

#### Quiz Questions:
1. **How does Express identify a middleware function as an error handler?**
   *   a) By its file name
   *   b) By its function signature having exactly four input parameters (err, req, res, next) (Correct)
   *   c) By registering it using app.error()
2. **How do you route an error caught inside an async database query to the centralized error handler?**
   *   a) Throw the error directly
   *   b) Pass the error to the next() callback function: next(error) (Correct)
   *   c) Call res.send()

#### Interview Questions:
* **Why do unhandled async errors crash Node.js servers, and how do you prevent this?**
  *   *Answer:* Asynchronous errors run outside the main stack context. Unhandled promise rejections crash the process. Prevent this by catching errors in try-catch blocks and passing them to \`next(error)\`, or using wrapper libraries (like express-async-errors).
* **What is the role of custom API Error classes?**
  *   *Answer:* They allow specifying custom status codes and messages (e.g. creating a BadRequestError inheriting from Error) to standardize error responses.

#### Summary:
Error handlers use 4-parameter signatures. Pass async errors to \`next(error)\` to trigger centralized logging.
            `,
            exercise: "Write an Express async handler wrapper function that automatically catches errors and passes them to next()."
          }
        ]
      }
    ]
  },
  {
    id: "nd-phase-2",
    title: "Phase 2: Database Schemas, Token Security, and Advanced Backend Concepts (Weeks 3–4)",
    description: "Link Express servers to MongoDB, secure API keys, issue signed JWT sessions, and upload files.",
    modules: [
      {
        id: "nd-m-3",
        title: "Module 3: Database & Security Auth",
        duration: "1 Week",
        difficulty: "Advanced",
        objectives: [
          "Connect Express to MongoDB databases using Mongoose schemas",
          "Apply validations using Joi or schema rules",
          "Encrypt user credentials using bcrypt salt hashing",
          "Generate and verify signed JSON Web Tokens (JWT)",
          "Configure role-based authorization guards"
        ],
        lessons: [
          {
            id: "nd-l-3-1",
            title: "Mongoose Connection & Database Models",
            time: "50 min",
            summary: "NoSQL schema modeling, connecting MongoDB, Joi validations, and compiling queries.",
            content: `
### Mongoose Connection & Database Models

MongoDB is a NoSQL document database. In Node.js, we use Mongoose as an Object Data Modeling (ODM) library to enforce strict schemas and run queries.

#### Mongoose Schemas & Models:
A **Schema** defines the structure of documents in a collection. A **Model** is a compiled constructor class compiled from the schema, used to query and update data:
\`\`\`javascript
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  points: { type: Number, default: 0 }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
\`\`\`

#### Quiz Questions:
1. **What Mongoose object defines document constraints and types for a collection?**
   *   a) Model
   *   b) Schema (Correct)
   *   c) Connection
2. **What occurs if you attempt to write a document with a missing required field using a Mongoose model?**
   *   a) The write succeeds with null values
   *   b) Mongoose validation fails, throwing a ValidationError before querying the database (Correct)
   *   c) The server crashes

#### Interview Questions:
* **How does Mongoose prevent duplicate database connections in hot-reloading Next.js/Node environments?**
  *   *Answer:* By checking if the model is already compiled on the global connection context: \`mongoose.models.User || mongoose.model('User', UserSchema)\`.
* **What is the difference between validation in Mongoose vs Joi?**
  *   *Answer:* Mongoose validation runs at the database schema level before writing. Joi validation runs at the API input level when parsing incoming requests, protecting controllers from malformed inputs.

#### Summary:
Mongoose structures NoSQL collections using schemas, compiling them into models to query databases safely.
            `,
            exercise: "Write a Mongoose schema for a BlogPost containing title, content, author_id, and creation timestamps."
          },
          {
            id: "nd-l-3-2",
            title: "Password Hashing with Bcrypt & Salts",
            time: "45 min",
            summary: "Bcrypt algorithm, why plain hashing is insecure, salting inputs, and checking passwords.",
            content: `
### Password Hashing with Bcrypt

Never save raw plain passwords in a database! If the database is stolen, all user accounts are compromised immediately.

#### The Salting and Hashing Solution:
1. **Cryptographic Hash:** Convert passwords to unique signatures.
2. **The Salt:** A randomly generated string appended to the password before hashing. This prevents attackers from using pre-calculated **Rainbow Tables** to crack passwords.
3. **Bcrypt Work Factor:** A cost parameter determining the number of hashing rounds. This slows down brute-force attempts.

#### Hashing Code Example:
\`\`\`javascript
import bcrypt from 'bcrypt';

async function registerUser(plainPassword) {
  const saltRounds = 10;
  // Generate salt and hash
  const hash = await bcrypt.hash(plainPassword, saltRounds);
  return hash; // Save this in DB
}

async function loginUser(plainPassword, dbHash) {
  // Compare returns true on match
  const match = await bcrypt.compare(plainPassword, dbHash);
  return match;
}
\`\`\`

#### Quiz Questions:
1. **What is the primary purpose of password salting?**
   *   a) To make passwords shorter
   *   b) To ensure identical passwords produce unique hashes, preventing Rainbow Table attacks (Correct)
   *   c) To encrypt databases
2. **Why is standard SHA-256 not recommended for password hashing?**
   *   a) It is not deterministic
   *   b) It is too fast, allowing attackers to check millions of hashes per second during brute force (Correct)
   *   c) It is deprecated

#### Interview Questions:
* **How does bcrypt.compare() know which salt to use to check a password?**
  *   *Answer:* The salt rounds and the salt string are prepended directly to the final hash string generated by bcrypt (e.g. \`$2b$10$...\`). \`bcrypt.compare()\` extracts this salt prefix and applies it to the input password before comparing hashes.
* **Explain how a work factor protects against brute-force attacks.**
  *   *Answer:* It controls the number of hashing iterations. Increasing the work factor doubles the CPU time required to calculate a hash, slowing down brute-force attempts on stolen databases.

#### Summary:
Password security requires salting and slow hashing algorithms (like bcrypt) to prevent brute-force and lookup attacks.
            `,
            exercise: "Write a script that hashes a password and checks a user's input password using the bcrypt library."
          },
          {
            id: "nd-l-3-3",
            title: "JWT Session Tokens: Signing & Claims",
            time: "50 min",
            summary: "JSON Web Tokens structure, header/payload/signature sections, jwt.sign, expiration limits, and token verifications.",
            content: `
### JWT Session Tokens: Signing & Claims

In modern stateless APIs, servers do not store session states in databases. Instead, they issue signed **JSON Web Tokens (JWT)**.

#### JWT Structure (Three Sections separated by dots):
1. **Header (Base64):** Specifies token type and signature algorithm (e.g. HS256).
2. **Payload (Base64):** Contains claims (e.g. user ID, role, expiration time).
3. **Signature:** Cryptographically signs the header and payload using a server-side secret key to prevent tampering.

#### JWT Signing Example:
\`\`\`javascript
import jwt from 'jsonwebtoken';

// 1. Sign token on successful login
const token = jwt.sign(
  { userId: "1024", role: "admin" }, // Claims payload
  process.env.JWT_SECRET,            // Secure server secret
  { expiresIn: '1d' }                // Expiration limit
);

// 2. Verify token inside middleware/route guards
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log("Verified User ID:", decoded.userId);
} catch (error) {
  console.error("Invalid Signature or Expired Token!");
}
\`\`\`

#### Quiz Questions:
1. **Which JWT section contains user details like ID and role permissions?**
   *   a) Header
   *   b) Payload (Correct)
   *   c) Signature
2. **How does the server verify that a JWT was not altered by the client?**
   *   a) By calling a cloud API
   *   b) By recalculating the signature using the server secret key and comparing it to the token signature (Correct)
   *   c) By checking the database

#### Interview Questions:
* **What is a stateless session, and why is JWT preferred for microservices?**
  *   *Answer:* A stateless session requires no database lookups on the server. The token contains all necessary user claims. Since it is signed, the server can trust its contents, simplifying communication across microservices.
* **What are the security risks of JWTs, and how do you mitigate them?**
  *   *Answer:* JWT payloads are only Base64-encoded, not encrypted; anyone can read their contents. Never store sensitive passwords or keys in the payload. Secure them by setting short expirations and using HTTPS.

#### Summary:
JWTs enable stateless authentication. They contain base64-encoded headers and payloads, signed with a server secret to prevent tampering.
            `,
            exercise: "Write a token generator function that accepts a user object, issues a signed JWT, and sets an expiration of 2 hours."
          },
          {
            id: "nd-l-3-4",
            title: "Route Guards: Role-Based Authorizations",
            time: "50 min",
            summary: "Securing routes, parsing auth headers, decoding tokens, and checking user roles.",
            content: `
### Route Guards: Role-Based Authorization

Route guards are middleware functions placed before route handlers to restrict endpoint access to authorized users or specific user roles.

#### Implementation Flow:
1. Read the \`Authorization\` header from the incoming request.
2. Extract the bearer token: \`Bearer <token>\`.
3. Verify the token signature using the server secret.
4. Append the decoded payload (e.g. user details) to the request object: \`req.user = decoded\`.
5. Check if the user's role has permission to access the endpoint.

#### Guard Middleware Code Example:
\`\`\`javascript
import jwt from 'jsonwebtoken';

export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    // 1. Read token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: Missing Token" });
    }

    const token = authHeader.split(" ")[1];
    try {
      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Inject payload into request context

      // 3. Check role
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: "Forbidden: Access Denied" });
      }
      next();
    } catch (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid Token" });
    }
  };
}
\`\`\`

#### Quiz Questions:
1. **Which HTTP status code represents an authenticated user trying to access a resource they do not have permissions for (e.g., standard user accessing admin panels)?**
   *   a) 401 (Unauthorized)
   *   b) 403 (Forbidden) (Correct)
   *   c) 404 (Not Found)
2. **Where is req.user typically populated in a route guard?**
   *   a) In database logs
   *   b) In the request object context after verifying the token signature (Correct)
   *   c) In cookie headers

#### Interview Questions:
* **What is the difference between Authentication and Authorization?**
  *   *Answer:* Authentication verifies **who** the user is (e.g. credentials check). Authorization determines **what** the authenticated user is allowed to do (e.g. role access checks).
* **Why do we inject decoded token details into req.user?**
  *   *Answer:* Injecting token details (like user ID) makes this information available to all downstream middleware and route handlers, allowing them to perform actions (like querying database records) without re-decoding the token.

#### Summary:
Route guards read bearer tokens, verify signatures, inject payloads into the request context, and check roles to restrict endpoint access.
            `,
            exercise: "Secure an Express DELETE route to allow only users with the 'admin' role to trigger it."
          }
        ]
      },
      {
        id: "nd-m-4",
        title: "Module 4: Advanced Backend Concepts",
        duration: "1 Week",
        difficulty: "Advanced",
        objectives: [
          "Configure environment variables and database connections",
          "Apply CORS headers to enable safe cross-origin resource sharing",
          "Handle file uploads using Multer middleware",
          "Configure Winston logging and Morgan integrations"
        ],
        lessons: [
          {
            id: "nd-l-4-1",
            title: "Environment Variables & dotenv Settings",
            time: "40 min",
            summary: "Environment variables, process.env namespace, storing credentials, and dotenv setups.",
            content: `
### Environment Variables & dotenv Settings

Never hardcode credentials, database URIs, or API keys directly in source code files! Hardcoding exposes secrets if code is pushed to public repositories.

#### dotEnv Configuration:
Store configurations in a \`.env\` file in the project root. This file is added to \`.gitignore\` to prevent committing secrets:
\`\`\`
PORT=5000
DATABASE_URL=mongodb://localhost:27017/app
JWT_SECRET=super_secret_key
\`\`\`

#### Importing dotenv inside Node:
\`\`\`javascript
import dotenv from 'dotenv';
// Load variables into process.env namespace at startup
dotenv.config();

const port = process.env.PORT || 5000;
const dbUrl = process.env.DATABASE_URL;
\`\`\`

#### Quiz Questions:
1. **Which file should never be committed to git to protect database credentials and secrets?**
   *   a) package.json
   *   b) .env (Correct)
   *   c) index.js
2. **What namespace object holds environment variables loaded by dotenv?**
   *   a) window.env
   *   b) process.env (Correct)
   *   c) global.variables

#### Interview Questions:
* **How do environment variables improve application deployment?**
  *   *Answer:* They decouple configuration from code. You can use the same codebase in all environments, passing different database URIs or credentials at runtime using environment variables.
* **Why is it important to define fallback values when reading environment variables?**
  *   *Answer:* Fallback values (e.g. \`process.env.PORT || 5000\`) prevent the application from crashing at startup if config keys are missing in the local environment.

#### Summary:
Store secrets in a local \`.env\` file (added to \`.gitignore\`), loading them into the \`process.env\` namespace at startup using \`dotenv\`.
            `,
            exercise: "Create a .env file containing mock settings, configure dotenv in a test script, and print loaded values."
          },
          {
            id: "nd-l-4-2",
            title: "CORS Headers: Enabling Safe Resource Sharing",
            time: "45 min",
            summary: "Same-Origin Policy, CORS request preflights, headers configuration, and Express CORS middleware.",
            content: `
### CORS: Cross-Origin Resource Sharing

Browsers enforce the **Same-Origin Policy**, blocking client scripts from making requests to a backend on a different domain.

#### CORS Headers Solution:
To authorize frontend requests from other domains, the backend server must respond with specific Access-Control headers:
* **Access-Control-Allow-Origin:** Specifies which domains are allowed to request data.
* **Access-Control-Allow-Methods:** Specifies allowed HTTP verbs (GET, POST).
* **Preflight Request (OPTIONS):** Browsers automatically send an \`OPTIONS\` request before making cross-origin writes (like POST) to verify access.

#### Express CORS Integration:
\`\`\`javascript
import express from 'express';
import cors from 'cors';
const app = express();

// Enable CORS for a specific frontend origin
app.use(cors({
  origin: "https://my-frontend.com",
  methods: ["GET", "POST"]
}));
\`\`\`

#### Quiz Questions:
1. **What security mechanism in browsers blocks frontend scripts from querying cross-origin APIs without authorization?**
   *   a) Cross-Site Scripting (XSS)
   *   b) Same-Origin Policy (Correct)
   *   c) Content Security Policy (CSP)
2. **What HTTP request type is sent automatically as a preflight check before making cross-origin write operations?**
   *   a) GET
   *   b) OPTIONS (Correct)
   *   c) POST

#### Interview Questions:
* **What is the security risk of configuring Access-Control-Allow-Origin to '*'?**
  *   *Answer:* The asterisk \`*\` authorizes *any* domain to request data from your API. This is unsafe for private endpoints, exposing user data if requests send session cookies.
* **Explain how preflight requests protect legacy servers.**
  *   *Answer:* Legacy servers might process state-changing requests (like DELETE) before validating origin headers. Preflight checks send an \`OPTIONS\` request first, blocking the actual request if the origin is unauthorized.

#### Summary:
Browsers block cross-origin requests. Use the \`cors\` middleware to configure \`Access-Control-Allow-Origin\` headers, enabling secure resource sharing.
            `,
            exercise: "Configure the CORS middleware in an Express application to allow requests only from a specific port."
          },
          {
            id: "nd-l-4-3",
            title: "File Uploads: Multer Middleware Integrations",
            time: "50 min",
            summary: "Multipart/form-data formats, Multer configurations, disk storage options, file validation, and error limits.",
            content: `
### File Uploads with Multer

Web applications upload media files using the \`multipart/form-data\` format. Express requires specialized middleware to parse these streams and save files to disk.

#### Multer Integration:
Multer is a middleware that parses multipart request bodies, saving files to disk and appending file attributes to the request context:
* **req.file:** Contains metadata of a single uploaded file.
* **req.body:** Contains parsed text fields.

#### Upload Code Example:
\`\`\`javascript
import express from 'express';
import multer from 'multer';

const app = express();

// Configure storage destination and file names
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, \`\${Date.now()}-\${file.originalname}\`)
});

const upload = multer({ storage: storage });

// Single file upload route
app.post('/api/upload', upload.single('profile_pic'), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }
  res.status(200).json({ status: "success", path: req.file.path });
});
\`\`\`

#### Quiz Questions:
1. **What request content-type is required to upload files to a web server?**
   *   a) application/json
   *   b) multipart/form-data (Correct)
   *   c) application/x-www-form-urlencoded
2. **Which property holds the uploaded file metadata in an Express request context after passing through Multer?**
   *   a) req.body
   *   b) req.file (Correct)
   *   c) req.upload

#### Interview Questions:
* **How do you restrict file uploads to images only using Multer?**
  *   *Answer:* By configuring the \`fileFilter\` callback, inspecting the file's mime type (e.g. checking if it starts with \`image/\`), and calling the callback with an error if it doesn't match.
* **Why should you rename files upon receipt on the server?**
  *   *Answer:* To prevent filename collisions (e.g. multiple users uploading 'image.jpg') and sanitize filenames to avoid path traversal vulnerabilities.

#### Summary:
Use Multer middleware to process \`multipart/form-data\` uploads. Define disk storage parameters to rename and validate uploaded files.
            `,
            exercise: "Write a Multer upload configuration that restricts file sizes to a maximum of 2 Megabytes."
          },
          {
            id: "nd-l-4-4",
            title: "Logging & Monitoring: Winston Logger & Morgan",
            time: "50 min",
            summary: "Winston logging configurations, levels hierarchy, transport targets, and Morgan HTTP logs integrations.",
            content: `
### Logging & Monitoring: Winston & Morgan

In production, using \`console.log()\` is insufficient. Logs must be structured (e.g. JSON), output levels categorized, and logs written to persistent files or aggregation systems.

#### Logging Modules:
1. **Morgan:** HTTP request logger middleware that outputs request details (method, status code, response time) automatically.
2. **Winston:** A logging library supporting multiple output targets (transports):
   * **Console Transport:** Outputs logs to the console.
   * **File Transport:** Saves logs to files (e.g. \`combined.log\`, \`error.log\`).
   * **Log Levels:** error (0), warn (1), info (2), debug (5).

#### Winston Logger Code Example:
\`\`\`javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(), // Standardized JSON logs
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Log events in application controllers:
logger.info("Application started successfully");
logger.error("Database query failed due to connection timeout");
\`\`\`

#### Quiz Questions:
1. **Which logging library is used to automatically log HTTP request methods, paths, status codes, and response times in Express?**
   *   a) Winston
   *   b) Morgan (Correct)
   *   c) Nodemon
2. **What does a Winston File Transport do?**
   *   a) Compresses server files
   *   b) Writes and saves structured logs to persistent files on disk (Correct)
   *   c) Sends emails

#### Interview Questions:
* **Why is structured JSON logging preferred over plain text console logs in production?**
  *   *Answer:* Structured JSON logs are easily parsed by log aggregation search systems (like Elasticsearch or Datadog), allowing teams to query, filter, and alert on specific error keys.
* **Explain the concept of log rotation.**
  *   *Answer:* Log rotation splits log files by size or age (e.g. creating daily files) and deletes old logs to prevent log files from growing and consuming all available disk space.

#### Summary:
Integrate Morgan to log HTTP requests. Use Winston to write structured JSON logs categorized by level (info, error) to console or file targets.
            `,
            exercise: "Configure an Express server that uses Morgan for HTTP logging and writes runtime errors to an error log file using Winston."
          }
        ]
      }
    ]
  }
];

export const resourcesList = [
  {
    category: "Node.js Developer References",
    items: [
      { name: "Node.js Core API Docs", desc: "Detailed references for events, streams, and file systems.", link: "https://nodejs.org/api" },
      { name: "Express.js Guide", desc: "Official guides for routes, middleware, and error handling.", link: "https://expressjs.com" },
      { name: "Mongoose ODM Reference Manual", desc: "Connecting to databases, models, validations, and aggregation pipelines.", link: "https://mongoosejs.com" }
    ]
  }
];

export const glossary = [
  { term: "Event Loop", def: "Asynchronous scheduler inside libuv managing execution stack tasks and offloaded queues." },
  { term: "ES Modules", def: "Modern module format using import/export statements resolved statically at compile-time." },
  { term: "Stream backpressure", def: "A state when a readable stream reads data faster than a writable stream can write it, managed by pipe()." },
  { term: "Path Parameter", def: "A dynamic variable in a route URL (e.g., :userId) parsed into req.params." },
  { term: "Middleware", def: "Interception logic functions executing sequentially during the request-response cycle." },
  { term: "Bcrypt Salting", def: "Generating a random string prefix appended to passwords before hashing to block rainbow table lookups." },
  { term: "JWT", def: "JSON Web Token - securely signed base64-encoded session token used for stateless authentication." },
  { term: "Same-Origin Policy", def: "Browser security model blocking frontend queries to cross-origin APIs without CORS headers." },
  { term: "Multer", def: "Express middleware parsing multipart/form-data uploads to process file uploads." },
  { term: "Winston Transport", def: "A log delivery target configuration directing logs to console, file, or cloud systems." }
];
