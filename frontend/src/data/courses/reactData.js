// React.js Dedicated Course Data
// Formatted for dynamic catalog consumption and lesson viewer parsing

export const allPhases = [
  {
    id: "r-phase-1",
    title: "Phase 1: Virtual DOM, Component Basics, and Hooks Lifecycles (Weeks 1–2)",
    description: "Learn React Virtual DOM reconciliation, JSX layouts, components state updates, side-effect hooks, and context state sharing.",
    modules: [
      {
        id: "r-m-1",
        title: "Module 1: React Core Mechanics",
        duration: "1 Week",
        difficulty: "Beginner",
        objectives: [
          "Explain Virtual DOM Reconciliation diffing rules",
          "Compose nested user interfaces using JSX syntax",
          "Pass immutable data parameters down using props",
          "Map lists of data into collections with unique key attributes",
          "Develop interactive event handling loops"
        ],
        lessons: [
          {
            id: "r-l-1-1",
            title: "Traditional DOM vs. React Virtual DOM Reconciliation",
            time: "45 min",
            summary: "Layout reflows, repaints bottlenecks, Virtual DOM tree diffing, and React Fiber scheduling.",
            content: `
### Traditional DOM vs. React Virtual DOM

Updating native browser DOM nodes directly is slow. When many elements change, the browser recalculates layout geometry (reflow) and re-draws pixels (repaint), causing visual lag. React solves this by using an in-memory **Virtual DOM**.

#### The Reconciliation Process:
1. **State Trigger:** When a component's state changes, React constructs a new Virtual DOM tree representing the updated UI configuration.
2. **Diffing Algorithm:** React compares (diffs) the new Virtual DOM tree against a snapshot of the old tree, mapping differences.
3. **Optimal Repaint:** React updates only the specific browser DOM nodes that changed, minimizing reflows and repaints.

#### React Fiber:
Introduced to support incremental rendering. It allows splitting rendering work into small chunks, spreading them across multiple animation frames to keep interfaces responsive (maintaining a smooth 60fps refresh rate).

#### Quiz Questions:
1. **Why does direct browser DOM manipulation degrade web app performance?**
   *   a) It runs on background threads
   *   b) It triggers expensive layout reflows and repaints in the browser (Correct)
   *   c) It deletes HTML files
2. **What is React Fiber designed to support?**
   *   a) Database queries
   *   b) Incremental rendering and chunking of rendering tasks across frames (Correct)
   *   c) CSS styles

#### Interview Questions:
* **How does React's diffing algorithm optimize tree comparisons?**
  *   *Answer:* A full comparison of two trees has a time complexity of $\mathcal{O}(N^3)$. React uses a heuristic algorithm with $\mathcal{O}(N)$ complexity by assuming that two elements of different types produce different trees, and lists of child elements require unique keys to track updates.
* **Explain what a repaint is and why it is expensive.**
  *   *Answer:* A repaint occurs when elements change visual properties (e.g. background color) without altering layout size. The browser must redraw the pixel grid, which consumes GPU cycles and causes lag if triggered repeatedly.

#### Summary:
React uses a Virtual DOM to minimize browser reflows and repaints. The reconciliation engine diffs virtual trees and applies only the changes to the browser DOM.
            `,
            exercise: "Explain in writing how the Virtual DOM improves UI performance during rapid data updates."
          },
          {
            id: "r-l-1-2",
            title: "JSX Syntax: Rules, Fragments & Styles",
            time: "40 min",
            summary: "JSX HTML-in-JS, compilation steps, single parent rule, camelCase rules, and styling objects.",
            content: `
### Writing Layouts with JSX

JSX (JavaScript XML) allows you to write HTML-like markup directly inside your JavaScript files.

#### Under-the-Hood Compilation:
Browsers cannot read JSX. Compilation tooling (like Babel or SWC) converts JSX tags into standard JavaScript method calls:
\`\`\`javascript
// JSX code:
const element = <h1 className="title">Hello</h1>;

// Compiled JavaScript:
const element = React.createElement("h1", { className: "title" }, "Hello");
\`\`\`

#### Key JSX Constraints:
1. **Single Parent Root:** All JSX layouts must return a single root element. If you don't want to add extra wrapper divs, use empty **Fragments** (\`<></>\`).
2. **camelCase Attributes:** Attributes are camelCase (e.g., \`className\` instead of \`class\`, \`tabIndex\` instead of \`tabindex\`).
3. **Style Objects:** Styles must be passed as JS objects: \`style={{ color: 'red', fontSize: '14px' }}\`.

#### Quiz Questions:
1. **Which attribute name is correct for setting a CSS class in JSX?**
   *   a) class
   *   b) className (Correct)
   *   c) classId
2. **Why must all JSX return statements have a single parent element?**
   *   a) CSS grids require it
   *   b) JavaScript functions can return only a single value or object (Correct)
   *   c) To speed up compilers

#### Interview Questions:
* **What does the React compiler convert JSX tags into?**
  *   *Answer:* It compiles them into \`React.createElement()\` calls, which evaluate to JavaScript objects representing the virtual DOM nodes.
* **Why do we use React Fragments (<></>) instead of standard divs?**
  *   *Answer:* Fragments allow grouping multiple child elements without rendering an extra DOM node on the page, keeping the HTML cleaner and preserving layout flows.

#### Summary:
JSX compiles to React.createElement calls. It requires camelCase attributes, inline style objects, and wrapping layouts in a single parent container.
            `,
            exercise: "Write a JSX profile component containing an image, title, and description wrapped inside a single Fragment tag."
          },
          {
            id: "r-l-1-3",
            title: "Functional Components & Dynamic Props",
            time: "45 min",
            summary: "Nesting components, props parameters passing, unidirectional data flow, and read-only props constraints.",
            content: `
### Functional Components & Props

React applications are built by nesting reusable components. Modern React uses JavaScript functions as components.

#### Props (Properties):
Props are read-only input parameters passed from a parent component down to a child component.
* **Unidirectional Flow:** Props flow in one direction—downwards. Children cannot modify the props they receive.
* **Callback Events:** To notify parents of changes, children invoke callback functions passed down as props.

#### Components Code Example:
\`\`\`jsx
// Child Component
function Badge({ text, color = "blue" }) {
  return (
    <span className="badge" style={{ backgroundColor: color }}>
      {text}
    </span>
  );
}

// Parent Component
export default function App() {
  return <Badge text="Premium User" color="gold" />;
}
\`\`\`

#### Quiz Questions:
1. **Can a child component directly modify a value received as a prop?**
   *   a) Yes
   *   b) No, props are read-only and immutable inside the child component (Correct)
   *   c) Only in class components
2. **What direction does data flow in React?**
   *   a) Bidirectional
   *   b) Unidirectional (from parent down to child) (Correct)
   *   c) Upward only

#### Interview Questions:
* **Explain the rule: 'Props are read-only (immutable)'.**
  *   *Answer:* A component must behave like a pure function. It should never modify its inputs (props). If you need to change data dynamically, use **State** instead.
* **How does a child component notify its parent about user interactions?**
  *   *Answer:* The parent passes a callback function down to the child as a prop. When the user interacts with the child, the child invokes that function, passing data up to the parent.

#### Summary:
Functional components accept read-only props inputs. Props flow downwards; pass callback functions to allow children to communicate updates to parents.
            `,
            exercise: "Build a custom Button component that accepts label, color, and an onClick callback prop."
          },
          {
            id: "r-l-1-4",
            title: "Lists Rendering: Array Mapping & Keys",
            time: "40 min",
            summary: "Array.map() selectors, unique key attributes, and reconciliation diff optimizations.",
            content: `
### Lists Rendering & Unique Keys

Rendering dynamic lists of data requires looping through arrays and returning JSX elements.

#### Using map():
In React, we use the standard JavaScript \`Array.prototype.map()\` method to transform data arrays into collections of JSX elements.

#### The Role of Keys:
You must provide a unique, stable \`key\` prop to each list element (typically database IDs):
* **Reconciliation optimization:** Keys help React identify which list elements were added, changed, or removed.
* **Avoid Array Indices as Keys:** If the list is reordered, sorted, or filtered, using the array index as the key causes rendering bugs and degrades performance.

#### List Code Example:
\`\`\`jsx
export default function UserList() {
  const users = [
    { id: "u1", name: "Alice" },
    { id: "u2", name: "Bob" }
  ];

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
\`\`\`

#### Quiz Questions:
1. **Why is it discouraged to use array indices as keys for dynamic lists?**
   *   a) Indices slow down compilers
   *   b) If the list is sorted or reordered, index keys cause incorrect state bindings and rendering bugs (Correct)
   *   c) Indices are not strings
2. **What Javascript array method is standard for rendering lists of items in React?**
   *   a) forEach()
   *   b) map() (Correct)
   *   c) filter()

#### Interview Questions:
* **How does the reconciliation diffing engine use key props during list updates?**
  *   *Answer:* Without keys, if a new item is inserted at the top of a list, React updates every single item in the list. With unique keys, React aligns keys to track matching elements, rendering and prepending only the single new item without modifying the others.
* **What is the requirement for a key prop value?**
  *   *Answer:* Keys must be unique among sibling elements and stable (persisting across render cycles). Never generate keys on the fly using \`Math.random()\`.

#### Summary:
Render lists using \`array.map()\`. Provide unique, stable key props to optimize diffing and prevent rendering bugs.
            `,
            exercise: "Render a list of product objects containing title, price, and id, displaying them in a grid cards format."
          },
          {
            id: "r-l-1-5",
            title: "Event Handling & Form Inputs",
            time: "45 min",
            summary: "React synthetic events, onClick event handlers, event default preventions, and controlled inputs.",
            content: `
### Event Handling & Form Inputs

React handles user interactions using synthetic events and controlled inputs.

#### 1. Event Handling:
Event handlers are passed as camelCase functions directly:
\`\`\`jsx
<button onClick={handleClick}>Click Me</button>
\`\`\`
* Standard form submissions must cancel default browser reloads using \`event.preventDefault()\`.

#### 2. Controlled Components:
In controlled inputs, the input value is bound to a React state variable, and updating the state updates the input value.
\`\`\`jsx
const [name, setName] = useState("");
<input value={name} onChange={(e) => setName(e.target.value)} />
\`\`\`

#### Quiz Questions:
1. **Which event method stops browsers from reloading the page during form submissions?**
   *   a) event.stopPropagation()
   *   b) event.preventDefault() (Correct)
   *   c) event.reset()
2. **What defines a controlled component input in React?**
   *   a) The value is managed directly by the browser DOM
   *   b) The value is bound to a React state variable, updated via an onChange event handler (Correct)
   *   c) It is uneditable

#### Interview Questions:
* **What is a Synthetic Event in React?**
  *   *Answer:* A cross-browser wrapper around the browser's native event object. It standardizes event attributes across different browsers and improves performance through event delegation.
* **How does a controlled component differ from an uncontrolled component?**
  *   *Answer:* In controlled components, form data is handled by a React state variable. In uncontrolled components, form data is handled by the browser DOM directly, accessed using \`useRef()\` references.

#### Summary:
Bind event handlers using camelCase attributes. Use controlled inputs to sync input values with React state variables.
            `,
            exercise: "Build an input form with username and email fields, alerting values and preventing page reloads on submit."
          }
        ]
      },
      {
        id: "r-m-2",
        title: "Module 2: Stateful Hook Systems",
        duration: "1 Week",
        difficulty: "Intermediate",
        objectives: [
          "State management useState variables and asynchronous batching",
          "Synchronize side effects and handle listeners cleanup using useEffect",
          "Share state globally using useContext providers"
        ],
        lessons: [
          {
            id: "r-l-2-1",
            title: "useState: Triggering Re-renders & Batch Updates",
            time: "50 min",
            summary: "Internal mutable state, useState initialization, asynchronous batching updates, and callback state setters.",
            content: `
### useState Hook Management

While props are immutable inputs, **State** is a component's private, internally managed memory cache. When state changes, React schedules a component re-render.

#### State Updates are Asynchronous & Batched:
React batches state updates to group multiple changes together, avoiding duplicate re-renders in the same tick. Because updates are async, accessing a state variable immediately after setting it returns its old value:
\`\`\`jsx
const [count, setCount] = useState(0);

const handleClick = () => {
  setCount(count + 1);
  console.log(count); // Still prints 0!
};
\`\`\`
* If the next state depends on the previous state, pass a callback: \`setCount(prev => prev + 1)\`.

#### Quiz Questions:
1. **Why does accessing a state variable immediately after calling its setter function return the old value?**
   *   a) Because setters are synchronous
   *   b) Because state updates are asynchronous and batched to group re-renders (Correct)
   *   c) State is read-only
2. **What setter pattern should you use if your next state calculation relies on the previous state value?**
   *   a) Pass the state variable directly: setCount(count + 1)
   *   b) Pass a callback function: setCount(prev => prev + 1) (Correct)
   *   c) Use standard variable assignments

#### Interview Questions:
* **Explain how React batches state updates.**
  *   *Answer:* React batches state updates within event handlers. It runs all state modifications first, then triggers a single virtual DOM reconciliation and re-render cycle at the end of the event loop, optimizing performance.
* **Why must we treat React state as immutable?**
  *   *Answer:* React checks if a state variable changed using reference equality (shallow comparison). If you mutate an object directly (e.g. \`state.items.push(x)\`), the object reference stays the same, and React fails to trigger a re-render.

#### Summary:
State triggers component re-renders. Updates are asynchronous and batched. Use callback setters when calculating new values from old states.
            `,
            exercise: "Build a counter component containing +1 and -1 buttons, using callback state setters."
          },
          {
            id: "r-l-2-2",
            title: "useEffect: Asynchronous Side Effects & Cleanups",
            time: "50 min",
            summary: "Purity limits, useEffect executions, dependency array configurations, and event listener cleanups.",
            content: `
### useEffect Hook & Lifecycle

Component rendering must be a pure operation. Place side effects (like data fetching, subscription binds, window listeners, or timer intervals) inside the \`useEffect\` hook.

#### The Dependency Array:
Determines when the effect re-runs:
* \`[]\`: Runs only once (when the component mounts).
* \`[value]\`: Runs on mount and whenever \`value\` changes.
* *No Array*: Runs on every single render cycle (causes infinite loops, avoid!).

#### Cleanups:
If the effect sets up listeners, subscriptions, or intervals, return a cleanup function to clean them up when the component unmounts or before re-running the effect:
\`\`\`jsx
useEffect(() => {
  const handler = () => console.log("Window resized");
  window.addEventListener("resize", handler);

  // Cleanup runs on unmount
  return () => window.removeEventListener("resize", handler);
}, []);
\`\`\`

#### Quiz Questions:
1. **What occurs if you omit the dependency array completely from a useEffect hook?**
   *   a) The effect never runs
   *   b) The effect runs on every single render cycle, risking performance loops (Correct)
   *   c) The compiler throws an error
2. **Where should you unsubscribe from event listeners configured inside a useEffect hook?**
   *   a) In the component return statement
   *   b) In the cleanup function returned by the effect (Correct)
   *   c) Inside the dependency array

#### Interview Questions:
* **How does the cleanup function in useEffect prevent memory leaks?**
  *   *Answer:* When a component unmounts, its intervals and event listeners persist on the browser window object. Returning a cleanup function that cancels these listeners clears memory references.
* **Explain when an effect with a dependency array of [id] executes its cleanup.**
  *   *Answer:* It executes its cleanup twice: once before the effect runs again (when the \`id\` value changes), and once when the component unmounts.

#### Summary:
Place side effects inside \`useEffect\`. Control executions using dependency arrays, and return cleanup functions to prevent memory leaks.
            `,
            exercise: "Write an effect that fetches details from an API when a 'productId' prop changes, incorporating a cleanup flag to prevent race conditions."
          },
          {
            id: "r-l-2-3",
            title: "useContext: Shared Global Context States",
            time: "45 min",
            summary: "Prop drilling issues, createContext, useContext hooks, and theme/auth providers.",
            content: `
### Global State with Context

Passing props down through 10 nested component layers (prop drilling) is tedious and hard to maintain. The **Context API** shares data down the component tree without manually writing props at every level.

#### Core Implementation:
1. Create Context: \`const ThemeContext = createContext()\`
2. Provider Wrapper: \`ThemeContext.Provider\` wraps child components, passing down shared values.
3. Hook consumption: \`const theme = useContext(ThemeContext)\`

#### Context Provider Example:
\`\`\`jsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
\`\`\`

#### Quiz Questions:
1. **What problem does the React Context API solve?**
   *   a) App routing
   *   b) Prop drilling (passing props down multiple nested component levels) (Correct)
   *   c) Database query speeds
2. **What hook consumes context values directly inside functional components?**
   *   a) useState
   *   b) useContext (Correct)
   *   c) useReducer

#### Interview Questions:
* **What is the performance drawback of using Context API for rapidly changing state?**
  *   *Answer:* When a provider's value changes, **all** components consuming that context are forced to re-render, even if they only read a static subset of the context. For large, fast-updating states, use state managers like Zustand.
* **Can you wrap multiple Context Providers around the same application?**
  *   *Answer:* Yes, you can nest multiple providers (e.g. AuthProvider, ThemeProvider) to segregate state domains.

#### Summary:
Use Context API to avoid prop drilling. Wrap components in a Provider to share states, and consume values using the \`useContext\` hook.
            `,
            exercise: "Build an AuthProvider context that stores username states and exposes a logout function."
          }
        ]
      }
    ]
  },
  {
    id: "r-phase-2",
    title: "Phase 2: Complex State, Advanced Hooks, React 19, Routing & State Managers (Weeks 3–4)",
    description: "Manage complex states with useReducer, optimize code with the React 19 compiler, secure routing, and implement global stores.",
    modules: [
      {
        id: "r-m-3",
        title: "Module 3: Advanced Hooks & Optimization",
        duration: "1 Week",
        difficulty: "Advanced",
        objectives: [
          "Manage complex nested state models using useReducer hooks",
          "Abstract state logic into custom hooks",
          "Optimize performance using the React 19 compiler and memo hooks",
          "Reference elements using useRef and create modal Portals",
          "Implement Error Boundaries and code splitting lazy imports"
        ],
        lessons: [
          {
            id: "r-l-3-1",
            title: "useReducer: Complex State Management",
            time: "50 min",
            summary: "Reducers state managers, actions payloads, dispatch functions, and standard actions patterns.",
            content: `
### useReducer: Complex State Management

For complex, nested state objects (where the next state depends on multiple conditions), \`useReducer\` is preferred over multiple \`useState\` hooks.

#### Reducer Terminology:
* **State:** The current immutable state object.
* **Action:** An object describing what occurred, containing a \`type\` string and a \`payload\` data key.
* **Reducer:** A pure function that receives the current state and action, returning the new state: \`(state, action) => newState\`.
* **Dispatch:** A callback function to send actions to the reducer.

#### Reducer Code Example:
\`\`\`jsx
import { useReducer } from 'react';

const reducer = (state, action) => {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    default: throw new Error();
  }
};

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </div>
  );
}
\`\`\`

#### Quiz Questions:
1. **What is a reducer function?**
   *   a) A function that writes to files
   *   b) A pure function that accepts the current state and an action, returning a new state (Correct)
   *   c) An API router
2. **What function sends action objects to trigger the reducer?**
   *   a) setState
   *   b) dispatch (Correct)
   *   c) invoke

#### Interview Questions:
* **Why must reducer functions be pure?**
  *   *Answer:* Reducers must calculate outputs based only on inputs, without modifying variables or executing side-effects. This ensures predictable state changes and supports time-travel debugging.
* **How does useReducer compare to Redux?**
  *   *Answer:* \`useReducer\` is built-in and manages state locally inside a component tree. Redux is an external state manager that maintains a single global store for the entire application.

#### Summary:
Manage complex states using \`useReducer\`. Reducer functions evaluate actions and return new states, triggered by calling \`dispatch()\`.
            `,
            exercise: "Write a reducer function that handles adding and removing elements from an array list."
          },
          {
            id: "r-l-3-2",
            title: "React 19 Compiler & Memoization",
            time: "50 min",
            summary: "Zero-dependency memoization, the React Compiler, and when to use useMemo vs useCallback.",
            content: `
### React 19 Compiler & Memoization

Previously, developers had to write \`useMemo\` and \`useCallback\` hooks manually to prevent children from re-rendering unnecessarily.

#### 1. The React Compiler (React Forget):
Introduced in React 19, the compiler automatically performs fine-grained memoization at compile-time. It analyzes the code and compiles optimal caches, eliminating the boilerplate of manual memo hooks.

#### 2. Manual Memoization Hooks:
* **useMemo:** Caches the computed *result* of an expensive function:
  \`\`\`javascript
  const result = useMemo(() => expensiveCalculation(data), [data]);
  \`\`\`
* **useCallback:** Caches the *function instance* itself, preventing recreation on renders:
  \`\`\`javascript
  const handler = useCallback(() => clickEvent(), []);
  \`\`\`

#### Quiz Questions:
1. **What compiler feature in React 19 automatically caches computations without manual memo hooks?**
   *   a) Babel Loader
   *   b) The React Compiler (Correct)
   *   c) Turbopack
2. **What does the useMemo hook cache?**
   *   a) A function instance
   *   b) The returned result of an expensive calculation function (Correct)
   *   c) HTML elements

#### Interview Questions:
* **Why does passing a new callback instance to a memoized child component trigger a re-render?**
  *   *Answer:* JavaScript compares functions by reference. A new function instance is created on every render, changing its reference, which invalidates the child's shallow comparison memo checks.
* **How does the React 19 Compiler change optimization workflows?**
  *   *Answer:* It automates memoization. It analyzes component code to identify when props have not changed, caching render outputs automatically without developers needing to declare dependency arrays.

#### Summary:
React 19 introduces automatic memoization. Manual hooks (\`useMemo\`, \`useCallback\`) can still be used to cache expensive values and function references.
            `,
            exercise: "Write an expensive sorting operation and wrap it in useMemo to prevent recalculation on unrelated renders."
          },
          {
            id: "r-l-3-3",
            title: "useRef: Referencing DOM Elements & Persisting Values",
            time: "40 min",
            summary: "Persistent mutable values, targeting DOM nodes directly, focus actions, and preventing component re-renders.",
            content: `
### useRef: Referencing DOM Elements

The \`useRef\` hook is used to reference DOM elements and persist values across render cycles.

#### Core Properties:
* **Persists Values:** Storing values in \`ref.current\` persists them across renders.
* **No Re-renders:** Modifying \`ref.current\` **does not** trigger a component re-render.
* **DOM Access:** Pass the ref to a JSX element's \`ref\` attribute to reference its native DOM node directly:
  \`\`\`jsx
  const inputRef = useRef(null);
  useEffect(() => inputRef.current.focus(), []);
  return <input ref={inputRef} />;
  \`\`\`

#### Quiz Questions:
1. **What occurs to the component UI when you modify the value of ref.current?**
   *   a) The component re-renders immediately
   *   b) Nothing (modifying ref values does not trigger re-renders) (Correct)
   *   c) The browser reloads
2. **Which hook is most appropriate for focusing a text input field on mount?**
   *   a) useState
   *   b) useRef (Correct)
   *   c) useContext

#### Interview Questions:
* **When would you use useRef to store data instead of useState?**
  *   *Answer:* When you need to persist a mutable value across renders but do not want changes to trigger UI re-renders (e.g., storing a timer ID or tracking how many times a component rendered).
* **Explain how to measure a DOM element's height using refs.**
  *   *Answer:* Pass the ref to the element. Once mounted, read its height inside a \`useLayoutEffect\` or \`useEffect\` hook using \`ref.current.getBoundingClientRect().height\`.

#### Summary:
\`useRef\` stores mutable values without triggering re-renders, and references native browser DOM nodes directly.
            `,
            exercise: "Write a component that tracks how many times it has rendered using a ref counter."
          },
          {
            id: "r-l-3-4",
            title: "React Portals & Error Boundaries",
            time: "45 min",
            summary: "Rendering outside DOM hierarchies, ReactDOM.createPortal, modal setups, and class error boundary captures.",
            content: `
### React Portals & Error Boundaries

Portals and Error Boundaries handle overlays and component crashes safely.

#### 1. React Portals:
Allows rendering children into a DOM node located outside the main parent component tree (e.g. modals, tooltips):
\`\`\`javascript
import ReactDOM from 'react-dom';

export function Modal({ children }) {
  // Render content directly into the document body
  return ReactDOM.createPortal(
    <div className="modal">{children}</div>,
    document.body
  );
}
\`\`\`

#### 2. Error Boundaries:
Class components that catch client-side JavaScript errors anywhere in their child component tree, displaying fallback UIs instead of crashing the entire app.
* Must implement lifecycle methods: \`getDerivedStateFromError()\` or \`componentDidCatch()\`.

#### Quiz Questions:
1. **Which ReactDOM method renders elements into a DOM node located outside the parent component tree?**
   *   a) render()
   *   b) createPortal() (Correct)
   *   c) hydrate()
2. **Can standard functional components act as Error Boundaries directly?**
   *   a) Yes
   *   b) No, Error Boundaries must implement class component lifecycles (Correct)
   *   c) Only in React 19

#### Interview Questions:
* **Why do we use React Portals for modal dialogs?**
  *   *Answer:* Modals can face layout issues (like clipping from parent \`overflow: hidden\` or \`z-index\` conflicts). Portals render the modal directly inside the \`<body>\`, avoiding parent layout constraints while preserving event bubbling context.
* **Explain how getDerivedStateFromError handles crashes.**
  *   *Answer:* It is a static class method called after an error is thrown in a child component. It returns a state object that triggers a fallback UI render.

#### Summary:
Portals render elements outside parent DOM hierarchies, avoiding layout conflicts. Error boundaries catch child crashes to prevent app failures.
            `,
            exercise: "Build a modal component that renders its layout inside document.body using ReactDOM.createPortal."
          },
          {
            id: "r-l-3-5",
            title: "Code Splitting: React.lazy & Suspense",
            time: "45 min",
            summary: "Bundle size bottlenecks, dynamic imports, React.lazy wrapper, and loading fallback Suspense views.",
            content: `
### Code Splitting & Suspense

Loading all pages and components in a single large JavaScript bundle slows down page loads. **Code Splitting** splits code into smaller chunks, loading them only when needed.

#### Implementation:
* **Dynamic Import:** Replace static imports with dynamic wrapper functions:
  \`\`\`javascript
  import { lazy } from 'react';
  const HeavyComponent = lazy(() => import('./HeavyComponent'));
  \`\`\`
* **Suspense:** Wraps the lazy component, displaying a fallback UI (like loading skeletons) while the component loads:
  \`\`\`jsx
  <Suspense fallback={<div>Loading component...</div>}>
    <HeavyComponent />
  </Suspense>
  \`\`\`

#### Quiz Questions:
1. **Which React wrapper lazily imports components in functional configurations?**
   *   a) Suspense
   *   b) React.lazy() (Correct)
   *   c) dynamic()
2. **What does the fallback prop in a Suspense component define?**
   *   a) The error redirection path
   *   b) The fallback loading UI displayed while the lazy component is loading (Correct)
   *   c) An event callback

#### Interview Questions:
* **How does code splitting improve loading times?**
  *   *Answer:* It shrinks the initial JavaScript bundle size. The browser loads only the core code needed for the landing page, downloading other features (like admin panels) only when the user navigates there.
* **Can you wrap multiple lazy components in a single Suspense boundary?**
  *   *Answer:* Yes, you can nest multiple lazy components in one boundary. Suspense will resolve the loading state once all children have finished loading.

#### Summary:
Shrink bundle sizes using code splitting. Wrap dynamic imports in \`React.lazy()\` and load them inside a \`Suspense\` boundary.
            `,
            exercise: "Configure a route view that lazy-loads an admin dashboard component, wrapping it in a Suspense loader."
          }
        ]
      },
      {
        id: "r-m-4",
        title: "Module 4: React 19, Routing & State Managers",
        duration: "1 Week",
        difficulty: "Advanced",
        objectives: [
          "Differentiate Server Components from Client Components",
          "Consume Promises inside client templates using the 'use' hook",
          "Implement form actions using useActionState and useFormStatus",
          "Build single-page routers using React Router DOM",
          "Manage global stores using Zustand and write unit tests"
        ],
        lessons: [
          {
            id: "r-l-4-1",
            title: "React 19 Server Components vs. Client Components",
            time: "45 min",
            summary: "React hybrid architecture, backend execution RSCs, browser hydration RCCs, and boundaries.",
            content: `
### React 19 Server vs. Client Components

React 19 introduces a hybrid rendering model, dividing components into Server Components and Client Components.

#### Core Concepts:
* **Server Components (RSC):**
  * Render entirely on the backend server.
  * Do not send their dependencies to the browser JS bundle.
  * Direct access to backend databases and secure keys.
  * Cannot use hooks or handle browser event listeners.
* **Client Components (RCC):**
  * Marked using the \`"use client"\` directive at the top of the file.
  * Compiled for browser hydration, enabling hooks (\`useState\`, \`useEffect\`) and event listeners.

#### Quiz Questions:
1. **Can a React Server Component access local browser APIs like window.localStorage?**
   *   a) Yes
   *   b) No, Server Components run on the backend and lack access to browser APIs (Correct)
   *   c) Only in development
2. **What directive marks a component file for browser hydration?**
   *   a) "use server"
   *   b) "use client" (Correct)
   *   c) "use browser"

#### Interview Questions:
* **Why are Server Components not considered SSR (Server-Side Rendering)?**
  *   *Answer:* SSR compiles React components into HTML strings on each request, still requiring the entire JS bundle to hydrate in the browser. Server Components compile to a serialized JSON-like structure that updates the virtual DOM directly without hydrating the component, saving client JS bytes.
* **How do you pass data from a Server Component to a Client Component?**
  *   *Answer:* By importing the Client Component into the Server Component and passing data as standard serializable props (numbers, strings, arrays).

#### Summary:
Server Components execute on the server, keeping browser bundles small. Client Components hydate in the browser to support interactivity and hooks.
            `,
            exercise: "Draft a component tree where a Server Component parses a file and passes data to a Client Component."
          },
          {
            id: "r-l-4-2",
            title: "React 19 'use' Hook: Promises & Context",
            time: "45 min",
            summary: "Consuming promises, conditional context parsing, and integrating Suspense loader boundaries.",
            content: `
### React 19: The 'use' Hook

React 19 introduces the \`use\` hook, allowing developers to read Promises and Contexts dynamically inside loops and conditional statements.

#### Key Advancements:
* **Conditional Parsing:** Standard hooks (like \`useContext\`) can only be called at the top level of a component. The \`use\` hook can run inside \`if\` statements or loops.
* **Promise Integration:** Pass a Promise from a Server Component down to a Client Component. The Client Component uses \`use\` to read the Promise, automatically suspending rendering until the promise resolves.

#### Code Example:
\`\`\`jsx
import { use } from 'react';

function UserProfiles({ dataPromise }) {
  // Read value directly from promise. React automatically suspends rendering
  const users = use(dataPromise);
  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}
\`\`\`

#### Quiz Questions:
1. **Which React 19 hook can be called conditionally inside 'if' statements or loops?**
   *   a) useContext
   *   b) use (Correct)
   *   c) useEffect
2. **What occurs when the 'use' hook reads an unresolved Promise?**
   *   a) It returns null
   *   b) It suspends rendering, displaying the fallback UI of the parent Suspense boundary (Correct)
   *   c) The app crashes

#### Interview Questions:
* **How does the use hook simplify data fetching in client components?**
  *   *Answer:* It eliminates the need for \`useEffect\` and \`useState\` combinations. You pass a Promise to the component and read it with \`use()\`, leaving loading states to parent Suspense boundaries.
* **What is the difference between use(Context) and useContext(Context)?**
  *   *Answer:* \`useContext\` can only be called at the top level of a component. \`use\` can be called conditionally and inside loops, offering more flexibility.

#### Summary:
The \`use\` hook reads Promises and Contexts conditionally. It suspends rendering when reading unresolved Promises, displaying Suspense fallbacks.
            `,
            exercise: "Create a Client Component that consumes a ThemeContext using the React 19 use() hook inside an if block."
          },
          {
            id: "r-l-4-3",
            title: "React 19 Form Actions: useActionState & useFormStatus",
            time: "50 min",
            summary: "Form action mutations, useActionState hook, pending actions indicators, and useFormStatus validations.",
            content: `
### React 19 Form Actions

React 19 upgrades HTML forms to support form actions, managing loading states, pending flags, and response payloads natively.

#### 1. Form Action Attributes:
You can pass functions directly to form \`action\` attributes:
\`\`\`jsx
<form action={handleSubmit}>
\`\`\`

#### 2. useActionState Hook:
Manages form action states and returned results, replacing manual loading states:
\`\`\`javascript
const [state, formAction, isPending] = useActionState(asyncAction, initialState);
\`\`\`

#### 3. useFormStatus Hook:
Reads the parent form's submission status (e.g. pending state) to disable submit buttons:
\`\`\`javascript
const { pending } = useFormStatus();
\`\`\`

#### Quiz Questions:
1. **Which React 19 hook retrieves the pending status of a parent form component?**
   *   a) useActionState
   *   b) useFormStatus (Correct)
   *   c) useState
2. **Can you pass an async function directly to a form's action attribute in React 19?**
   *   a) Yes (Correct)
   *   b) No, it must be a string path
   *   c) Only in server components

#### Interview Questions:
* **How does useActionState simplify form validation?**
  *   *Answer:* It tracks the async action's pending state (\`isPending\`) and returned payload (like validation errors or success messages) automatically, reducing form wrapper boilerplate.
* **Why must components consuming useFormStatus be nested inside a <form> element?**
  *   *Answer:* Because \`useFormStatus\` uses context to read the status of the parent form. If the component is not nested inside a \`<form>\` tag, it cannot find the context, returning incorrect status fields.

#### Summary:
React 19 supports functions in form actions. Use \`useActionState\` to manage action states, and \`useFormStatus\` to check parent form submission status.
            `,
            exercise: "Build a form submission component that disables the submit button during active uploads using useFormStatus."
          },
          {
            id: "r-l-4-4",
            title: "SPA Routing: React Router DOM",
            time: "45 min",
            summary: "Single Page App configurations, BrowserRouter, routes definition, dynamic path parameters, and Link component navigations.",
            content: `
### Single Page App Routing: React Router

In Single Page Applications (SPAs), we use client-side routing to swap page views without reloading the page.

#### React Router DOM Core:
* **BrowserRouter:** Wraps the application, enabling path history tracking.
* **Routes & Route:** Maps URL paths to specific page components.
* **Link:** Replaces standard anchor tags (\`<a href>\`), updating the URL and swapping page views without reloading the page.
* **useParams:** Hook to read dynamic path parameters (e.g. \`id\` from \`/users/:id\`).

#### Routing Code Example:
\`\`\`jsx
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

function User() {
  const { id } = useParams();
  return <h2>User Details: {id}</h2>;
}

export default function App() {
  return (
    <BrowserRouter>
      <nav><Link to="/users/1024">View User</Link></nav>
      <Routes>
        <Route path="/users/:id" element={<User />} />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

#### Quiz Questions:
1. **Which component is used in React Router to switch page views without reloading the page?**
   *   a) Anchor tag <a>
   *   b) Link (Correct)
   *   c) Route
2. **What hook reads dynamic URL path parameters like :id in React Router?**
   *   a) useParams() (Correct)
   *   b) useSearchParams()
   *   c) useRoute()

#### Interview Questions:
* **What is the difference between client-side routing and server-side routing?**
  *   *Answer:* Server-side routing requests a new HTML page from the server on every link click. Client-side routing intercepts clicks, updates the browser URL, and swaps components locally using JavaScript, rendering page updates near-instantly.
* **How do you programmatically navigate users in React Router?**
  *   *Answer:* By using the \`useNavigate()\` hook, which returns a navigation callback function (e.g. \`navigate("/dashboard")\`).

#### Summary:
React Router implements client-side SPA routing. Define routes with \`Route\`, handle transitions with \`Link\`, and read parameters with \`useParams()\`.
            `,
            exercise: "Build a router mapping home, dashboard, and dynamic project pages, routing queries using useNavigate."
          },
          {
            id: "r-l-4-5",
            title: "Global Store (Zustand) & Unit Testing",
            time: "50 min",
            summary: "Zustand global stores, actions bindings, testing components using React Testing Library, and fireEvent assertions.",
            content: `
### Zustand & Unit Testing

For large applications, managing global state requires lightweight, fast-updating stores. We also write unit tests to ensure components behave correctly.

#### 1. Global State with Zustand:
Zustand is a fast, boilerplate-free state manager that runs outside the React context tree:
\`\`\`javascript
import { create } from 'zustand';

const useStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 }))
}));
\`\`\`

#### 2. Component Testing (React Testing Library & Jest):
Tests render components in a mock environment to verify layout and assert behavior on user interactions:
\`\`\`javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

test('Counter increments on tap', () => {
  render(<Counter />);
  const button = screen.getByRole('button');
  fireEvent.click(button);
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
\`\`\`

#### Quiz Questions:
1. **Why is Zustand preferred over Redux for many modern React projects?**
   *   a) It runs on mobile backends
   *   b) It offers a clean, boilerplate-free API hook syntax running outside the React context tree (Correct)
   *   c) It deletes state variables
2. **Which method simulates user clicks in React Testing Library?**
   *   a) user.click() (or fireEvent.click()) (Correct)
   *   b) triggerClick()
   *   c) render()

#### Interview Questions:
* **How does Zustand prevent unnecessary component re-renders?**
  *   *Answer:* By using selectors. Components select the specific state slice they need (e.g. \`useStore(state => state.bears)\`). The component re-renders only when that specific slice changes, ignoring changes in other parts of the store.
* **Explain the purpose of screen.getByRole in tests.**
  *   *Answer:* It locates elements using their semantic HTML accessibility role (e.g. finding button tags). This encourages writing accessible HTML markup.

#### Summary:
Zustand manages global state using selectors. React Testing Library renders components in a mock environment to verify layout and test interactions.
            `,
            exercise: "Create a Zustand store managing a list of tasks, and write a test verifying task addition works."
          }
        ]
      }
    ]
  }
];

