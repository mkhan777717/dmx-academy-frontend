// Trending Tech Stack Dedicated Course Data
// Formatted for dynamic catalog consumption and lesson viewer parsing

export const allPhases = [
  {
    id: "tt-phase-1",
    title: "Phase 1: TypeScript Typing, TSConfig, and Tailwind CSS (Weeks 1–2)",
    description: "Learn static typing systems in TypeScript, generic parameter structures, TSConfig compiler flags, and Tailwind CSS layout designs.",
    modules: [
      {
        id: "tt-m-1",
        title: "Module 1: TypeScript Static Typing Systems",
        duration: "1 Week",
        difficulty: "Beginner-Intermediate",
        objectives: [
          "Differentiate dynamic JavaScript from static TypeScript",
          "Map variable types, union checks, and interfaces",
          "Develop generic functions and class structures"
        ],
        lessons: [
          {
            id: "tt-l-1-1",
            title: "Static Typing vs. Dynamic: Why TypeScript?",
            time: "40 min",
            summary: "Compile-time checks vs runtime crashes, type safety, type inference, and typing variables.",
            content: `
### Static vs. Dynamic: Why TypeScript?

JavaScript is dynamically typed. Variables can change types at runtime, which frequently leads to silent errors (e.g. calling methods on undefined values) that are hard to catch before deployment. **TypeScript** is a statically typed superset of JavaScript developed by Microsoft that catches these errors at compile-time.

#### Core Concepts:
* **Static Typing:** Type checks run during compilation, throwing errors before code runs.
* **Type Inference:** TypeScript automatically infers variable types based on initial assignments, minimizing manual type definitions.
* **Typing Variables:** Specify types using colon suffixes:
  \`\`\`typescript
  let username: string = "Alice";
  let age: number = 25;
  let isActive: boolean = true;
  \`\`\`

#### Quiz Questions:
1. **At what stage does TypeScript identify type mismatch errors?**
   *   a) Runtime
   *   b) Compile-time (Correct)
   *   c) Database query stage
2. **What does Type Inference do?**
   *   a) Deletes types at build time
   *   b) Automatically determines a variable's type based on its initial assignment (Correct)
   *   c) Converts types to strings

#### Interview Questions:
* **How does TypeScript improve application maintainability?**
  *   *Answer:* By enforcing strict types and enabling robust IDE features like autocompletion, refactoring tools, and inline documentation, which reduces bugs in large team codebases.
* **What is the difference between static and dynamic typing?**
  *   *Answer:* Static typing resolves and validates variable types at compile-time. Dynamic typing evaluates types at runtime, allowing variables to hold different data types but risking runtime crashes.

#### Summary:
TypeScript adds compile-time static type checks to JavaScript, leveraging type inference to catch bugs before execution.
            `,
            exercise: "Declare variables for a product name (string), price (number), and inStock flag (boolean), compiling them with target types."
          },
          {
            id: "tt-l-1-2",
            title: "Interfaces vs. Type Aliases",
            time: "45 min",
            summary: "Declaring object shapes, extending interfaces, intersection types, and merging declarations.",
            content: `
### Interfaces vs. Type Aliases

TypeScript uses **Interfaces** and **Type Aliases** to define the shape of objects.

#### Interfaces:
* Designed specifically to define object structures.
* Supports extending profiles using the \`extends\` keyword.
* Supports **Declaration Merging**: declaring the same interface twice merges their fields.
\`\`\`typescript
interface User {
  id: string;
  name: string;
}
interface Admin extends User {
  role: string;
}
\`\`\`

#### Type Aliases:
* Can define object shapes, primitives, unions, and tuples.
* Combines structures using intersection operators (\`&\`).
* Does not support declaration merging.
\`\`\`typescript
type Point = { x: number; y: number };
type Status = "pending" | "success";
\`\`\`

#### Quiz Questions:
1. **Which typing construct supports Declaration Merging, combining duplicate declarations?**
   *   a) Type Alias
   *   b) Interface (Correct)
   *   c) Class
2. **What operator creates an intersection type combining two Type Aliases?**
   *   a) \`|\`
   *   b) \`&\` (Correct)
   *   c) \`+\`

#### Interview Questions:
* **When should you choose an Interface over a Type Alias?**
  *   *Answer:* Use an \`interface\` when defining public API models, object shapes, or components that will be extended, as interfaces are optimized for compiler lookups. Use a \`type\` alias when defining unions, tuples, or primitive mappings.
* **Explain Declaration Merging.**
  *   *Answer:* Declaration merging occurs when TypeScript merges duplicate interface definitions with the same name into a single interface containing the fields of both declarations.

#### Summary:
Interfaces define object shapes and support inheritance. Type aliases are more flexible, defining unions and primitive mappings.
            `,
            exercise: "Write an interface for a Book model, extend it to create a DigitalBook containing a downloadUrl field, and initialize an instance."
          },
          {
            id: "tt-l-1-3",
            title: "Union Types, Literal Types & Type Guards",
            time: "45 min",
            summary: "Union operations (|), literal values locks, typeof check guards, and custom predicates.",
            content: `
### Union Types, Literal Types & Type Guards

TypeScript supports dynamic variables while maintaining safety using union types and type checking guards.

#### 1. Union Types:
Allows a variable to hold values of multiple specified types, separated by a pipe (\`|\`):
\`\`\`typescript
let id: string | number;
\`\`\`

#### 2. Literal Types:
Restricts a variable's value to a specific set of exact values:
\`\`\`typescript
let status: "active" | "inactive";
\`\`\`

#### 3. Type Guards:
JavaScript runtime checks (like \`typeof\` or \`instanceof\`) that let the TypeScript compiler infer narrower types inside block scopes:
\`\`\`typescript
function printId(id: string | number) {
  if (typeof id === "string") {
    // TypeScript knows id is a string in this block
    console.log(id.toUpperCase());
  } else {
    console.log(id * 2);
  }
}
\`\`\`

#### Quiz Questions:
1. **What operator is used to separate types inside a Union type declaration?**
   *   a) \`&\`
   *   b) \`|\` (Correct)
   *   c) \`?\`
2. **What occurs when a variable is declared with the literal type 'let theme: "dark" | "light" = "blue";'?**
   *   a) It compiles successfully
   *   b) TypeScript throws a compile-time error because "blue" is not in the allowed set of values (Correct)
   *   c) The variable becomes "dark"

#### Interview Questions:
* **What is type narrowing, and how do type guards trigger it?**
  *   *Answer:* Type narrowing is the process of resolving a broad type to a narrower type (e.g., resolving \`string | number\` to just \`string\`). Type guards (like \`typeof\`) perform runtime evaluations, letting the compiler assert types safely inside specific code branches.
* **Explain how user-defined type guards work.**
  *   *Answer:* By defining a function whose return type is a type predicate (e.g., \`pet is Dog\`), returning a boolean that narrows the parameter's type in conditional blocks.

#### Summary:
Unions support multiple types. Literals restrict values to specific sets, and Type Guards narrow types inside conditional blocks.
            `,
            exercise: "Write a function that accepts 'string | string[]' inputs, using typeof guards to handle each case."
          },
          {
            id: "tt-l-1-4",
            title: "TypeScript Generics: Reusable Types",
            time: "50 min",
            summary: "Type parameters <T>, generic function interfaces, type constraints using extends, and generic classes.",
            content: `
### TypeScript Generics: Reusable Types

Generics allow building components that work with multiple data types while maintaining strict type safety, replacing the unsafe \`any\` type.

#### Type Parameters (<T>):
A generic acts as a type placeholder variable captured when the function is called:
\`\`\`typescript
// T is a placeholder for the type passed when calling the function
function identity<T>(arg: T): T {
  return arg;
}

const value = identity<string>("Hello"); // T is bound to string
\`\`\`

#### Type Constraints:
Restrict the types allowed in a generic using the \`extends\` keyword:
\`\`\`typescript
interface HasLength { length: number }
// Restrict generic to types having a length property
function logLength<T extends HasLength>(arg: T) {
  console.log(arg.length);
}
\`\`\`

#### Quiz Questions:
1. **What is the primary benefit of using Generics instead of the 'any' type?**
   *   a) Faster execution speeds
   *   b) Preserves type safety and enables autocompletion by tracking the input type dynamically (Correct)
   *   c) Shrinks code files
2. **How do you restrict a generic type parameter T to allow only objects containing an 'id' field?**
   *   a) \`<T implements Id>\`
   *   b) \`<T extends { id: string }>\` (Correct)
   *   c) \`<T: id>\`

#### Interview Questions:
* **Explain how generic constraints work with an example.**
  *   *Answer:* Generic constraints restrict acceptable types using \`extends\`. For example, \`<T extends { id: string }>\` ensures the compiler rejects primitive types or objects missing an \`id\` field, allowing you to access \`arg.id\` safely inside the function.
* **What is a generic class, and when do you use it?**
  *   *Answer:* A class defined with type parameters (e.g. \`class Box<T>\`). Use it to build reusable data structures like lists, queues, or API wrappers that handle different data models.

#### Summary:
Generics act as type placeholders to create reusable, type-safe components. Apply constraints using \`extends\` to restrict allowed types.
            `,
            exercise: "Build a generic APIResponse interface wrapper that captures dynamic data models inside a data field."
          },
          {
            id: "tt-l-1-5",
            title: "TSConfig.json Compiler Configurations",
            time: "45 min",
            summary: "TypeScript compiler options, strict mode flags, target outputs, path mappings, and build exclusions.",
            content: `
### TSConfig.json Compiler Configurations

The \`tsconfig.json\` file specifies the root files and compiler options required to compile a TypeScript project into JavaScript.

#### Core Compiler Options:
* **target:** The target ECMAScript version for output files (e.g. \`ES2022\`, \`ESNext\`).
* **module:** Specifies the module system (e.g. \`NodeNext\`, \`ESNext\`).
* **strict:** Enables a suite of strict type-checking behaviors (including \`noImplicitAny\` and \`strictNullChecks\`), ensuring maximum type safety.
* **paths:** Configures import path aliases to avoid nested relative paths (e.g. mapping \`@/components/*\` to \`src/components/*\`).

#### TSConfig Example:
\`\`\`json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
\`\`\`

#### Quiz Questions:
1. **Which compiler option configuration enables strictNullChecks and prevents implicit any typing?**
   *   a) "strict": true (Correct)
   *   b) "verify": "strict"
   *   c) "compile": "secure"
2. **What does the 'target' option define in tsconfig.json?**
   *   a) The output file name
   *   b) The target ECMAScript version for compiled JavaScript files (Correct)
   *   c) The cloud deployment server

#### Interview Questions:
* **Why should you enable strictNullChecks in your TSConfig?**
  *   *Answer:* It ensures that \`null\` and \`undefined\` are treated as separate types. You must check for null values explicitly before accessing properties, catching null pointer errors at compile-time.
* **What is the role of esModuleInterop option?**
  *   *Answer:* It enables compatibility between CommonJS and ES Modules import syntaxes, compiling imports into compatible formats automatically.

#### Summary:
TSConfig compiles TypeScript code. Configure \`target\` outputs, enable \`strict\` checks to enforce safety, and define path aliases.
            `,
            exercise: "Write a tsconfig file configured to compile ESNext target scripts under strict type validations."
          }
        ]
      },
      {
        id: "tt-m-2",
        title: "Module 2: Tailwind CSS & Utility Layouts",
        duration: "1 Week",
        difficulty: "Beginner-Intermediate",
        objectives: [
          "Explain utility-first styles vs CSS classes",
          "Assemble responsive layouts using Flexbox and CSS Grid classes",
          "Design dark-mode layouts and state modifiers"
        ],
        lessons: [
          {
            id: "tt-l-2-1",
            title: "Tailwind CSS: Utility-First Layout Design",
            time: "45 min",
            summary: "Utility-first CSS, margin/padding utilities, responsive prefixes, hover modifiers, and custom configurations.",
            content: `
### Tailwind CSS: Utility-First Layouts

Traditional styling requires writing custom CSS classes in separate files, which leads to bloated stylesheets and naming conflicts. **Tailwind CSS** provides low-level utility classes that you apply directly inside your HTML/JSX tags.

#### Key Advantages:
* **No CSS Files:** Build complex layouts without writing a single line of custom CSS.
* **Consistency:** Utility classes match a pre-defined design system (colors, spacings, border radii).
* **Responsive Prefixes:** Apply layouts conditionally based on screen width using breakpoints: \`md:\`, \`lg:\`.

#### Code Example (React + Tailwind):
\`\`\`jsx
export default function Card() {
  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded-xl shadow-md space-y-4 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-medium text-black">Tailwind Layout</h2>
      <p className="text-gray-500">Utility-first design patterns.</p>
    </div>
  );
}
\`\`\`

#### Quiz Questions:
1. **What is the utility-first design pattern of Tailwind CSS?**
   *   a) Writing CSS rules in styling files
   *   b) Applying pre-defined utility classes directly inside markup tags (Correct)
   *   c) Compressing images
2. **Which class centers a container horizontally in Tailwind?**
   *   a) align-center
   *   b) mx-auto (Correct)
   *   c) items-center

#### Interview Questions:
* **Why does a utility-first CSS framework reduce bundle sizes in production?**
  *   *Answer:* Tailwind uses **PurgeCSS** during compilation. It scans your code files, identifies the utility classes used, and deletes unused styles. The final production CSS bundle is tiny, typically under 10KB.
* **Explain how Tailwind handles hover and focus states.**
  *   *Answer:* By prefixing classes with state modifiers (e.g. \`hover:bg-blue-600\`, \`focus:outline-none\`). Tailwind applies these classes only when the elements enter those states.

#### Summary:
Tailwind uses utility classes applied directly in markup tags, optimizing production bundles by deleting unused classes.
            `,
            exercise: "Build a responsive profile card containing margins, paddings, rounded corners, and shadow hover effects."
          }
        ]
      }
    ]
  },
  {
    id: "tt-phase-2",
    title: "Phase 2: GraphQL APIs, Resolvers, and Rust Programming Basics (Weeks 3–4)",
    description: "Learn GraphQL schemas, resolvers, Apollo client connections, Rust memory ownership checks, and WebAssembly builds.",
    modules: [
      {
        id: "tt-m-3",
        title: "Module 3: GraphQL APIs & Apollo Client",
        duration: "1 Week",
        difficulty: "Advanced",
        objectives: [
          "Differentiate REST APIs from GraphQL architectures",
          "Declare schema types, query properties, and mutations",
          "Develop GraphQL resolvers on Node.js backends",
          "Consume GraphQL queries using Apollo client hooks"
        ],
        lessons: [
          {
            id: "tt-l-3-1",
            title: "REST vs. GraphQL: Queries Architecture",
            time: "50 min",
            summary: "Single endpoint API, resolving under-fetching/over-fetching, types, schemas, and queries layouts.",
            content: `
### REST vs. GraphQL: Queries Architecture

Traditional REST APIs require hitting multiple endpoints (e.g. \`/users\`, \`/posts\`) to fetch data, returning fixed payloads that contain unnecessary fields.

#### Core GraphQL Advancements:
* **Single Endpoint:** Queries target a single endpoint (typically \`/graphql\`) using HTTP POST.
* **Client-Specified Payloads:** Clients query exactly the fields they need, eliminating **over-fetching** (returning unneeded fields) and **under-fetching** (requiring multiple queries to fetch related data).
* **Strongly Typed Schema:** Defined using Schema Definition Language (SDL), mapping objects and fields.

#### GraphQL Query Example:
\`\`\`graphql
# Request only username and email of user 1024
query GetUser {
  user(id: "1024") {
    username
    email
  }
}
\`\`\`

#### Quiz Questions:
1. **What problem does GraphQL solve by allowing clients to specify exact query fields?**
   *   a) Database query locks
   *   b) Under-fetching and Over-fetching data payloads (Correct)
   *   c) CPU memory leaks
2. **How many URL endpoints do clients query in a standard GraphQL API?**
   *   a) Multiple path endpoints
   *   b) A single endpoint (usually /graphql) (Correct)
   *   c) None

#### Interview Questions:
* **Explain how GraphQL resolves the under-fetching problem of REST.**
  *   *Answer:* In REST, fetching a user and their posts requires querying \`/users/:id\`, then querying \`/users/:id/posts\`. GraphQL resolves this in a single query by nesting relations: \`user(id: 1) { name posts { title } }\`.
* **What is Schema Definition Language (SDL)?**
  *   *Answer:* The strongly typed schema syntax used by GraphQL to declare object types, query inputs, and mutations, aligning API contracts.

#### Summary:
GraphQL uses a single endpoint. Clients query the exact fields they need, resolving under-fetching and over-fetching issues.
            `,
            exercise: "Write a GraphQL query that requests a list of products, showing only the title and price of each."
          },
          {
            id: "tt-l-3-2",
            title: "GraphQL Schemas, Queries & Mutations",
            time: "50 min",
            summary: "Type definitions, Query fields, Mutation updates, and input parameters validation.",
            content: `
### Schemas, Queries & Mutations

Designing GraphQL APIs requires defining schemas, read queries, and write mutations.

#### Schema Components:
1. **Types:** Define object structures and fields:
   \`\`\`graphql
   type Product {
     id: ID!
     title: String!
     price: Float
   }
   \`\`\`
   * The exclamation mark \`!\` indicates the field is non-nullable.
2. **Query:** Defines read operations:
   \`\`\`graphql
   type Query {
     getProduct(id: ID!): Product
   }
   \`\`\`
3. **Mutation:** Defines write operations (creates, updates, deletes):
   \`\`\`graphql
   type Mutation {
     createProduct(title: String!, price: Float!): Product!
   }
   \`\`\`

#### Quiz Questions:
1. **What does the exclamation mark (!) represent on a GraphQL type field?**
   *   a) The field is optional
   *   b) The field is non-nullable (cannot return null) (Correct)
   *   c) The field is a key
2. **Which GraphQL type manages data write operations (creates, updates, deletes)?**
   *   a) Query
   *   b) Mutation (Correct)
   *   c) Resolver

#### Interview Questions:
* **How do mutations differ from queries in GraphQL?**
  *   *Answer:* Queries are read-only operations that can run in parallel. Mutations are write operations that run sequentially to prevent database race conditions and state conflicts.
* **What is the ID type in GraphQL?**
  *   *Answer:* A unique identifier type that compiles to a string, indicating the value is not intended to be human-readable (analogous to MongoDB ObjectIds).

#### Summary:
Define schemas using non-nullable indicators (\`!\`). Queries fetch data; Mutations modify data.
            `,
            exercise: "Write a mutation schema that registers a user, requiring username and email inputs."
          },
          {
            id: "tt-l-3-3",
            title: "GraphQL Resolvers on Node.js Backends",
            time: "50 min",
            summary: "Writing resolver functions, context parameters, parent objects, and querying databases.",
            content: `
### GraphQL Resolvers

GraphQL schemas define contracts. **Resolvers** are the backend functions that execute database queries to return actual data matching those contracts.

#### Resolver Signature:
A resolver function accepts four arguments: \`(parent, args, context, info)\`:
* **parent:** The return value of the previous resolver in the execution chain.
* **args:** Input arguments passed in the query (e.g. \`id\`).
* **context:** Shared context state (e.g. database connections, user authentication states).

#### Resolver Code Example:
\`\`\`javascript
const resolvers = {
  Query: {
    // Resolver matching getProduct query
    getProduct: async (parent, { id }, { db }) => {
      // Query database directly
      const product = await db.Product.findById(id);
      return product;
    }
  },
  Mutation: {
    createProduct: async (parent, { title, price }, { db }) => {
      const newProduct = new db.Product({ title, price });
      return await newProduct.save();
    }
  }
};
\`\`\`

#### Quiz Questions:
1. **What parameter in a resolver function holds the user authentication state or database connection?**
   *   a) parent
   *   b) context (Correct)
   *   c) args
2. **What occurs if a resolver function throws an error during execution?**
   *   a) The entire server crashes
   *   b) GraphQL returns the error inside an 'errors' array in the response JSON payload (Correct)
   *   c) The API returns status 404

#### Interview Questions:
* **How does GraphQL execute resolvers for nested queries?**
  *   *Answer:* It uses a resolver execution tree. If a query requests a user and their posts, the query engine calls the \`user\` resolver first, then calls the nested \`posts\` resolver, passing the resolved user object as the \`parent\` argument.
* **What is the N+1 query problem in GraphQL, and how do you resolve it?**
  *   *Answer:* It occurs when fetching list relations (e.g. fetching 100 posts, then running a separate query for each post's author, generating 101 queries). Resolve it by batching queries using **DataLoader** libraries.

#### Summary:
Resolvers fetch data matching schema contracts. Access parameters using \`args\` and database connections using the \`context\` object.
            `,
            exercise: "Write a resolver function matching a getProduct query, searching a mock array of items."
          }
        ]
      },
      {
        id: "tt-m-4",
        title: "Module 4: Rust Systems Programming Basics",
        duration: "1 Week",
        difficulty: "Advanced",
        objectives: [
          "Explain Rust ownership, borrowing, and lifetimes rules",
          "Construct structs, enums, and match patterns",
          "Apply Result and Option error handling enums",
          "Compile Rust code to WebAssembly binaries"
        ],
        lessons: [
          {
            id: "tt-l-4-1",
            title: "Rust Core: Variables, Cargo Tooling & Memory",
            time: "45 min",
            summary: "Rust compiler safety, Cargo CLI tooling, variables immutability, and basic data types.",
            content: `
### Rust Core: Variables & Memory Safety

Rust is a systems programming language developed by Mozilla, designed for performance and memory safety without a garbage collector.

#### Cargo CLI:
Rust's built-in package manager and build system:
* \`cargo new app_name\`: Initializes a new workspace.
* \`cargo build\`: Compiles the application.
* \`cargo run\`: Compiles and runs the binary.

#### Variables Mutability:
By default, variables in Rust are **immutable** (cannot change values). To allow changes, add the \`mut\` modifier:
\`\`\`rust
fn main() {
    let x = 5; // Immutable
    // x = 6; // Throws compile error!
    
    let mut y = 10; // Mutable
    y = 15;
    println!("y: {}", y);
}
\`\`\`

#### Quiz Questions:
1. **What is the default state of variables in Rust if no modifiers are declared?**
   *   a) Mutable
   *   b) Immutable (Correct)
   *   c) Nullable
2. **What Cargo CLI command compiles and runs a Rust binary project?**
   *   a) cargo run (Correct)
   *   b) cargo build
   *   c) cargo compile

#### Interview Questions:
* **How does Rust guarantee memory safety without a garbage collector?**
  *   *Answer:* Through its **Ownership** model. The compiler enforces strict rules tracking value scopes, freeing memory automatically when variables go out of scope, eliminating memory leaks and segmentation faults.
* **Why are variables immutable by default?**
  *   *Answer:* Immutability prevents state conflicts, simplifies debugging, and allows compiler optimizations (like sharing references across threads safely).

#### Summary:
Rust enforces immutability by default (override with \`mut\`). Use Cargo to initialize, build, and run applications.
            `,
            exercise: "Write a Rust main function declaring an immutable integer and a mutable float, updating the float."
          },
          {
            id: "tt-l-4-2",
            title: "Ownership, Borrowing & Lifetimes",
            time: "55 min",
            summary: "Rust ownership rules, stack vs heap allocation, reference borrowing (&), and mutable vs immutable borrow limits.",
            content: `
### Rust Ownership & Borrowing

The core foundation of Rust's safety model is built on ownership, borrowing, and references.

#### The Three Ownership Rules:
1. Each value in Rust has an **owner** variable.
2. There can be only **one owner** at a time.
3. When the owner goes out of scope, the value is automatically dropped.

#### Borrowing (&):
To avoid copying data, pass a reference using the ampersand (\`&\`):
* **Immutable Borrow (\`&T\`):** Multiple references can read the value simultaneously.
* **Mutable Borrow (\`&mut T\`):** Only a **single** mutable reference can write to the value at any time, preventing data races.
* **Rule:** You cannot have a mutable reference while any active immutable references exist.

#### Borrowing Example:
\`\`\`rust
fn main() {
    let mut s1 = String::from("hello");
    
    // Borrow s1 as mutable reference
    change_string(&mut s1);
    println!("String: {}", s1);
}

fn change_string(some_string: &mut String) {
    some_string.push_str(", world");
}
\`\`\`

#### Quiz Questions:
1. **How many mutable references can exist for a variable at any time?**
   *   a) Unconstrained
   *   b) Exactly one (Correct)
   *   c) Two
2. **What occurs when the owner of a variable goes out of scope?**
   *   a) The value is leaked in memory
   *   b) The value is automatically dropped and memory is freed (Correct)
   *   c) The compiler hangs

#### Interview Questions:
* **What is a data race, and how does Rust's borrowing compiler check prevent it?**
  *   *Answer:* A data race occurs when multiple threads attempt to read and write to the same memory space concurrently. Rust prevents this by ensuring that if a mutable reference exists, no other references (mutable or immutable) can access that variable.
* **What occurs to ownership when passing a variable to a function?**
  *   *Answer:* For heap-allocated variables (like Strings), ownership **moves** to the function parameter. Accessing the variable in the caller afterwards triggers a compile-time error. Pass references instead to borrow the value.

#### Summary:
Rust enforces one owner per value. Borrow values using references, allowing multiple reads or a single write, preventing concurrent data races.
            `,
            exercise: "Write a Rust function that accepts an immutable reference to a String, prints its length, and leaves ownership intact."
          },
          {
            id: "tt-l-4-3",
            title: "Structs, Enums & Pattern Matching",
            time: "50 min",
            summary: "Rust Struct definitions, custom Enums, Option enum checks, Result error handling, and match routing blocks.",
            content: `
### Structs, Enums & Pattern Matching

Rust uses Structs to define custom data shapes and Enums to define variants.

#### 1. Structs:
Define custom data models:
\`\`\`rust
struct Product {
    name: String,
    price: f64,
}
\`\`\`

#### 2. Enums & Pattern Matching (match):
Enums represent a set of variants. The \`match\` control flow block compares value variants statically, forcing you to handle all cases:
\`\`\`rust
enum Status {
    Pending,
    Success,
    Failed,
}

fn handle_status(status: Status) {
    match status {
        Status::Pending => println!("Pending..."),
        Status::Success => println!("Success!"),
        Status::Failed => println!("Failed!"),
    }
}
\`\`\`

#### 3. Option and Result:
Rust does not have a \`null\` value. Instead, it uses built-in enums:
* **Option<T>:** Either \`Some(T)\` (contains value) or \`None\` (missing value).
* **Result<T, E>:** Either \`Ok(T)\` (success) or \`Err(E)\` (error).

#### Quiz Questions:
1. **How does Rust handle missing values without a null primitive type?**
   *   a) By using fallback zeros
   *   b) By wrapping values in the Option<T> enum, resolving to Some(T) or None (Correct)
   *   c) Using exception throws
2. **What does the match control flow block do?**
   *   a) Compiles files
   *   b) Routes execution based on pattern matching, forcing you to handle all enum cases exhaustively (Correct)
   *   c) Deletes structures

#### Interview Questions:
* **Why is match exhaustive in Rust?**
  *   *Answer:* The compiler checks that you handle all possible variants of an enum in a \`match\` block. If you miss a variant, the code fails to compile, preventing unhandled runtime states.
* **Explain how Result<T, E> handles runtime errors.**
  *   *Answer:* It returns either \`Ok(value)\` or \`Err(error)\`. The caller must inspect the result using pattern matching or helpers like \`unwrap()\` or \`?\` to handle errors.

#### Summary:
Structs define objects; Enums list variants. Option handles missing values, and Result handles errors. Use \`match\` to route execution safely.
            `,
            exercise: "Write a match block that checks an Option<int> variable, printing its value if present or a missing warning."
          },
          {
            id: "tt-l-4-4",
            title: "Compiling Rust to WebAssembly (Wasm)",
            time: "50 min",
            summary: "WebAssembly binary format, wasm-bindgen compiler, exporting functions, and loading Wasm inside browsers.",
            content: `
### Compiling Rust to WebAssembly (Wasm)

WebAssembly (Wasm) is a low-level binary format that runs inside modern web browsers at near-native speeds. It allows running compiled languages (like Rust or C++) in the browser.

#### Wasm Compilation Flow:
1. **Write Rust:** Write functions using the \`wasm-bindgen\` attribute to expose them to JavaScript.
2. **Compile to Wasm:** Compile code using **wasm-pack**:
   \`\`\`bash
   wasm-pack build --target web
   \`\`\`
   This generates a \`.wasm\` binary file and a JavaScript wrapper folder.
3. **Load in Browser:** Import the wrapper folder into your JavaScript files to execute compiled Rust functions directly.

#### Rust Wasm Code Example:
\`\`\`rust
use wasm_bindgen::prelude::*;

// Expose function to JavaScript
#[wasm_bindgen]
pub fn fibonacci(n: u32) -> u32 {
    if n <= 1 { return n; }
    fibonacci(n - 1) + fibonacci(n - 2)
}
\`\`\`

#### Quiz Questions:
1. **What is WebAssembly (Wasm)?**
   *   a) A CSS utility
   *   b) A low-level binary format that runs inside modern browsers at near-native speeds (Correct)
   *   c) A cloud hosting platform
2. **Which command line tool compiles Rust projects into WebAssembly packages?**
   *   a) cargo run
   *   b) wasm-pack build (Correct)
   *   c) npm run compile

#### Interview Questions:
* **How does WebAssembly improve performance in browsers?**
  *   *Answer:* JavaScript must be parsed, compiled, and optimized by browser engines. WebAssembly is a pre-compiled binary format that executes directly on the browser sandbox at near-native speeds, optimizing CPU-heavy tasks like image processing or 3D games.
* **What is the role of wasm-bindgen?**
  *   *Answer:* It generates the JavaScript wrappers needed to translate calls between JS objects and Wasm binary memory spaces.

#### Summary:
WebAssembly runs compiled code in browsers. Write Rust functions with \`#[wasm_bindgen]\`, compile them with \`wasm-pack\`, and load them inside JS.
            `,
            exercise: "Write a compiled Rust function that multiplies two numbers, detailing the wasm-pack build output files."
          }
        ]
      }
    ]
  }
];

