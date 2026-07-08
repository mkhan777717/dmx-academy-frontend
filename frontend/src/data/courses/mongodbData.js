// MongoDB Mastery Complete Course Data
// Formatted for dynamic catalog consumption and lesson viewer parsing

export const allPhases = [
  {
    id: "mg-phase-1",
    title: "Phase 1: NoSQL CRUD, Document Modeling, and Indexing (Weeks 1–2)",
    description: "Learn MongoDB document architecture, BSON formatting, advanced query filters, index optimizations, and schema validations.",
    modules: [
      {
        id: "mg-m-1",
        title: "Module 1: Document Database & CRUD Operations",
        duration: "1 Week",
        difficulty: "Beginner-Intermediate",
        objectives: [
          "Differentiate relational databases from NoSQL document stores",
          "Perform MongoDB CRUD actions using terminal queries",
          "Apply schema validations using JSON Schemas"
        ],
        lessons: [
          {
            id: "mg-l-1-1",
            title: "SQL vs NoSQL: Relational vs Document Databases",
            time: "40 min",
            summary: "Comparing tables and rows to collections and documents, horizontal vs vertical scaling, and ACID compliance.",
            content: `
### Relational (SQL) vs. Document (NoSQL) Databases

Modern application architectures require databases optimized for speed, flexible schemas, and horizontal scaling.

#### Core Architectural Differences:
1. **Relational Databases (SQL - e.g. PostgreSQL, MySQL):**
   * Data is stored in fixed-schema **tables** and **rows**.
   * Enforces relationships via foreign keys, requiring **Joins** to compile complex queries.
   * Scales **vertically** (adding more CPU/RAM to a single server).
2. **Document Databases (NoSQL - e.g. MongoDB):**
   * Data is stored in flexible-schema **collections** and BSON/JSON **documents**.
   * Documents can nest arrays and objects, eliminating the need for joins in many queries.
   * Scales **horizontally** (sharding/distributing data across multiple cheap servers).

#### SQL vs. MongoDB Terminology Mapping:
| SQL Concept | MongoDB Concept |
| :--- | :--- |
| Database | Database |
| Table | Collection |
| Row | Document |
| Column | Field |
| Table Join | Aggregation ($lookup) |

#### Quiz Questions:
1. **How do document databases scale to handle massive transaction volumes?**
   *   a) Vertically (adding more CPU to a single master server)
   *   b) Horizontally (distributing data across multiple shards/servers) (Correct)
   *   c) By disabling indexes
2. **What represents the equivalent of an SQL row in MongoDB?**
   *   a) Collection
   *   b) Document (Correct)
   *   c) Field

#### Interview Questions:
* **Explain how schema design in MongoDB improves query performance over relational databases.**
  *   *Answer:* In relational databases, query data is spread across multiple tables, requiring CPU-heavy joins. MongoDB embeds related data inside a single document. Since the entire record is located in one contiguous disk space, the database retrieves it in a single read operation, accelerating performance.
* **When would you choose a Relational DB over a Document DB?**
  *   *Answer:* When the application requires strict, complex transactional relationships with multi-table ACID compliance (e.g. accounting systems) and when schemas are highly static.

#### Summary:
Relational databases enforce fixed schemas and joins. Document databases store nested records as BSON/JSON, supporting horizontal scaling and fast single-read queries.
            `,
            exercise: "Create a list of design differences between SQL and NoSQL databases, comparing scaling, schemas, and performance."
          },
          {
            id: "mg-l-1-2",
            title: "BSON Format & MongoDB Document Architecture",
            time: "40 min",
            summary: "BSON format, document nesting limits, ObjectId hashes, and data types mapping.",
            content: `
### MongoDB Document Architecture

MongoDB stores data records as **BSON** (Binary JSON) documents.

#### What is BSON?
BSON is a binary serialization format used to store documents. It extends JSON by offering:
* **Speed:** Faster to traverse and parse since it includes length prefixes.
* **More Data Types:** Supports types like \`ObjectId\`, \`Date\`, \`Binary Data\`, and \`Decimal128\` (for monetary values).
* **Size Limit:** The maximum BSON document size is **16 Megabytes**. This limit prevents unconstrained document growth that would exhaust server RAM.

#### MongoDB ObjectId Structure (12 Bytes):
Every document requires a unique \`_id\` field, automatically populated as an ObjectId:
* **4 Bytes:** Unix timestamp of creation.
* **5 Bytes:** Random value unique to the machine and process.
* **3 Bytes:** Incrementing counter.
ObjectIds are ordered by creation time and can be parsed to extract timestamps.

#### Quiz Questions:
1. **What is the maximum allowed size of a single BSON document in MongoDB?**
   *   a) 1 MB
   *   b) 16 MB (Correct)
   *   c) Unconstrained
2. **Which data type is supported by BSON but is missing in standard JSON?**
   *   a) Date (or ObjectId) (Correct)
   *   b) String
   *   c) Boolean

#### Interview Questions:
* **What are the advantages of BSON over JSON?**
  *   *Answer:* BSON is binary-encoded, which allows faster parsing and search traversals by including length prefixes. It also supports additional data types like Date and Decimal128 that JSON lacks.
* **Can you extract the creation date from a MongoDB ObjectId?**
  *   *Answer:* Yes. The first 4 bytes of a 12-byte ObjectId contain a Unix timestamp representing its creation time. Driver APIs provide helper methods (like \`ObjectId.getTimestamp()\`) to parse this date.

#### Summary:
MongoDB serializes documents as BSON, capping size at 16MB. ObjectIds contain 12 bytes representing timestamps and unique machines.
            `,
            exercise: "Analyze an ObjectId hash from a MongoDB collection, identifying its timestamp byte sections."
          },
          {
            id: "mg-l-1-3",
            title: "Insert Operations: Single, Batch & Write Concerns",
            time: "45 min",
            summary: "insertMany execution, write concern acknowledgments (w1, wmajority, j), and duplicate key audits.",
            content: `
### Insert Operations & Write Concerns

Writing documents to collections requires selecting client-database communication guarantees.

#### CRUD Write Methods:
* \`db.collection.insertOne({ ... })\`: Inserts a single document.
* \`db.collection.insertMany([ ... ])\`: Inserts an array of documents (batch write).

#### Write Concerns (ACKs):
Write concern dictates the level of guarantee that the write operation succeeded before returning:
* **w: 1 (Default):** Returns as soon as the local standalone database node acknowledges the write in memory.
* **w: majority:** Returns only after a majority of replica set nodes write the data. Protects against database node failover data losses.
* **j: true (Journaling):** Guarantees data is flushed to the on-disk write-ahead log (journal) before returning, preventing data losses on power outages.

#### MongoDB CLI Example:
\`\`\`javascript
// Insert user with write concern majority and journaling enabled
db.users.insertOne(
  { username: "alice", email: "alice@example.com" },
  { writeConcern: { w: "majority", j: true, wtimeout: 5000 } }
);
\`\`\`

#### Quiz Questions:
1. **Which write concern setting ensures data is flushed to the on-disk journal before confirming success to the client?**
   *   a) w: 1
   *   b) j: true (Correct)
   *   c) w: 0
2. **What occurs if you attempt to insert a document with a duplicate value in a unique indexed field (like _id)?**
   *   a) The database overwrites the old document
   *   b) MongoDB throws a Duplicate Key Error (E11000) (Correct)
   *   c) The database crashes

#### Interview Questions:
* **Explain the difference between w:1 and w:majority write concerns.**
  *   *Answer:* \`w:1\` confirms success as soon as the primary node writes the data. \`w:majority\` waits until a majority of replica set members write the data to memory, protecting against data loss if the primary node crashes.
* **What does ordered: true do in an insertMany() operation?**
  *   *Answer:* By default, \`ordered\` is true, meaning MongoDB stops inserting if an error occurs. Setting \`ordered: false\` instructs the database to continue writing remaining documents even if some fail.

#### Summary:
Insert documents using insertOne or insertMany. Set write concerns (w:majority, j:true) to configure durability and consistency.
            `,
            exercise: "Write a MongoDB insertMany command that writes three product documents, configurations set to unordered writes."
          },
          {
            id: "mg-l-1-4",
            title: "Querying Documents: Find, Selectors & Regex",
            time: "45 min",
            summary: "Equality filters, comparison selectors ($gt, $in), logical gates ($and, $or), projection flags, and regex search.",
            content: `
### Querying Documents

MongoDB provides rich query filters to search, filter, and extract documents from collections.

#### 1. Comparison Operators:
* \`$eq\` / \`$ne\`: Equal / Not equal.
* \`$gt\` / \`$gte\`: Greater than / Greater than or equal.
* \`$lt\` / \`$lte\`: Less than / Less than or equal.
* \`$in\` / \`$nin\`: Contained within / Not contained within an array.

#### 2. Logical Operators:
* \`$and\`, \`$or\`, \`$not\`, \`$nor\`.

#### 3. Projection:
Limits the fields returned to save network bandwidth (e.g. \`1\` to include, \`0\` to exclude):
\`\`\`javascript
db.users.find({ age: { $gte: 21 } }, { username: 1, _id: 0 })
\`\`\`

#### Query Examples:
\`\`\`javascript
// Find products priced between 10 and 50, category 'books' or 'office'
db.products.find({
  price: { $gte: 10, $lte: 50 },
  category: { $in: ["books", "office"] }
});
\`\`\`

#### Quiz Questions:
1. **Which comparison operator matches documents where a field's value is greater than or equal to 100?**
   *   a) \`$gt\`
   *   b) \`$gte\` (Correct)
   *   c) \`$lte\`
2. **What does the projection parameter { password: 0 } accomplish in a find() query?**
   *   a) Returns only the password field
   *   b) Returns all fields except the password field (Correct)
   *   c) Deletes password fields

#### Interview Questions:
* **How does querying nested sub-documents differ from querying root-level fields?**
  *   *Answer:* We use dot notation wrapped in quotes to access nested fields (e.g., \`db.users.find({ "address.zip": "90210" })\`).
* **What is the difference between $or and $in operators?**
  *   *Answer:* \`$in\` checks if a *single* field matches any value in an array. \`$or\` checks if any of *multiple* different query conditions are met.

#### Summary:
Query collections using \`find()\`. Filter fields using projection settings, and match values using comparison and logical operators.
            `,
            exercise: "Write a query locating all active users in a database whose log count exceeds 50, selecting only their username."
          },
          {
            id: "mg-l-1-5",
            title: "Update Operators: $set, $unset, $push & Arrays",
            time: "45 min",
            summary: "Update commands, field modifiers ($set, $inc, $unset), array operators ($push, $pull, $addToSet), and upsert options.",
            content: `
### Update Operators: Set, Push & Upsert

Updating documents efficiently requires using specific update operators to modify fields in place rather than replacing entire documents.

#### Field Operators:
* \`$set\`: Replaces or creates a field value.
* \`$inc\`: Increments a numeric field by a specified value.
* \`$unset\`: Deletes a field from a document.

#### Array Operators:
* \`$push\`: Appends a value to an array field.
* \`$pull\`: Removes a value from an array field.
* \`$addToSet\`: Appends a value only if it does not already exist in the array (ensuring uniqueness).

#### Upsert Option:
If \`upsert\` is true, MongoDB updates the document if it exists, or inserts a new document if it doesn't.

#### Update CLI Example:
\`\`\`javascript
// Increment user points, set active flag, and add a tag to an array
db.users.updateOne(
  { email: "alice@example.com" },
  {
    $inc: { points: 10 },
    $set: { active: true },
    $addToSet: { tags: "premium" }
  },
  { upsert: true }
);
\`\`\`

#### Quiz Questions:
1. **Which operator appends an element to an array only if the element does not already exist in that array?**
   *   a) \`$push\`
   *   b) \`$addToSet\` (Correct)
   *   c) \`$set\`
2. **What occurs when an updateOne() command is run with upsert: true but no matching document is found?**
   *   a) The command fails
   *   b) MongoDB creates and inserts a new document matching the query and update operations (Correct)
   *   c) The database resets

#### Interview Questions:
* **Why should you avoid replacing entire documents during updates?**
  *   *Answer:* Replacing documents wastes network bandwidth and database write locks. In-place operators (like \`$set\`) target and update specific fields, minimizing write times.
* **Explain how $inc is atomic.**
  *   *Answer:* \`$inc\` updates numeric fields atomically on the document lock level, preventing race conditions when concurrent requests attempt to update the same counter.

#### Summary:
Modify fields using \`$set\`, \`$inc\`, and \`$unset\`. Manage arrays with \`$push\` and \`$addToSet\`. Set \`upsert: true\` to insert missing documents.
            `,
            exercise: "Write an update command that increments a product's stock by 5 and unsets its 'onSale' field."
          }
        ]
      },
      {
        id: "mg-m-2",
        title: "Module 2: Schema Modeling & Indexing",
        duration: "1 Week",
        difficulty: "Intermediate",
        objectives: [
          "Compare embedded and referenced document modeling designs",
          "Identify one-to-many relationship patterns",
          "Create single, compound, and multikey indexes",
          "Audit index use using explain plans",
          "Validate schemas using JSON Schema validation rules"
        ],
        lessons: [
          {
            id: "mg-l-2-1",
            title: "Schema Design: Embedding vs Referencing",
            time: "45 min",
            summary: "Data relationships, one-to-few vs one-to-many, denormalization (embedding), and normalization (referencing).",
            content: `
### Schema Design: Embedding vs. Referencing

Unlike SQL databases, MongoDB supports nesting data inside documents. Choosing when to embed vs reference is key to designing high-performance schemas.

#### 1. Embedded (Denormalized) Model:
Nests related data inside a single parent document (as arrays or sub-documents):
* **Pros:** Single-read operations, fast retrieval.
* **Cons:** Prone to hitting the 16MB document size limit if arrays grow unconstrained.
* **Best for:** One-to-few relationships or static datasets (e.g. user address list).

#### 2. Referenced (Normalized) Model:
Stores related data in separate collections, linking them using ObjectIds:
* **Pros:** Prevents large document growth.
* **Cons:** Requires multiple queries or \`$lookup\` aggregations to join data.
* **Best for:** One-to-many or many-to-many relationships where nested arrays grow infinitely (e.g. logs generated by a server).

#### Schema Projections:
\`\`\`
Embedded (One-to-Few):
{
  "_id": 1,
  "name": "Alice",
  "addresses": [
    { "type": "home", "zip": "90210" },
    { "type": "work", "zip": "10001" }
  ]
}

Referenced (One-to-Many):
[Collection: users]           [Collection: posts]
{ "_id": 1, "name": "Alice" }  { "user_id": 1, "title": "Post #1" }
                              { "user_id": 1, "title": "Post #2" }
\`\`\`

#### Quiz Questions:
1. **Which schema modeling pattern is preferred for a one-to-many relationship where nested data grows infinitely (e.g. sensor logs)?**
   *   a) Embedding (Denormalization)
   *   b) Referencing (Normalization) (Correct)
   *   c) Indexing
2. **What risk occurs if you continuously embed growing arrays inside a single document?**
   *   a) Index loss
   *   b) Hitting the 16MB BSON document size limit (Correct)
   *   c) Port limits

#### Interview Questions:
* **Explain the design rule: 'Write for reads, read for writes' in MongoDB modeling.**
  *   *Answer:* It means optimizing the schema for your application's most frequent actions. If the app reads data constantly, denormalize (embed) data to fetch everything in one read, even if it makes writes slightly more complex.
* **How do you reference documents across collections in MongoDB?**
  *   *Answer:* By storing the \`_id\` of the target document in a field of the source document (e.g., storing a \`creator_id\` field). The application joins them using \`$lookup\` or client-side queries.

#### Summary:
Embed data for fast single-read queries on static data. Use references to prevent documents from growing beyond 16MB.
            `,
            exercise: "Design schemas for a blog containing authors, posts, and comments, deciding when to embed or reference."
          },
          {
            id: "mg-l-2-2",
            title: "MongoDB Indexes: Single, Compound & Multikey",
            time: "50 min",
            summary: "B-Tree index mechanics, single field indexes, compound indexes, index sorting, and multikey indexes.",
            content: `
### MongoDB Indexing: Single, Compound & Multikey

Without indexes, MongoDB must scan **every single document** in a collection (COLLSCAN) to satisfy queries, which is slow for large collections. Indexes store a sorted subset of fields in B-Trees, enabling fast lookups (IXSCAN).

#### Index Types:
1. **Single Field Index:** Sorted index on a single field:
   \`\`\`javascript
   db.users.createIndex({ age: 1 }) // 1: Ascending, -1: Descending
   \`\`\`
2. **Compound Index:** Sorted index on multiple fields:
   \`\`\`javascript
   db.users.createIndex({ age: 1, username: -1 })
   \`\`\`
   * **Equality, Sort, Range (ESR) Rule:** Order compound index fields by Equality first, then Sort fields, and lastly Range fields.
3. **Multikey Index:** Automatically created when indexing an array field, indexing each element of the array.

#### Index Options:
* **Unique Index:** Prevents duplicate values in indexed fields.
* **Partial Index:** Indexes only documents matching a specified filter, saving space:
  \`\`\`javascript
  db.users.createIndex({ email: 1 }, { unique: true, partialFilterExpression: { email: { $exists: true } } })
  \`\`\`

#### Quiz Questions:
1. **What scanning pattern occurs if a query is run on an unindexed field in a collection containing 10 million rows?**
   *   a) Index Scan (IXSCAN)
   *   b) Collection Scan (COLLSCAN) (Correct)
   *   c) Memory Scan
2. **Which compound index field order complies with the ESR rule for query filters like '{ active: true, age: { $gt: 21 } }' sorting by 'name'?**
   *   a) { active: 1, name: 1, age: 1 } (Correct)
   *   b) { age: 1, name: 1, active: 1 }
   *   c) { name: 1, active: 1, age: 1 }

#### Interview Questions:
* **Explain how compound index prefix matching works.**
  *   *Answer:* Compound indexes can satisfy queries that match index prefixes. An index on \`{a: 1, b: 1, c: 1}\` can support queries on \`{a}\` or \`{a, b}\`, but not queries on \`{b, c}\` or \`{c}\`.
* **What is a covered query?**
  *   *Answer:* A query that can be satisfied entirely by index fields without reading actual documents from disk, yielding optimal query speeds.

#### Summary:
Indexes use B-Trees to avoid full collection scans. Design compound indexes using the ESR rule, and use partial indexes to save storage space.
            `,
            exercise: "Create a compound index on a mock sales collection optimized for queries filtering by 'category' and sorting by 'date'."
          },
          {
            id: "mg-l-2-3",
            title: "Query Profiling: Explain Plans & Index Audit",
            time: "50 min",
            summary: "Query explain() options, execution stats, COLLSCAN vs IXSCAN, and identifying slow queries.",
            content: `
### Query Profiling: Explain Plans

Auditing query performance and checking if queries use indexes requires using explain plans.

#### Using explain():
Append \`.explain()\` to queries, passing verbosity modes:
* **queryPlanner (Default):** Shows the winning plan selected by the query optimizer.
* **executionStats:** Runs the query and returns execution metrics (e.g. number of documents scanned vs returned).

#### Analyzing executionStats Output:
Key metrics to check:
* **stage:** Look for \`IXSCAN\` (Index Scan - fast) instead of \`COLLSCAN\` (Collection Scan - slow).
* **nReturned:** The number of documents returned to the client.
* **totalKeysExamined:** The number of index entries scanned.
* **totalDocsExamined:** The number of physical documents read from disk.
* **Ratio:** In an optimized query, \`totalDocsExamined / nReturned\` should be close to 1.0. If \`totalDocsExamined\` is high, the query is unindexed.

#### Explain Plan command:
\`\`\`javascript
db.users.find({ age: { $gte: 25 } }).explain("executionStats")
\`\`\`

#### Quiz Questions:
1. **Which explain mode returns runtime metrics like execution time and document scan counts?**
   *   a) queryPlanner
   *   b) executionStats (Correct)
   *   c) debugMode
2. **What does a stage value of COLLSCAN in an explain plan output indicate?**
   *   a) An index was used
   *   b) A full collection scan occurred because the query was unindexed (Correct)
   *   c) The query failed

#### Interview Questions:
* **If totalDocsExamined is 10,000 but nReturned is 1, what does this indicate?**
  *   *Answer:* It indicates a poorly optimized query. The database scanned 10,000 documents on disk to find a single match, highlighting a missing index.
* **How does the query optimizer choose a winning plan?**
  *   *Answer:* It runs candidate index plans in parallel for a trial period. The plan that completes first is selected as the winning plan and cached.

#### Summary:
Audit queries using \`.explain("executionStats")\`. IXSCAN indicates index usage; COLLSCAN indicates full collection scans that require indexing.
            `,
            exercise: "Run an explain plan on a query, check the stage and scan counts, and write down an index definition to optimize it."
          }
        ]
      }
    ]
  },
  {
    id: "mg-phase-2",
        title: "Phase 2: Aggregations, Replica Sets, Sharding, and ACID Transactions (Weeks 3–4)",
        description: "Build pipeline aggregations, join collections, profile logs, configure replication/sharding, and run ACID sessions.",
        modules: [
          {
            id: "mg-m-3",
            title: "Module 3: Aggregation Framework & Pipelines",
            duration: "1 Week",
            difficulty: "Advanced",
            objectives: [
              "Write pipeline stages using match, project, and limit operators",
              "Execute groupings, unwinds, and multi-collection joins",
              "Deploy advanced aggregation buckets and graph lookups"
            ],
            lessons: [
              {
                id: "mg-l-3-1",
                title: "Aggregation Pipeline: Match, Project & Group",
                time: "55 min",
                summary: "Data transformations, pipeline stages, $match filtering, $project reshaping, and $group calculations.",
                content: `
### Aggregation Pipeline: Match, Project & Group

For complex reports, MongoDB provides the **Aggregation Framework**. It runs a sequence of data transformation stages (a pipeline) where the output of one stage is passed as the input to the next stage.

#### Core Pipeline Stages:
1. **$match:** Filters documents, passing only matching records to the next stage (uses index if placed first).
2. **$project:** Reshapes documents (renaming fields, generating computed values).
3. **$group:** Aggregates documents based on a key and computes metrics (e.g. sums or averages).
   * Accumulator operators: \`$sum\`, \`$avg\`, \`$min\`, \`$max\`.

#### Aggregation Code Example:
\`\`\`javascript
// Calculate total revenue and average price grouped by product category
db.sales.aggregate([
  // Stage 1: Filter active sales
  { $match: { status: "completed" } },
  
  // Stage 2: Group by category and compute metrics
  { $group: {
      _id: "$category",
      totalRevenue: { $sum: { $multiply: ["$price", "$quantity"] } },
      avgPrice: { $avg: "$price" }
  } },
  
  // Stage 3: Sort by total revenue descending
  { $sort: { totalRevenue: -1 } }
]);
\`\`\`

#### Quiz Questions:
1. **What stage should be placed first in an aggregation pipeline to optimize performance and leverage indexes?**
   *   a) $group
   *   b) $match (Correct)
   *   c) $project
2. **What does the accumulator operator $sum do inside a $group stage?**
   *   a) Subtracts values
   *   b) Computes the sum of specified numeric fields across all documents in a group (Correct)
   *   c) Deletes fields

#### Interview Questions:
* **How does an aggregation pipeline differ from standard find() queries?**
  *   *Answer:* \`find()\` queries simply filter and return matching documents. Aggregation pipelines transform, group, reshape, and calculate metrics across collections, acting like data analytical processing engines.
* **Can a $project stage run calculations on document fields?**
  *   *Answer:* Yes, \`$project\` can calculate values, split strings, evaluate conditionals, and format dates using aggregation operators.

#### Summary:
Aggregations run documents through pipelines. Filter first with \`$match\` to leverage indexes, then reshape with \`$project\` and group with \`$group\`.
            `,
            exercise: "Write an aggregation pipeline that filters users active since 2026, groups them by location, and counts the active users."
          },
          {
            id: "mg-l-3-2",
            title: "Advanced Aggregations: Unwind & Joins",
            time: "50 min",
            summary: "Deconstructing arrays with $unwind, joining collections with $lookup, and subquery pipelines.",
            content: `
### Advanced Aggregations: Unwind & Joins

Advanced pipelines allow deconstructing arrays and joining collections to compile complex reports.

#### 1. $unwind Stage:
Deconstructs an array field from input documents, outputting a separate document for each element of the array:
* If a document has an array with 3 elements, \`$unwind\` outputs 3 separate documents, duplicating the other fields.

#### 2. $lookup Stage (Left Outer Joins):
Performs a join on another collection in the same database:
* **from:** Target collection to join.
* **localField:** Key field in input documents.
* **foreignField:** Key field in target documents.
* **as:** Output array field name to store the joined matches.

#### Lookup Code Example:
\`\`\`javascript
// Join user profile collection with post collection
db.users.aggregate([
  { $lookup: {
      from: "posts",
      localField: "_id",
      foreignField: "author_id",
      as: "user_posts"
  } }
]);
\`\`\`

#### Quiz Questions:
1. **What aggregation stage deconstructs an array field, outputting a separate document for each element in the array?**
   *   a) $lookup
   *   b) $unwind (Correct)
   *   c) $group
2. **What type of join does the $lookup stage perform in MongoDB?**
   *   a) Inner Join
   *   b) Left Outer Join (Correct)
   *   c) Right Join

#### Interview Questions:
* **Why can $unwind degrade database performance on large collections?**
  *   *Answer:* Because \`$unwind\` duplicates documents. If you unwind an array of 10 elements on 10,000 documents, the pipeline output increases to 100,000 documents, consuming memory. Place filters before unwinding.
* **Explain how to perform a joined lookup with custom filter conditions.**
  *   *Answer:* By passing a sub-pipeline to the \`$lookup\` stage using the \`let\` (declaring variables) and \`pipeline\` parameters, allowing complex joins.

#### Summary:
\`$unwind\` splits arrays into individual documents. \`$lookup\` performs left outer joins on collections, storing matches in an array.
            `,
            exercise: "Write a pipeline that joins a products collection with a reviews collection on product_id, unwinds the reviews, and filters for reviews rated over 4."
          }
        ]
      },
      {
        id: "mg-m-4",
        title: "Module 4: Scale, High Availability & Transactions",
        duration: "1 Week",
        difficulty: "Advanced",
        objectives: [
          "Explain Replica Sets architecture and failovers",
          "Differentiate Sharding topologies and choose Shard Keys",
          "Implement ACID multi-document transactions inside sessions"
        ],
        lessons: [
          {
            id: "mg-l-4-1",
            title: "Replication: Replica Sets & Failover",
            time: "50 min",
            summary: "Primary-Secondary nodes, oplog replication, heartbeats, automatic elections, and read/write configurations.",
            content: `
### Replication & High Availability

To protect databases against hardware failures, MongoDB uses **Replica Sets** to replicate data across multiple servers.

#### Replica Set Architecture:
A Replica Set consists of a group of nodes maintaining the same dataset:
* **Primary Node (1):** Receives all client writes. Writes changes to its data and logs them in its **oplog** (operations log).
* **Secondary Nodes (2+):** Continuously replicate the Primary's oplog and apply operations to their datasets.
* **Arbiters (Optional):** Do not store data. They participate in elections to break ties when selecting a new Primary.

#### High Availability Failover:
Nodes send heartbeats to check health. If the Primary goes offline, the remaining Secondary nodes hold an **Election** to select a new Primary automatically.

#### Quiz Questions:
1. **Which node in a Replica Set accepts client write operations?**
   *   a) Secondary Node
   *   b) Primary Node (Correct)
   *   c) Arbiter Node
2. **What does the oplog record?**
   *   a) Server CPU usage
   *   b) A rolling history of all write operations applied to the database, used for replication (Correct)
   *   c) User query histories

#### Interview Questions:
* **Explain how read preference allows scaling database reads.**
  *   *Answer:* By default, clients query the Primary node. We can configure read preferences (like \`secondary\`) to route read queries to secondary nodes, offloading read traffic from the primary, though secondary data might be slightly stale (eventual consistency).
* **How does election consensus work when a Primary goes offline?**
  *   *Answer:* Secondary nodes detect loss of heartbeats. They hold an election. A node must receive a majority of cluster votes to become the new Primary, requiring an odd number of voting members.

#### Summary:
Replica Sets ensure high availability. The Primary accepts writes, secondaries replicate the oplog, and failover elections run automatically.
            `,
            exercise: "Draft a configuration manifest establishing a three-node replica set, defining priority scales for each node."
          },
          {
            id: "mg-l-4-2",
            title: "Sharding: Horizontal Scaling & Shard Keys",
            time: "50 min",
            summary: "Sharded cluster architecture, config servers, mongos routing daemon, range vs hash partitioning, and shard key selection rules.",
            content: `
### Sharding: Horizontal Scaling

As datasets exceed the storage limits of a single server, MongoDB uses **Sharding** to distribute data across multiple servers.

#### Sharded Cluster Architecture:
1. **Shards:** Physical nodes storing a subset of the dataset.
2. **Config Servers:** Store cluster configuration metadata.
3. **Mongos Router:** A lightweight routing daemon. Clients connect to mongos, which queries config servers to route operations to the correct shards.

#### Partitioning Strategies:
* **Range-Based Sharding:** Distributes data based on ranges of the shard key. Good for range queries but can cause write hotspots if keys increment sequentially (e.g. timestamps).
* **Hashed Sharding:** Computes MD5 hashes of shard keys to distribute data evenly, preventing hotspots.

#### Quiz Questions:
1. **Which component in a sharded cluster routes client operations to the correct shards?**
   *   a) Config Server
   *   b) Mongos Router (Correct)
   *   c) Replica Set
2. **Why is using an auto-incrementing ID as a range-based shard key bad for scale?**
   *   a) It deletes indexes
   *   b) It routes all new writes to the single shard handling the maximum key range, creating a write hotspot (Correct)
   *   c) It limits database connections

#### Interview Questions:
* **What are the criteria for selecting a good Shard Key?**
  *   *Answer:* A good shard key must have high cardinality (many unique values) and balanced frequency, ensuring writes are distributed evenly across shards without creating hotspots.
* **Explain the difference between vertical scaling and sharding.**
  *   *Answer:* Vertical scaling adds CPU, RAM, or storage to a single server. Sharding (horizontal scaling) partitions the dataset and distributes write/read loads across multiple servers.

#### Summary:
Sharding partitions datasets horizontally. Clients query the mongos router, which references config servers to route calls to the correct shards.
            `,
            exercise: "Select a shard key for an e-commerce orders collection (attributes: order_id, customer_id, date, total) and justify your choice."
          },
          {
            id: "mg-l-4-3",
            title: "ACID Multi-Document Transactions",
            time: "55 min",
            summary: "Session boundaries, ACID compliance, startTransaction API, commit vs abort, and performance limits.",
            content: `
### ACID Multi-Document Transactions

While single-document updates are atomic by default, complex actions (like bank transfers) require updating multiple documents across collections, where either all writes succeed or all fail.

#### ACID Properties:
* **Atomicity:** All operations succeed, or all are rolled back.
* **Consistency:** Data remains valid according to database constraints.
* **Isolation:** Uncommitted transactions are invisible to other sessions.
* **Durability:** Committed transactions persist on disk.

#### Node.js Transaction Code Example:
\`\`\`javascript
const session = client.startSession();
try {
  session.startTransaction();
  
  // Write 1: Debit Account A
  await db.collection("accounts").updateOne(
    { _id: "A" },
    { $inc: { balance: -100 } },
    { session }
  );
  
  // Write 2: Credit Account B
  await db.collection("accounts").updateOne(
    { _id: "B" },
    { $inc: { balance: 100 } },
    { session }
  );
  
  // Commit transaction
  await session.commitTransaction();
} catch (error) {
  // Roll back all writes on error
  await session.abortTransaction();
} finally {
  session.endSession();
}
\`\`\`

#### Quiz Questions:
1. **What command rolls back all pending write operations in a transaction on error?**
   *   a) commitTransaction
   *   b) abortTransaction (Correct)
   *   c) endSession
2. **What cluster topology is required to run multi-document ACID transactions?**
   *   a) Standalone database node
   *   b) Replica Set or Sharded Cluster (Correct)
   *   c) Any topology

#### Interview Questions:
* **How does isolation behave during a running transaction?**
  *   *Answer:* Transactions use snapshot isolation. Write changes are staged in memory and are invisible to other client sessions until the transaction is committed.
* **What is the performance cost of running long transactions in MongoDB?**
  *   *Answer:* Long-running transactions hold write locks on documents, blocking other database writes and consuming server memory to track snapshot states. Keep transactions short.

#### Summary:
Multi-document transactions run inside database sessions. Use commit to apply writes or abort to roll them back on errors.
            `,
            exercise: "Write a Node.js script that updates an inventory collection and creates an order document inside an atomic transaction."
          }
        ]
      }
    ]
  }
];

