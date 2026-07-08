// Next.js App Router Complete Course Data
// Formatted for dynamic catalog consumption and lesson viewer parsing

export const allPhases = [
  {
    id: "nx-phase-1",
    title: "Phase 1: App Router, Server Components & Routing Systems (Weeks 1–2)",
    description: "Learn Next.js App Router layout designs, Server Components (RSC) vs Client Components (RCC), and parallel/intercepting routing mechanisms.",
    modules: [
      {
        id: "nx-m-1",
        title: "Module 1: Next.js Architecture & Basic Routing",
        duration: "1 Week",
        difficulty: "Beginner-Intermediate",
        objectives: [
          "Differentiate Server Components from Client Components",
          "Map nested layouts, page routes, and dynamic URL paths",
          "Configure error and loading boundaries"
        ],
        lessons: [
          {
            id: "nx-l-1-1",
            title: "App Router Architecture: RSC vs RCC",
            time: "45 min",
            summary: "React Server Components, Client Components, server-first data compilation, and the client boundary 'use client'.",
            content: `
### App Router Architecture: RSC vs. RCC

Next.js introduces the **App Router**, a layout-first routing system that leverages React's new hybrid rendering architecture: **React Server Components (RSC)** and **Client Components (RCC)**.

#### Core Architectural Differences:
1. **React Server Components (RSC - Default):**
   * Render entirely on the backend server.
   * Zero impact on client-side JS bundle size (dependencies are not sent to the browser).
   * Direct access to backend resources (databases, secure APIs).
   * Cannot use client-side features like state (\`useState\`), effects (\`useEffect\`), or browser APIs.
2. **Client Components (RCC):**
   * Pre-rendered on the server, but hydrated and interactive in the browser.
   * Declared by writing the \`"use client"\` directive at the very top of the file.
   * Can use React Hooks (\`useState\`, \`useEffect\`) and interactive event listeners.

#### Component Nesting & Composition:
You can import Client Components into Server Components. However, you cannot import Server Components directly into Client Components. Instead, pass the Server Component as a child (\`children\` prop) of the Client Component.

#### Quiz Questions:
1. **Which component type is the default inside the Next.js App Router?**
   *   a) Client Component
   *   b) Server Component (Correct)
   *   c) Dynamic Component
2. **How do you declare a file as a Client Component in Next.js?**
   *   a) Name the file page.client.jsx
   *   b) Add the string 'use client' at the very top of the file before imports (Correct)
   *   c) Set the export target config

#### Interview Questions:
* **Why does Next.js use Server Components by default?**
  *   *Answer:* To optimize loading performance. Server Components execute database queries on the server and render HTML directly. The browser receives static HTML instead of heavy JS bundles, resulting in faster First Contentful Paint (FCP).
* **Explain how data leakage is prevented inside Server Components.**
  *   *Answer:* Since Server Components run only on the server, private API keys, database credentials, and internal queries never reach the browser bundle.

#### Summary:
Server Components execute on the server, keeping JS bundles small. Client Components require the 'use client' directive to support interactivity and hooks.
            `,
            exercise: "Draft a component structure containing a Server Component layout that imports a Client Component button."
          },
          {
            id: "nx-l-1-2",
            title: "Nested Layouts & Dynamic Routes",
            time: "45 min",
            summary: "Folder layouts configurations, page.js, layout.js, template.js, and dynamic parameters mappings.",
            content: `
### Nested Layouts & Dynamic Routes

The Next.js App Router uses a folder-based routing system.

#### Folder Mapping Rules:
* **Folders:** Define route segments (e.g. \`app/dashboard/settings/\` maps to \`/dashboard/settings\`).
* **page.js:** Special file that outputs the public UI.
* **layout.js:** A wrapper layout that shares UI across nested child pages (e.g. sidebars). Layouts do not re-render when changing child routes.
* **template.js:** Similar to layouts, but creates a clean instance on every navigation, re-running effects and resetting state.

#### Dynamic Routes:
Expressed using brackets: \`app/blog/[id]/page.js\` maps to \`/blog/:id\`. Next.js passes URL parameter values to the page props:
\`\`\`javascript
export default async function BlogPostPage({ params }) {
  // Sync resolve params in App Router:
  const { id } = await params;
  return <h1>Reading blog post: {id}</h1>;
}
\`\`\`

#### Quiz Questions:
1. **Which special file is used to declare shared interface components like sidebars that persist across route shifts without re-rendering?**
   *   a) page.js
   *   b) layout.js (Correct)
   *   c) template.js
2. **How do you define a dynamic route segment matching '/courses/:id' in Next.js?**
   *   a) \`app/courses/:id/page.js\`
   *   b) \`app/courses/[id]/page.js\` (Correct)
   *   c) \`app/courses/{id}/page.js\`

#### Interview Questions:
* **How do layouts differ from templates?**
  *   *Answer:* Layouts persist and do not re-render during child route changes, preserving state and scroll positions. Templates create a new instance on every navigation, re-running effects and resetting states.
* **What are route groups in Next.js, and how do you define them?**
  *   *Answer:* Route groups allow organizing folders without affecting URL paths. They are defined by wrapping the folder name in parentheses (e.g. \`app/(auth)/login/page.js\` maps directly to \`/login\`).

#### Summary:
Folders define URL segments. Page.js renders views, layout.js wraps paths, and brackets \`[id]\` capture dynamic URL parameters.
            `,
            exercise: "Create a folder layout simulating 'app/shop/[category]/page.js' that reads and prints the dynamic category parameter."
          },
          {
            id: "nx-l-1-3",
            title: "Dynamic Segment Catch-All & Optional Params",
            time: "40 min",
            summary: "Catch-all routes [...slug], optional catch-all [[...slug]], and parsing segment arrays.",
            content: `
### Catch-All & Optional Dynamic Routes

Next.js provides catch-all segments to match nested paths of arbitrary length in a single file.

#### 1. Catch-All Routes (\`[...slug]\`):
Matches the parent path and any nested segments.
* Path \`app/docs/[...slug]/page.js\` matches:
  * \`/docs/intro\` (params: \`{ slug: ['intro'] }\`)
  * \`/docs/setup/install\` (params: \`{ slug: ['setup', 'install'] }\`)
  * Does NOT match root path \`/docs\` (yields 404).

#### 2. Optional Catch-All Routes (\`[[...slug]]\`):
Matches the parent path, nested segments, **and** the root path itself:
* Path \`app/docs/[[...slug]]/page.js\` matches:
  * \`/docs\` (params: \`{ slug: undefined }\` or missing)
  * \`/docs/intro\` (params: \`{ slug: ['intro'] }\`)

#### Quiz Questions:
1. **Which route configuration matches '/docs/setup/install' and also matches '/docs' without throwing a 404?**
   *   a) \`app/docs/[slug]/page.js\`
   *   b) \`app/docs/[[...slug]]/page.js\` (Optional Catch-All) (Correct)
   *   c) \`app/docs/[...slug]/page.js\`
2. **What data structure represents dynamic parameters in a catch-all route page?**
   *   a) String
   *   b) Array of strings (Correct)
   *   c) Number

#### Interview Questions:
* **When would you use an optional catch-all route?**
  *   *Answer:* When building documentation sites or content management systems where the landing page (\`/docs\`) and all nested sub-topics (\`/docs/install/linux\`) are handled by the same page component.
* **Explain how parameters differ between [...slug] and [[...slug]] on the root path.**
  *   *Answer:* For \`[...slug]\`, the root path returns a 404 error. For \`[[...slug]]\`, the root path matches successfully, passing an undefined or empty params object.

#### Summary:
Catch-all routes (\`[...slug]\`) capture nested paths as array lists. Optional catch-all routes (\`[[...slug]]\`) match root paths as well.
            `,
            exercise: "Write a page component for an optional catch-all path that prints all directory segments as list elements."
          },
          {
            id: "nx-l-1-4",
            title: "Parallel Routes (@folder) & Intercepted Routes",
            time: "50 min",
            summary: "Parallel route slots, layout integrations, default.js fallbacks, and modal interceptions.",
            content: `
### Parallel & Intercepted Routes

Advanced routing patterns support complex UI designs like dashboards with multiple dashboards widgets or modal overlays that preserve background page state.

#### 1. Parallel Routes (\`@folder\`):
Allows rendering multiple pages simultaneously in the same layout:
* Slots are defined using folders prefixed with \`@\` (e.g. \`@analytics\`, \`@team\`).
* The parent layout receives these slots as props alongside \`children\`:
  \`\`\`javascript
  export default function Layout({ children, analytics, team }) {
    return (
      <div>
        {children}
        <div>{analytics}</div>
        <div>{team}</div>
      </div>
    );
  }
  \`\`\`

#### 2. Intercepted Routes (\`(.)route\`):
Intercepts a route from another folder, rendering it inside the current layout (e.g., displaying a photo modal while keeping the underlying feed visible).
* \`(.)\` matches segments on the same level.
* \`(..)\` matches segments one level above.

#### Quiz Questions:
1. **How do you declare a parallel route slot in Next.js?**
   *   a) Wrap the folder name in parentheses \`(analytics)\`
   *   b) Prefix the folder name with an at-sign \`@analytics\` (Correct)
   *   c) Name the file slot.js
2. **Which matcher intercepts a route segment on the same level in the file system?**
   *   a) \`(..)\`
   *   b) \`(.)\` (Correct)
   *   c) \`(...)\`

#### Interview Questions:
* **What is the purpose of default.js in parallel routing?**
  *   *Answer:* Next.js uses \`default.js\` as a fallback UI when a slot's route cannot be resolved during page refreshes, preventing rendering errors.
* **Explain how intercepted routes improve UX in photo sharing feeds.**
  *   *Answer:* When a user clicks a photo, Next.js intercepts the route and displays it in a modal overlay, preserving the feed background and updating the browser URL. Sharing the URL loads the photo page directly, skipping the feed overlay.

#### Summary:
Parallel routes (@folder) render multiple slots in one layout. Intercepted routes render modals while keeping background states intact.
            `,
            exercise: "Write a layout mapping children and @modal slots, declaring a default.js file for the modal."
          },
          {
            id: "nx-l-1-5",
            title: "Special Files: loading.js, error.js & not-found.js",
            time: "45 min",
            summary: "Suspense boundaries, loading states, error boundaries, recovery resets, and custom 404 pages.",
            content: `
### Special Layout Files: loading, error & not-found

Next.js provides built-in boundaries to handle loading indicators, runtime crashes, and missing routes automatically.

#### Special Files:
1. **loading.js:** Wraps nested pages in a React **Suspense** boundary automatically, displaying fallback indicators (like skeletons) during server data fetching.
2. **error.js:** Wraps pages in a React **Error Boundary**. It must be a Client Component (\`"use client"\`) and receives \`error\` and \`reset\` props:
   * \`reset\`: A callback function to attempt to recover by re-rendering the component.
3. **not-found.js:** Custom 404 page triggered when a page does not exist or when \`notFound()\` is called in code.

#### Error Boundary Example:
\`\`\`javascript
"use client";

export default function ErrorBoundary({ error, reset }) {
  return (
    <div className="card">
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
\`\`\`

#### Quiz Questions:
1. **Which file must be declared as a Client Component ('use client') in Next.js?**
   *   a) loading.js
   *   b) error.js (Correct)
   *   c) layout.js
2. **What React mechanism is used under the hood to implement loading.js fallbacks?**
   *   a) Redux
   *   b) React Suspense (Correct)
   *   c) Hooks

#### Interview Questions:
* **How does the reset() callback function work in error.js?**
  *   *Answer:* It attempts to re-render the error boundary's contents. If the error was temporary (e.g. network glitch), re-rendering resolves the issue and restores the UI without page refreshes.
* **Why must error.js be a Client Component?**
  *   *Answer:* Because it must handle runtime errors and user interactions (like clicking 'try again' buttons) which require browser APIs and React hooks.

#### Summary:
Use loading.js for Suspense loading indicators, error.js (Client Component) to handle crashes, and not-found.js to render custom 404 UIs.
            `,
            exercise: "Write an error.js boundary file containing a retry button, logging errors to the console."
          }
        ]
      },
      {
        id: "nx-m-2",
        title: "Module 2: Data Fetching, Caching & Server Actions",
        duration: "1 Week",
        difficulty: "Intermediate",
        objectives: [
          "Fetch API endpoints directly in async Server Components",
          "Apply cache flags and configure Incremental Static Revalidation (ISR)",
          "Compare static rendering to dynamic server rendering",
          "Write secure server actions to modify database states"
        ],
        lessons: [
          {
            id: "nx-l-2-1",
            title: "Data Fetching in Server Components",
            time: "50 min",
            summary: "Async/await data retrieval, fetching in RSC, eliminating API routes, and running sequential vs parallel queries.",
            content: `
### Data Fetching in Server Components

Next.js simplifies data fetching by allowing you to make async API calls directly inside Server Components.

#### Direct Data Fetching:
In Next.js, Server Components can be declared as \`async\`. This allows using \`await\` to fetch data from databases or external APIs directly inside the component body:
\`\`\`javascript
export default async function Page() {
  // Fetch directly from database or API
  const res = await fetch("https://api.example.com/products");
  const products = await res.json();

  return (
    <ul>
      {products.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}
\`\`\`
This eliminates the need for separate API routes or state hooks to load page data.

#### Quiz Questions:
1. **Can a React Server Component be declared as an async function?**
   *   a) No, components must be synchronous
   *   b) Yes, allowing direct use of await for fetching data inside the component body (Correct)
   *   c) Only if it runs in the browser
2. **What type of data calls can run inside RSC?**
   *   a) Only HTTP fetch queries
   *   b) Direct SQL database queries, filesystem reads, and HTTP fetch requests (Correct)
   *   c) Only local states

#### Interview Questions:
* **How do you execute parallel data fetching to prevent loading bottlenecks?**
  *   *Answer:* By triggering all database queries simultaneously using \`Promise.all([query1(), query2()])\`, rather than awaiting them sequentially.
* **Why does fetching data directly inside RSC improve performance?**
  *   *Answer:* It runs database queries directly on the server, eliminating network roundtrips between the client browser and the server.

#### Summary:
Server Components support async data fetching. Fetch data directly from databases or secure APIs inside the component.
            `,
            exercise: "Write an async page component that queries a mock API and maps titles into bullet list items."
          },
          {
            id: "nx-l-2-2",
            title: "Data Caching & Revalidation (ISR)",
            time: "55 min",
            summary: "Next.js fetch cache, time-based revalidation, tag-based revalidation, and revalidateTag API.",
            content: `
### Next.js Caching & Revalidation

Next.js extends the browser \`fetch\` API to support data caching and revalidation.

#### Caching Strategies:
* **Force Cache (Default):** Next.js caches the fetch response indefinitely.
* **Time-Based Revalidation:** Revalidates cached data after a set period of time (useful for stock values):
  \`\`\`javascript
  fetch("https://api.com", { next: { revalidate: 3600 } }) // Revalidate hourly
  \`\`\`
* **Tag-Based Revalidation:** Revalidates cached data on demand using tags (useful for product catalogues):
  \`\`\`javascript
  fetch("https://api.com", { next: { tags: ["products"] } })
  \`\`\`
  Trigger revalidation in code: \`revalidateTag("products")\`.

#### Quiz Questions:
1. **Which revalidation type updates cached data dynamically on demand when trigger tags change?**
   *   a) Time-based revalidation
   *   b) Tag-based revalidation (Correct)
   *   c) Static pre-rendering
2. **What Next.js fetch configuration caches data indefinitely?**
   *   a) { cache: 'no-store' }
   *   b) { cache: 'force-cache' } (or default) (Correct)
   *   c) { revalidate: 0 }

#### Interview Questions:
* **How does Incremental Static Revalidation (ISR) work?**
  *   *Answer:* ISR allows pre-rendering static pages, while updating them in the background after a configured time interval has elapsed, keeping pages static but fresh.
* **Explain how revalidatePath() differs from revalidateTag().**
  *   *Answer:* \`revalidatePath()\` updates all cached fetches on a specific page URL path. \`revalidateTag()\` updates only fetches tagged with a specific tag key across all paths.

#### Summary:
Configure caching using fetch flags. Revalidate cached data after a set time or on demand using tags and paths.
            `,
            exercise: "Write a fetch statement with time-based revalidation set to 60 seconds."
          },
          {
            id: "nx-l-2-3",
            title: "Static vs. Dynamic Rendering",
            time: "45 min",
            summary: "Static site generation, dynamic rendering triggers, force-dynamic, and searchParams considerations.",
            content: `
### Static vs. Dynamic Rendering

Next.js automatically determines if a route should be pre-rendered as a static page (Static) or rendered on each request (Dynamic).

#### Static vs. Dynamic:
* **Static Rendering:** Pages are built at build time and cached on CDNs, yielding fast load times.
* **Dynamic Rendering:** Pages are rendered on the server on each request.

#### Dynamic Rendering Triggers:
A route becomes dynamic if it uses:
* Dynamic functions (e.g. \`cookies()\`, \`headers()\`).
* Dynamic URL search parameters (e.g. \`searchParams\`).
* Uncached fetch requests: \`fetch(..., { cache: 'no-store' })\`.

#### Routing Configuration:
Force a page to be dynamic:
\`\`\`javascript
export const dynamic = "force-dynamic";
\`\`\`

#### Quiz Questions:
1. **Which API call forces Next.js to render a page dynamically on every request?**
   *   a) fetch() with force-cache
   *   b) cookies() or headers() (Correct)
   *   c) useState()
2. **What is the configuration to force a page to always render dynamically?**
   *   a) \`export const dynamic = "force-static"\`
   *   b) \`export const dynamic = "force-dynamic"\` (Correct)
   *   c) \`export const mode = "dynamic"\`

#### Interview Questions:
* **How does Next.js determine if a page should be static or dynamic at build time?**
  *   *Answer:* Next.js scans routes during build. If a route has no dynamic imports, cookies, searchParams, or uncached fetches, it is pre-rendered as a static HTML page.
* **Why are static pages preferred over dynamic pages?**
  *   *Answer:* Static pages can be cached on CDN edges globally, reducing server loads and loading pages near-instantly for users.

#### Summary:
Static pages build at build time and cache on CDNs. Dynamic pages render on each request, triggered by cookies, searchParams, or uncached fetches.
            `,
            exercise: "Create a page component containing export variables forcing dynamic server rendering."
          },
          {
            id: "nx-l-2-4",
            title: "Server Actions: Mutating Data",
            time: "50 min",
            summary: "Writing Server Actions, useActionState, optimistic updates (useOptimistic), and revalidating routes.",
            content: `
### Server Actions: Mutating Data

Server Actions allow Client Components to execute secure database writes directly on the server without writing custom API routes.

#### Core Mechanics:
* **Declaration:** Add the \`"use server"\` directive at the top of an async function.
* **Forms Integration:** Bind the action to a form's \`action\` attribute.
* **Revalidation:** Call \`revalidatePath()\` inside the action to update cached page data automatically.

#### Server Action Example:
\`\`\`javascript
// 1. Server Action (server-side file)
"use server";
import { revalidatePath } from "next/cache";

export async function createComment(formData) {
  const comment = formData.get("text");
  // Save to database here
  revalidatePath("/blog");
}

// 2. Client Component (form UI)
"use client";
import { createComment } from "./actions";

export function CommentForm() {
  return (
    <form action={createComment}>
      <input name="text" type="text" required />
      <button type="submit">Submit Comment</button>
    </form>
  );
}
\`\`\`

#### Quiz Questions:
1. **What directive must be declared at the top of a function or file to register it as a Server Action?**
   *   a) "use client"
   *   b) "use server" (Correct)
   *   c) "use action"
2. **Which Next.js API is called inside a Server Action to update cached page data?**
   *   a) revalidatePath() (Correct)
   *   b) router.refresh()
   *   c) useEffect()

#### Interview Questions:
* **How do Server Actions improve applications compared to standard API POST endpoints?**
  *   *Answer:* They eliminate the boilerplate of writing separate API routes, parsing request bodies, and managing client-side fetch calls. Next.js handles the POST communication and security tokens under the hood.
* **What is useOptimistic, and when do you use it?**
  *   *Answer:* It is a React Hook that updates the UI immediately during async transitions, assuming the server write will succeed. If the write fails, the UI rolls back to the previous state.

#### Summary:
Server Actions run secure backend mutations. Declare them with \`"use server"\`, bind them to forms, and revalidate caches to update views.
            `,
            exercise: "Write a server action that deletes an invoice from a database and revalidates the '/invoices' path."
          }
        ]
      }
    ]
  },
  {
    id: "nx-phase-2",
        title: "Phase 2: Middleware, Optimizations, Authentication, and Deployments (Weeks 3–4)",
        description: "Configure Next.js middleware routing rules, optimize images/fonts, configure Auth.js, and deploy to production.",
        modules: [
          {
            id: "nx-m-3",
            title: "Module 3: Middleware & Route Handlers",
            duration: "1 Week",
            difficulty: "Advanced",
            objectives: [
              "Write Next.js middleware managing headers and redirect rules",
              "Construct custom Route Handlers (API endpoints)",
              "Optimize images using the Image component"
            ],
            lessons: [
              {
                id: "nx-l-3-1",
                title: "Next.js Middleware Routing",
                time: "50 min",
                summary: "Middleware structures, request routing, headers manipulation, and matching paths configs.",
                content: `
### Next.js Middleware Routing

Middleware runs code before requests complete, allowing you to rewrite paths, redirect visitors, or inspect authorization headers.

#### Configurations:
* **File Location:** Placed in the root directory as \`middleware.js\`.
* **Matcher Configurations:** Limits the paths the middleware runs on.

#### Middleware Example:
\`\`\`javascript
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('session_id');

  // Redirect to login if unauthenticated
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};
\`\`\`

#### Quiz Questions:
1. **Where must the middleware.js file be located in a Next.js project?**
   *   a) Inside the /public directory
   *   b) In the root project directory (same level as /src or /app) (Correct)
   *   c) Inside /app/api
2. **What does NextResponse.next() do inside middleware?**
   *   a) Redirects the client
   *   b) Allows the request to proceed to its target route (Correct)
   *   c) Halts the pipeline

#### Interview Questions:
* **How does Next.js middleware achieve near-zero latency?**
  *   *Answer:* It runs on lightweight **Edge Runtimes** (which use V8 engines without heavy Node.js libraries), enabling fast cold starts.
* **Can you write to request headers inside middleware?**
  *   *Answer:* Yes, using \`NextResponse.next({ request: { headers } })\` to append tracking keys before routing requests.

#### Summary:
Middleware runs before requests complete. Store it in \`middleware.js\` and use matchers to filter target routes.
            `,
            exercise: "Write a middleware that logs the incoming request method and appends a custom header to the response."
          },
          {
            id: "nx-l-3-2",
            title: "Custom Route Handlers (APIs)",
            time: "45 min",
            summary: "API route files, mapping HTTP verbs, and parsing request parameters.",
            content: `
### Custom Route Handlers (APIs)

Next.js allows building custom REST API endpoints using Route Handlers.

#### Route Handler Rules:
* **File Location:** Must be named \`route.js\`.
* **Conflict Rule:** A \`route.js\` file cannot exist in the same folder as a \`page.js\` file (conflict between route and view).
* **Verbs Mapping:** Export functions named after HTTP verbs (GET, POST, DELETE, PATCH).

#### Route Handler Example:
\`\`\`javascript
import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  // Process data here
  return NextResponse.json({ success: true, received: body }, { status: 201 });
}
\`\`\`

#### Quiz Questions:
1. **Can a route.js file and a page.js file coexist in the same folder segment?**
   *   a) Yes
   *   b) No, it throws a compile-time conflict error (Correct)
   *   c) Only if it is a Client Component
2. **Which export function name maps to an HTTP DELETE query endpoint?**
   *   a) export async function REMOVE()
   *   b) export async function DELETE() (Correct)
   *   c) export async function post()

#### Interview Questions:
* **How do you access query parameters inside a Route Handler?**
  *   *Answer:* By reading the \`nextUrl.searchParams\` attribute of the incoming request object, like: \`request.nextUrl.searchParams.get("query")\`.
* **Why should you use Route Handlers instead of Server Actions?**
  *   *Answer:* Use Route Handlers when building public APIs for external mobile apps or third-party integrations. Use Server Actions for web forms and user interactions.

#### Summary:
Route Handlers (\`route.js\`) expose API endpoints by exporting verb-named functions (GET, POST, DELETE).
            `,
            exercise: "Create a GET Route Handler that returns a list of mock users as a JSON response."
          },
          {
            id: "nx-l-3-3",
            title: "Core Optimizations: Image, Font & Scripts",
            time: "45 min",
            summary: "Image component layouts, layout shift mitigation, Google Fonts loading, and script loading strategies.",
            content: `
### Core Optimizations: Image, Font & Scripts

Next.js provides built-in components to optimize assets and improve Core Web Vitals.

#### 1. Image Optimization (\`<Image />\`):
* **Format Conversion:** Converts images to modern formats (WebP, AVIF) automatically.
* **Layout Shift Prevention:** Requires specifying width and height (or using \`fill\`) to reserve space, preventing layout shifts (CLS).
* **Lazy Loading:** Images are lazy-loaded by default, loading only when they enter the viewport.

#### 2. Font Optimization (\`next/font\`):
Downloads Google Fonts at build time, self-hosting them with your app assets to eliminate layout shifts and third-party font requests.

#### 3. Script Optimization (\`next/script\`):
Loads third-party scripts (like analytics) efficiently using loading strategies:
* \`strategy="lazyOnload"\`: Loads the script during idle time.
* \`strategy="afterInteractive"\`: Loads the script after the page becomes interactive.

#### Quiz Questions:
1. **How does the Next.js Image component prevent Cumulative Layout Shift (CLS)?**
   *   a) By compressing images to 1KB
   *   b) By requiring explicit width/height dimensions to reserve layout space before loading (Correct)
   *   c) By disabling scroll bars
2. **Where does next/font download Google Fonts from during production runtime calls?**
   *   a) Google servers on each visit
   *   b) Self-hosted local assets compiled at build time (Correct)
   *   c) Browser storage caches

#### Interview Questions:
* **What is Cumulative Layout Shift (CLS), and how do you optimize it?**
  *   *Answer:* CLS measures visual stability by tracking how much page elements move during loading. We optimize it by using fixed sizes for images and self-hosting fonts to prevent layout shifts.
* **What does the 'priority' prop do in the Next.js Image component?**
  *   *Answer:* It tells Next.js to pre-load the image immediately (e.g. hero images above the fold) instead of lazy loading it.

#### Summary:
Optimize images with the \`<Image />\` component to prevent layout shifts, use \`next/font\` to self-host fonts, and manage scripts with \`next/script\`.
            `,
            exercise: "Write an Image component definition that maps a remote image source, setting layout priorities."
          }
        ]
      },
      {
        id: "nx-m-4",
        title: "Module 4: Authentication, Scaling & Deployments",
        duration: "1 Week",
        difficulty: "Advanced",
        objectives: [
          "Configure Auth.js (NextAuth) session tokens and providers",
          "Setup environment variables and database connections",
          "Deploy App Router code to Vercel and check edge functions"
        ],
        lessons: [
          {
            id: "nx-l-4-1",
            title: "NextAuth / Auth.js Authentications",
            time: "55 min",
            summary: "Auth providers configuration, JWT session handling, credentials logins, and route guard configurations.",
            content: `
### Authentication with Auth.js (NextAuth)

Auth.js integrates authentication into Next.js App Router applications.

#### Key Implementation Steps:
1. **Handler Setup:** Create a catch-all route handler at \`app/api/auth/[...nextauth]/route.js\`.
2. **Providers configuration:** Add auth providers (OAuth providers like GitHub or Google, or Credentials login).
3. **Session Guards:** Secure Client Components using \`useSession()\` hooks and Server Components using \`getServerSession()\`.

#### Auth Handler Example:
\`\`\`javascript
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
\`\`\`

#### Quiz Questions:
1. **Where must the catch-all API route handler for Auth.js be configured?**
   *   a) \`app/auth/route.js\`
   *   b) \`app/api/auth/[...nextauth]/route.js\` (Correct)
   *   c) \`app/page.js\`
2. **What session strategy does NextAuth use by default?**
   *   a) SQL database sessions
   *   b) JSON Web Tokens (JWT) (Correct)
   *   c) Local storage caches

#### Interview Questions:
* **How do you secure a route on the server level in Next.js?**
  *   *Answer:* By querying the session using \`getServerSession(authOptions)\` in the Server Component. If no session exists, redirect the user using \`redirect("/login")\`.
* **What is the purpose of NextAuth callbacks?**
  *   *Answer:* Callbacks run during auth events (like signing in or generating tokens), allowing you to customize JWT tokens or inject custom fields (like user roles) into sessions.

#### Summary:
Install Auth.js, configure OAuth providers in route handlers, and protect routes using server sessions.
            `,
            exercise: "Write a Server Component page that checks for an active session and redirects to '/login' if missing."
          },
          {
            id: "nx-l-4-2",
            title: "Vercel Deployments & CDN Scale",
            time: "50 min",
            summary: "Vercel pipeline deployment integration, production builds, logs tracking, and Edge rendering optimizations.",
            content: `
### Vercel Deployments & Production Scale

Next.js is built by Vercel, offering near-zero configuration deployments and global scalability.

#### Deployment Pipeline:
1. Link your GitHub repository to the Vercel dashboard.
2. Vercel automatically detects Next.js configurations, builds the app on every push, and deploys it to a global CDN network.
3. Serverless and Edge functions are provisioned automatically for dynamic routes and API handlers.

#### Optimization Best Practices:
* **Cache Headers:** Configure cache headers to store static pages on Edge CDN servers.
* **Environment variables:** Secure database keys inside Vercel's project settings console instead of committing them to code.

#### Quiz Questions:
1. **Where are static page resources deployed when publishing on Vercel?**
   *   a) On a single database server
   *   b) On a global Content Delivery Network (CDN) edge (Correct)
   *   c) In browser caches
2. **What occurs when you push code updates to a linked GitHub repository?**
   *   a) Pipeline halts
   *   b) Vercel builds and deploys a preview version of the app automatically (Correct)
   *   c) Cloud databases reset

#### Interview Questions:
* **Explain how Serverless functions run dynamic routes on Vercel.**
  *   *Answer:* Dynamic routes and API handlers compile into separate serverless functions. When a user requests a dynamic page, Vercel boots and executes the serverless function, returning HTML or JSON before going idle.
* **What are Edge Functions, and how do they differ from Serverless Functions?**
  *   *Answer:* Serverless functions run on Node.js containers with standard resources. Edge functions run on lightweight V8 engines near the user, offering faster cold starts and lower latency.

#### Summary:
Link git repositories to Vercel to automate deployment builds. Static files are deployed to CDNs, and dynamic routes compile to serverless edge functions.
            `,
            exercise: "Create a checklist of production build configurations, detailing check stages and environment settings."
          }
        ]
      }
    ]
  }
];