export const resourcesList = [
  {
    category: "Trending Tech Manuals",
    items: [
      { name: "TypeScript Handbook Guide", desc: "Detailed references on types, generics, and tsconfig settings.", link: "https://www.typescriptlang.org/docs" },
      { name: "Tailwind CSS Layout Guidelines", desc: "Utility classes, breakpoints prefixes, and custom variables.", link: "https://tailwindcss.com/docs" },
      { name: "GraphQL Official Specifications", desc: "API contracts schemas, queries layouts, and mutations.", link: "https://graphql.org" },
      { name: "The Rust Programming Language Book", desc: "The definitive guide on ownership rules, borrowing references, and cargo.", link: "https://doc.rust-lang.org/book" }
    ]
  }
];

export const glossary = [
  { term: "Type Inference", def: "TypeScript compile step automatically resolving a variable's type from its initial assignment." },
  { term: "Sound Null Safety", def: "Dart compile guarantee preventing variable runtime null pointer crashes unless marked nullable." },
  { term: "Declaration Merging", def: "Merging duplicate interfaces with the same name into a single interface definition." },
  { term: "TypeScript Generic", def: "A type parameter placeholder <T> enabling reusable, type-safe components." },
  { term: "PurgeCSS utility", def: "Tailwind build cleanup step scanning files to delete unused styling classes, shrinking bundles." },
  { term: "Over-fetching", def: "REST API bottleneck where endpoints return unnecessary fields in payloads." },
  { term: "GraphQL Resolver", def: "Backend resolver functions executing database queries to return data matching schemas." },
  { term: "Rust Ownership", def: "Memory safety rules enforcing one owner per value to drop memory automatically on scope exits." },
  { term: "Data Race", def: "Concurrent thread conflicts reading/writing the same memory space, blocked by Rust borrowing rules." },
  { term: "WebAssembly", def: "Low-level binary format executing compiled code in browser sandboxes at near-native speeds." }
];