export const resourcesList = [
  {
    category: "MongoDB Reference Manuals",
    items: [
      { name: "MongoDB Official Manual", desc: "Detailed references for queries, indexes, and aggregation stages.", link: "https://www.mongodb.com/docs/manual" },
      { name: "Mongoose ODM Developer Guide", desc: "How to declare schemas, validations, and query filters.", link: "https://mongoosejs.com" },
      { name: "MongoDB University Learning Portal", desc: "Interactive training paths on sharding and database scaling.", link: "https://learn.mongodb.com" }
    ]
  }
];

export const glossary = [
  { term: "BSON", def: "Binary JSON - the serialized storage format used by MongoDB supporting dates and binary data." },
  { term: "ObjectId", def: "A 12-byte unique identifier containing creation timestamps, machine hashes, and incrementing counters." },
  { term: "Write Concern", def: "Client communication settings defining execution confirmations (w:majority, j:true)." },
  { term: "COLLSCAN", def: "Collection Scan - a database query search scanning all documents due to a missing index." },
  { term: "Compound Index", def: "An index sorted on multiple different fields complying with the ESR design rule." },
  { term: "Aggregation Pipeline", def: "A sequence of data transformation stages filtering and calculating metrics." },
  { term: "Replica Set", def: "A group of nodes replicating data to ensure high availability and automatic failovers." },
  { term: "Sharding", def: "Horizontal database scaling distributing datasets across multiple shard nodes." },
  { term: "Oplog", def: "A rolling collection recording write logs used to synchronize secondary nodes in replication." },
  { term: "ACID Transaction", def: "Atomic database session updates ensuring consistency across multiple document writes." }
];