export const resourcesList = [
  {
    category: "React Resources",
    items: [
      { name: "React 19 Official Documentation", desc: "The official guide for components, hooks, and compiler optimization.", link: "https://react.dev" },
      { name: "Zustand State Manager Repository", desc: "Documentation on setting up stores and selectors.", link: "https://github.com/pmndrs/zustand" },
      { name: "React Testing Library User Guide", desc: "How to render, query, and simulate events in tests.", link: "https://testing-library.com/docs/react-testing-library/intro" }
    ]
  }
];

export const glossary = [
  { term: "Reconciliation", def: "The diffing algorithm React runs to calculate virtual tree changes." },
  { term: "Sound Null Safety", def: "Dart compile guarantee preventing variable runtime null pointer crashes unless marked nullable." },
  { term: "Controlled Input", def: "A form input whose value is bound to and managed by a React state variable." },
  { term: "Batch Update", def: "Grouping multiple state updates together to trigger a single re-render cycle, saving CPU." },
  { term: "Context Provider", def: "A wrapper component sharing state variables down the tree without prop drilling." },
  { term: "Reducer", def: "A pure function calculating the next state based on the current state and an action type." },
  { term: "React Compiler", def: "React 19 compile-time engine automating memoization optimizations." },
  { term: "Portal", def: "ReactDOM method rendering children into DOM nodes located outside the main parent hierarchy." },
  { term: "SPA", def: "Single Page Application - web app using client-side routing to update views without reloads." },
  { term: "Zustand", def: "A lightweight global state manager running outside the React context tree." }
];