export const resourcesList = [
  {
    category: "Next.js Learning Guides",
    items: [
      { name: "Next.js Official Documentation", desc: "Detailed API guides for routing, rendering, and caching.", link: "https://nextjs.org/docs" },
      { name: "React Server Components Guide", desc: "How RSC and Client hydration work under the hood.", link: "https://react.dev/reference/rsc/server-components" },
      { name: "Auth.js Authentication Reference Docs", desc: "Setting up next-auth providers, sessions, and route guards.", link: "https://authjs.dev" }
    ]
  }
];

export const glossary = [
  { term: "RSC", def: "React Server Components - components that render entirely on the server, saving client bundle size." },
  { term: "Sound Null Safety", def: "Dart compile guarantee preventing variable runtime null pointer crashes unless marked nullable." },
  { term: "Layout Segment", def: "Special file layout.js sharing UI layouts across routes without resetting states." },
  { term: "Catch-All Route", def: "A dynamic route segment [...slug] matching arbitrarily nested path URLs." },
  { term: "Revalidation", def: "The process of updating cached data dynamically using paths or tags." },
  { term: "Server Action", def: "An async function annotated with 'use server' to run secure database writes from forms." },
  { term: "NextResponse", def: "Built-in Next.js routing wrapper used inside middleware to redirect or rewrite paths." },
  { term: "Route Handler", def: "Special file route.js exposing REST API endpoints." },
  { term: "CLS", def: "Cumulative Layout Shift - metric tracking how much page elements move during loading." },
  { term: "Auth.js", def: "An open-source authentication library managing sessions and OAuth logins." }
];
