// Complete Web Development Course Data Structure

export const allPhases = [
  {
    id: "wd-phase-1",
    title: "Phase 1: HTML — Structure & Semantics (Weeks 1–4)",
    description: "Learn to build semantic, accessible, and structured web pages from scratch using HTML5 standards.",
    modules: [
      {
        id: "wd-m-1",
        title: "Week 1: Introduction to HTML",
        duration: "1 Week",
        difficulty: "Beginner",
        objectives: [
          "Understand how the web, browsers, and HTTP work",
          "Construct a valid HTML document with correct head and body structure",
          "Utilize core text elements for content hierarchy",
          "Apply global and specific HTML attributes properly"
        ],
        lessons: [
          {
            id: "wd-l-1-1",
            title: "What is HTML?",
            time: "40 min",
            summary: "Browsers, servers, and the role of HyperText Markup Language",
            content: `
### Understanding the Web
Before coding HTML, it is vital to know how the web functions:
*   **Client (Browser):** Asks for pages (HTTP request) and parses code (HTML, CSS, JS) to render a visual layout.
*   **Server:** Stores site files and sends them to clients upon request (HTTP response).
*   **HTML (HyperText Markup Language):** The structural skeleton of every web page. It uses nested *elements* or *tags* to define headings, paragraphs, lists, forms, and more.

#### Syntax of an HTML Element
Most HTML elements have an opening tag, contents, and a closing tag:
\`\`\`html
<p class="intro">Hello, World!</p>
\`\`\`
*   \`<p>\`: Opening tag.
*   \`class="intro"\`: Attribute (name-value pair providing extra metadata).
*   \`Hello, World!\`: Content.
*   \`</p>\`: Closing tag.
            `,
            exercise: "Write a paragraph detailing your goals in web development. Mark up key terms with <strong> or <em> tags."
          },
          {
            id: "wd-l-1-2",
            title: "Document Structure & Attributes",
            time: "45 min",
            summary: "Creating a standard page skeleton and using attributes",
            content: `
### The HTML5 Document Template
Every HTML document must follow a standard structure to render correctly across browsers:
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My First Webpage</title>
</head>
<body>
  <h1>Welcome to Web Development</h1>
  <p>This is my first semantic website page.</p>
</body>
</html>
\`\`\`

#### Key Document Elements:
1.  \`<!DOCTYPE html>\`: Instructs the browser to render using modern HTML5 rules.
2.  \`<html lang="en">\`: Wraps all content and specifies the page language for translation and screen readers.
3.  \`<head>\`: Contains metadata, page titles, and stylesheet links (not visible to visitors).
4.  \`<body>\`: Contains the actual text, images, forms, and widgets visible on the page.
            `,
            exercise: "Create a new file named index.html. Write the basic HTML template, set the title to 'My Sandbox', and write an <h1> heading inside the body."
          }
        ]
      },
      {
        id: "wd-m-2",
        title: "Week 2: Links, Media & Tables",
        duration: "1 Week",
        difficulty: "Beginner",
        objectives: [
          "Create internal, external, and anchor hyperlinks",
          "Embed responsive images with alt text for accessibility",
          "Construct structured tables to present comparative data"
        ],
        lessons: [
          {
            id: "wd-l-2-1",
            title: "Hyperlinks & Media Elements",
            time: "50 min",
            summary: "Linking pages and rendering responsive WebP/SVG images",
            content: `
### The Power of Hyperlinks
Hyperlinks connect documents. They are defined using the anchor (\`<a>\`) element:
\`\`\`html
<a href="https://github.com" target="_blank" rel="noopener noreferrer">Go to GitHub</a>
\`\`\`
*   \`href\`: Path to target URL.
*   \`target="_blank"\`: Opens the link in a new browser tab.
*   \`rel="noopener noreferrer"\`: Essential security tags preventing external tab manipulation.

### Embedding Images
Use the \`<img>\` element. It is a self-closing (void) element requiring \`src\` and \`alt\` attributes:
\`\`\`html
<img src="/assets/profile.webp" alt="Avatar profile picture" loading="lazy" />
\`\`\`
*   \`alt\`: Descriptive screen reader content. Crucial for accessibility!
*   \`loading="lazy"\`: Delays loading the image until it is close to the viewport, improving load speed.
            `,
            exercise: "Create a link targeting google.com that opens in a new window, and embed any free Unsplash image below it."
          },
          {
            id: "wd-l-2-2",
            title: "HTML Tables",
            time: "40 min",
            summary: "Presenting structured layout matrices using semantic cells",
            content: `
### Structuring Data Tables
Tables should only be used for tabular data, never for page layouts.
\`\`\`html
<table>
  <thead>
    <tr>
      <th>Module</th>
      <th>Duration</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>HTML Basics</td>
      <td>4 Weeks</td>
    </tr>
  </tbody>
</table>
\`\`\`
*   \`<thead>\`, \`<tbody>\`, \`<tfoot>\`: Groups row data structurally.
*   \`<tr>\`: Defines a table row.
*   \`<th>\`: Header cell (bold and centered by default, supports accessibility).
*   \`<td>\`: Data cell holding standard text or values.
            `,
            exercise: "Build a table with 3 columns (Week, Title, Status) detailing your course progression. Add at least 3 rows."
          }
        ]
      },
      {
        id: "wd-m-3",
        title: "Week 3: Forms & Semantic HTML",
        duration: "1 Week",
        difficulty: "Beginner",
        objectives: [
          "Build accessible forms with appropriate input validation",
          "Understand and write modern semantic landmark elements"
        ],
        lessons: [
          {
            id: "wd-l-3-1",
            title: "Forms & Input Types",
            time: "60 min",
            summary: "Creating text, email, password, and checkbox inputs",
            content: `
### Creating HTML Forms
Forms capture user inputs. The basic envelope is the \`<form>\` tag:
\`\`\`html
<form action="/submit-form" method="POST">
  <label for="username">Username:</label>
  <input type="text" id="username" name="username" placeholder="Enter name" required />
  
  <label for="user-email">Email:</label>
  <input type="email" id="user-email" name="email" required />
  
  <button type="submit">Register</button>
</form>
\`\`\`

#### Essential Guidelines:
*   Always associate inputs with a \`<label>\` using matching \`id\` and \`for\` attributes.
*   Specify \`type="email"\` or \`type="password"\` to enable built-in mobile layouts and browser validation.
*   Add the \`required\` boolean attribute to prevent blank submissions.
            `,
            exercise: "Build a login form containing username, email, password, and a check box for 'Agree to terms'. Verify validation works by trying to submit empty inputs."
          },
          {
            id: "wd-l-3-2",
            title: "Semantic HTML5 Landmarks",
            time: "45 min",
            summary: "Moving beyond generic divs to structural elements",
            content: `
### Why Semantic HTML Matters
Semantic elements convey the meaning and structure of the document to browsers, crawlers, and assistive technologies (like screen readers):
*   \`<header>\`: Standard top logo/navigation section.
*   \`<nav>\`: Section holding menus and nav lists.
*   \`<main>\`: The primary unique content of the page (only one per document).
*   \`<section>\`: Group of related content, ideally with a heading.
*   \`<article>\`: Self-contained independent content (blog post, forum comment).
*   \`<aside>\`: Sidebar content holding secondary resources or links.
*   \`<footer>\`: Bottom copyrights, navigation lists, and contact info.
            `,
            exercise: "Refactor a simple page containing 3 divs into a semantic document containing header, main, and footer."
          }
        ]
      },
      {
        id: "wd-m-4",
        title: "Week 4: Multimedia & Accessibility Best Practices",
        duration: "1 Week",
        difficulty: "Beginner",
        objectives: [
          "Embed native audio and video players",
          "Apply WCAG accessibility guidelines to HTML document layouts"
        ],
        lessons: [
          {
            id: "wd-l-4-1",
            title: "Multimedia: Audio & Video",
            time: "35 min",
            summary: "Using native HTML5 multimedia wrapper tags",
            content: `
### Audio and Video Players
HTML5 introduced native tags to replace Flash player dependencies:
\`\`\`html
<video src="/assets/trailer.mp4" controls width="640" poster="/assets/poster.webp">
  Your browser does not support native video playback.
</video>
\`\`\`
*   \`controls\`: Displays play, pause, volume, and fullscreen selectors.
*   \`poster\`: Image displayed while video loads or before playing.
*   \`<track>\`: Links subtitle or closed caption WebVTT files.
            `,
            exercise: "Embed a video element onto your page using custom controllers, and add a fallback message inside."
          },
          {
            id: "wd-l-4-2",
            title: "Web Accessibility (a11y) Essentials",
            time: "50 min",
            summary: "Making your web pages readable by screen readers and accessible by keyboard",
            content: `
### The Foundations of a11y
Web accessibility means creating digital layouts usable by everyone, including people with visual, motor, or cognitive impairments.
*   **Semantic Elements:** Native elements (button, input) handle focus management and screen reader labels automatically.
*   **ARIA (Accessible Rich Internet Applications):** Attributes providing accessibility metadata:
    *   \`aria-label\`: Text label read by screen readers.
    *   \`aria-hidden="true"\`: Hides decorative elements from screen readers.
*   **Alt Text:** Always add alt descriptions to images.
*   **Keyboard Navigation:** Users must be able to access interactive links/buttons using the \`Tab\` key.
            `,
            exercise: "Conduct a basic screen reader check on your portfolio: verify all image tags have descriptive alt attributes and links have text descriptions."
          }
        ]
      }
    ]
  },
  {
    id: "wd-phase-2",
    title: "Phase 2: CSS — Styling & Layouts (Weeks 5–9)",
    description: "Master CSS rules, color systems, flexboxes, responsive typography, custom animations, and layout grids.",
    modules: [
      {
        id: "wd-m-5",
        title: "Week 5: CSS Fundamentals",
        duration: "1 Week",
        difficulty: "Beginner",
        objectives: [
          "Link external style sheets and understand syntax selectors",
          "Predict styling overrides using rules of specific inheritance",
          "Understand content sizing boxes"
        ],
        lessons: [
          {
            id: "wd-l-5-1",
            title: "Selectors & Specificity",
            time: "50 min",
            summary: "Understanding selectors, combinations, and stylesheet priorities",
            content: `
### CSS Selectors Syntax
CSS applies rules to HTML nodes. Selectors point to elements:
*   \`h1\`: Type selector (applies to all headers).
*   \`.card\`: Class selector (reusable, targeted).
*   \`#submit-btn\`: ID selector (unique instance, high priority).

#### CSS Combinators:
*   \`div p\`: Descendant selector (all paragraphs inside a div).
*   \`div > p\`: Child selector (only direct paragraph children of a div).

#### Specificity Rules
When conflict occurs, the browser chooses the selector with the highest specificity score:
1.  Inline Styles (e.g. \`style="..."\`) -> Score: 1000
2.  IDs (e.g. \`#btn\`) -> Score: 100
3.  Classes, pseudo-classes (e.g. \`.btn:hover\`) -> Score: 10
4.  Elements (e.g. \`button\`) -> Score: 1
            `,
            exercise: "Given selectors 'div.card #btn' and '.card button', calculate the specificity of each and determine which style override wins."
          },
          {
            id: "wd-l-5-2",
            title: "The Box Model",
            time: "45 min",
            summary: "Visualizing layout margins, borders, and paddings",
            content: `
### The Box Model Breakdown
Every HTML element is represented as a rectangular box. The box consists of:
*   **Content:** The actual text or visual child of the element.
*   **Padding:** Space between the content and the border.
*   **Border:** Line surrounding the padding and content.
*   **Margin:** Outer space separating this element from neighbors.

#### box-sizing: border-box
By default, padding and borders are added to width calculations. Use \`border-box\` to ensure size counts constraints inside the specified width:
\`\`\`css
* {
  box-sizing: border-box;
}
\`\`\`
            `,
            exercise: "Create a CSS card. Apply a width of 300px, padding of 20px, and a border of 5px. Toggle box-sizing: border-box and notice changes in browser width."
          }
        ]
      },
      {
        id: "wd-m-6",
        title: "Week 6: Typography, Colours & Visual Styling",
        duration: "1 Week",
        difficulty: "Beginner",
        objectives: [
          "Import custom fonts and control font variables",
          "Standardize color systems using custom properties",
          "Apply borders, visual overflow offsets, and drop shadows"
        ],
        lessons: [
          {
            id: "wd-l-6-1",
            title: "Web Typography & CSS Custom Properties",
            time: "45 min",
            summary: "Importing fonts and setting up CSS variables",
            content: `
### Setting Up CSS Custom Properties (Variables)
Variables allow you to maintain consistent spacing and color values throughout a project:
\`\`\`css
:root {
  --primary-color: #4f46e5;
  --text-base: #334155;
  --font-sans: 'Inter', sans-serif;
}

body {
  color: var(--text-base);
  font-family: var(--font-sans);
}
\`\`\`

#### Responsive Typography:
Use relative sizes like \`rem\` (based on root font size) or \`clamp()\` to calculate bounds:
\`\`\`css
h1 {
  font-size: clamp(2rem, 5vw, 4rem);
}
\`\`\`
            `,
            exercise: "Declare three custom CSS variables representing brand theme colors and apply them as card backgrounds and texts."
          },
          {
            id: "wd-l-6-2",
            title: "Gradients & Shadows",
            time: "40 min",
            summary: "Adding depth using gradients and box shadows",
            content: `
### Creating Drop Shadows
Shadows add visual hierarchy. Use the \`box-shadow\` property:
\`\`\`css
.card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05);
}
\`\`\`
The parameter layout is: \`box-shadow: horizontal-offset vertical-offset blur-radius spread-radius color\`.

### Background Gradients
Apply linear or radial gradients easily:
\`\`\`css
.header {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
}
\`\`\`
            `,
            exercise: "Design a button containing a linear gradient background that morphs/glows on hover using custom drop-shadow shifts."
          }
        ]
      },
      {
        id: "wd-m-7",
        title: "Week 7: Layouts — Flexbox",
        duration: "1 Week",
        difficulty: "Beginner",
        objectives: [
          "Understand the flex main and cross axes",
          "Align children horizontally and vertically using justify-content and align-items",
          "Control spacing using the gap property"
        ],
        lessons: [
          {
            id: "wd-l-7-1",
            title: "Flexbox: Aligning along Axes",
            time: "55 min",
            summary: "Understanding flex container axis directions",
            content: `
### The Core Concept of Flexbox
Flexbox is a one-dimensional layout model. It aligns items along a **Main Axis** and a **Cross Axis**:
*   \`display: flex\`: Declares a flex container.
*   \`flex-direction\`: Sets the direction of the Main Axis (\`row\` or \`column\`).

#### Aligning Items:
*   \`justify-content\`: Aligns items along the main axis (\`flex-start\`, \`center\`, \`flex-end\`, \`space-between\`, \`space-around\`, \`space-evenly\`).
*   \`align-items\`: Aligns items along the cross axis (\`stretch\`, \`flex-start\`, \`center\`, \`flex-end\`, \`baseline\`).
            `,
            exercise: "Try the Flexbox Live interactive playground (in the widgets panel) to align items into a vertical row center layout."
          },
          {
            id: "wd-l-7-2",
            title: "Flex Items & Spacing",
            time: "40 min",
            summary: "Using grow, shrink, and wrap configurations",
            content: `
### Flex Item Properties
Properties applied to child items of a flex container:
*   \`flex-grow\`: Specifies how much an item should grow relative to other items to fill space.
*   \`flex-shrink\`: Specifies how much an item should shrink if space is limited.
*   \`flex-basis\`: The default size of an item before space distribution.
*   \`flex: 1\`: Shorthand for \`flex-grow: 1; flex-shrink: 1; flex-basis: 0%\`.

#### Flex Wrap & Gaps:
*   \`flex-wrap: wrap\`: Wraps cards/items to the next line if width constraint fails.
*   \`gap: 16px\`: Sets standard spacing borders between children directly.
            `,
            exercise: "Build a responsive grid of 3 profiles using Flexbox. Set gap space parameters and allow items to wrap on narrow screens."
          }
        ]
      },
      {
        id: "wd-m-8",
        title: "Week 8: Layouts — CSS Grid",
        duration: "1 Week",
        difficulty: "Intermediate",
        objectives: [
          "Declare two-dimensional layouts using column/row grid structures",
          "Apply auto-fill and auto-fit rules to create responsive content arrays"
        ],
        lessons: [
          {
            id: "wd-l-8-1",
            title: "Grid Columns & Rows",
            time: "60 min",
            summary: "Building structured column-based layouts",
            content: `
### Two-Dimensional Grids
Unlike Flexbox, CSS Grid handles both columns and rows simultaneously.
\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 20px;
}
\`\`\`
*   \`repeat(3, 1fr)\`: Creates three columns of equal fractions (\`fr\`) of the container's width.
*   \`gap\`: Handles both column and row separation margins simultaneously.
            `,
            exercise: "Create a grid containers wrapper. Place 6 small blocks inside. Render them as a 3-column table using fr units."
          },
          {
            id: "wd-l-8-2",
            title: "Responsive Grids: auto-fit & minmax",
            time: "50 min",
            summary: "Designing auto-responsive grids without media queries",
            content: `
### The Power of minmax() and auto-fit
You can create a fully responsive multi-card layout without writing a single media query:
\`\`\`css
.grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}
\`\`\`
*   \`minmax(250px, 1fr)\`: Column is at least 250px wide, growing to cover remaining spacing fractions.
*   \`auto-fit\`: Calculates column grids dynamically based on wrapping space.
            `,
            exercise: "Build a responsive card grid using grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)). Resize the browser frame to verify layout wrapping."
          }
        ]
      },
      {
        id: "wd-m-9",
        title: "Week 9: Responsive Design & Advanced CSS",
        duration: "1 Week",
        difficulty: "Intermediate",
        objectives: [
          "Write media queries targeting modern mobile breakpoints",
          "Compose animations using @keyframes and transition triggers"
        ],
        lessons: [
          {
            id: "wd-l-9-1",
            title: "Media Queries & Mobile Breakers",
            time: "45 min",
            summary: "Creating mobile-first responsive stylesheets",
            content: `
### Designing for Mobile Screens
A mobile-first workflow styles elements for mobile layout defaults, then queries desktop scaling:
\`\`\`css
.card {
  width: 100%;
  padding: 10px;
}

@media (min-width: 768px) {
  .card {
    width: 33.33%;
    padding: 20px;
  }
}
\`\`\`
*   \`@media (min-width: 768px)\`: Rules are applied only on screens 768px or wider.
            `,
            exercise: "Write a media query that hides a side menu on mobile viewports (< 768px) and displays it on desktop screens."
          },
          {
            id: "wd-l-9-2",
            title: "Transitions & Keyframe Animations",
            time: "50 min",
            summary: "Animating elements using properties transitions and transitions keyframes",
            content: `
### CSS Transitions
Transitions create smooth changes when hover states change:
\`\`\`css
.btn {
  background-color: #4f46e5;
  transition: background-color 0.3s ease;
}
.btn:hover {
  background-color: #7c3aed;
}
\`\`\`

### CSS Keyframe Animations
Define complex, loop-based animations:
\`\`\`css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.bounce-el {
  animation: bounce 2s infinite ease-in-out;
}
\`\`\`
            `,
            exercise: "Build an interactive pulse load indicator. Animate color and scale parameters recursively using @keyframes."
          }
        ]
      }
    ]
  },
  {
    id: "wd-phase-3",
    title: "Phase 3: JavaScript — Programming & Interactivity (Weeks 10–16)",
    description: "Write structural logic, control flow, functions, DOM manipulators, API retrievals, and class architectures.",
    modules: [
      {
        id: "wd-m-10",
        title: "Week 10: JavaScript Fundamentals",
        duration: "1 Week",
        difficulty: "Beginner",
        objectives: [
          "Declare variables using let, const and verify primitive types",
          "Apply conditionals, logical operators, and comparison expressions"
        ],
        lessons: [
          {
            id: "wd-l-10-1",
            title: "Variables & Primitive Types",
            time: "50 min",
            summary: "Writing JavaScript scripts, declaring states, and verifying types",
            content: `
### Introduction to JS Scripting
JavaScript is a high-level, interpreted scripting language designed to add interactivity and logic to HTML pages.

#### Declaring Variables:
*   \`const\`: Reusable constant reference. Cannot be re-assigned. Default choice!
*   \`let\`: Variables that will be re-assigned during runtime.
*   \`var\`: Legacy syntax (avoid due to scope hoisting issues).

#### Primitive Data Types:
*   \`String\`: Text blocks wrapped in quotes or backticks.
*   \`Number\`: Integers or decimals.
*   \`Boolean\`: \`true\` or \`false\`.
*   \`null\`: Intentional absence of value.
*   \`undefined\`: Variable declared but not assigned.
            `,
            exercise: "Declare three const variables of types string, number, and boolean. Print values and their type checks using console.log(typeof ...)."
          },
          {
            id: "wd-l-10-2",
            title: "Control Flow & Arrays",
            time: "45 min",
            summary: "Creating conditionals, loops, and list variables",
            content: `
### Conditionals & Logic
Evaluate conditions to decide branch logic execution:
\`\`\`javascript
const score = 85;

if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 80) {
  console.log("Grade: B");
} else {
  console.log("Grade: F");
}
\`\`\`

### Loops & Arrays
Arrays store ordered list elements:
\`\`\`javascript
const courses = ["HTML", "CSS", "JS"];

for (let i = 0; i < courses.length; i++) {
  console.log("Index " + i + ": " + courses[i]);
}
\`\`\`
            `,
            exercise: "Write a for loop that iterates numbers from 1 to 15, printing 'Fizz' if divisible by 3, 'Buzz' if divisible by 5, or the number otherwise."
          }
        ]
      },
      {
        id: "wd-m-11",
        title: "Week 11: Functions & Scope",
        duration: "1 Week",
        difficulty: "Beginner",
        objectives: [
          "Declare standard and arrow functions with inputs and returns",
          "Differentiate lexical scopes and understand JavaScript closures"
        ],
        lessons: [
          {
            id: "wd-l-11-1",
            title: "Functions: Syntax & Returns",
            time: "40 min",
            summary: "Declaring reusable operations and arrow functions",
            content: `
### Reusable Code Blocks
Functions bundle operations.
\`\`\`javascript
// Declared Function
function add(a, b) {
  return a + b;
}

// Arrow Function Expression (ES6)
const multiply = (a, b) => a * b;

console.log(add(5, 3)); // 8
console.log(multiply(4, 2)); // 8
\`\`\`
            `,
            exercise: "Write a function 'calculateTax' that accepts a price and tax percentage rate, returning the total cost. Set a default tax rate of 15%."
          },
          {
            id: "wd-l-11-2",
            title: "Scope & Array Iteration Methods",
            time: "50 min",
            summary: "Understanding execution scope boundaries and higher-order iteration functions",
            content: `
### Lexical Scope
Scope determines variable access boundaries.
*   **Global Scope:** Declared outside functions, accessible everywhere.
*   **Block Scope:** Declared inside block braces \`{}\` using \`let\` or \`const\`.

### Higher-Order Array Iteration
Modern JavaScript rarely uses standard for-loops. We use array iterators:
*   \`.map()\`: Transforms each element, returning a new array.
*   \`.filter()\`: Keeps elements matching tests, returning filtered lists.
*   \`.forEach()\`: Runs execution code on each item.
            `,
            exercise: "Write an array of numbers. Use .filter() to extract even numbers, then use .map() to double them."
          }
        ]
      },
      {
        id: "wd-m-12",
        title: "Week 12: Objects & the DOM",
        duration: "1 Week",
        difficulty: "Beginner",
        objectives: [
          "Manipulate JavaScript object properties and nested nodes",
          "Select DOM elements and modify attributes and textual data"
        ],
        lessons: [
          {
            id: "wd-l-12-1",
            title: "Objects & Structures",
            time: "45 min",
            summary: "Handling key-value data models and destructuring",
            content: `
### Key-Value Entities
Objects group properties:
\`\`\`javascript
const user = {
  name: "Ishaan",
  role: "Developer",
  greet: function() {
    return \`Hi, I am \${this.name}\`;
  }
};

// Destructuring properties
const { name, role } = user;
console.log(name); // Ishaan
\`\`\`
            `,
            exercise: "Create a 'book' object containing title, author, and year properties. Add a method that displays description text."
          },
          {
            id: "wd-l-12-2",
            title: "DOM Node Selection & Edits",
            time: "50 min",
            summary: "Selecting document nodes and editing styling states",
            content: `
### The Document Object Model (DOM)
The DOM is a structured API mapping HTML files to objects. JavaScript can select, insert, or delete nodes using target methods:
\`\`\`javascript
// Select a single node
const headerEl = document.querySelector("#brand-header");

// Edit text content
headerEl.textContent = "New Brand Title";

// Add styling classes
headerEl.classList.add("text-gradient");
\`\`\`
            `,
            exercise: "Use the JS DOM Debugger widget in the playground sidebar to see how classList operations add styling borders to DOM nodes dynamically."
          }
        ]
      },
      {
        id: "wd-m-13",
        title: "Week 13: Events & Advanced DOM",
        duration: "1 Week",
        difficulty: "Intermediate",
        objectives: [
          "Attach event listeners and capture event details",
          "Implement event delegation strategies for dynamic lists"
        ],
        lessons: [
          {
            id: "wd-l-13-1",
            title: "Event Listeners & Actions",
            time: "45 min",
            summary: "Listening to user clicks, keyboard inputs, and scrolls",
            content: `
### Listening to User Events
We use \`addEventListener\` to run actions on user events:
\`\`\`javascript
const button = document.querySelector("#trigger-btn");

button.addEventListener("click", (event) => {
  console.log("Button clicked!");
  console.log("Coordinates: ", event.clientX, event.clientY);
});
\`\`\`

#### Common Event Types:
*   \`click\`: Left-click mouse action.
*   \`input\`: Fired when text input value changes.
*   \`submit\`: Fired when forms submit (always use \`e.preventDefault()\` to stop reloading).
            `,
            exercise: "Bind a click event to a button. When clicked, toggle the page background color between Light and Dark values."
          },
          {
            id: "wd-l-13-2",
            title: "Event Bubbling & Delegation",
            time: "45 min",
            summary: "Optimizing event loops using event delegation tricks",
            content: `
### Event Propagation: Bubbling
When an event fires on a node, it propagates up to parent elements in the DOM.

#### Event Delegation
Instead of adding event listeners to 100 individual list items (which slows down performance), add one listener to the parent container and evaluate \`e.target\`:
\`\`\`javascript
const list = document.querySelector("#item-list");

list.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    console.log("Clicked item: ", e.target.textContent);
  }
});
\`\`\`
            `,
            exercise: "Build a dynamic task list. Using event delegation, click any item in the list to remove it from the DOM."
          }
        ]
      },
      {
        id: "wd-m-14",
        title: "Week 14: Asynchronous JavaScript",
        duration: "1 Week",
        difficulty: "Intermediate",
        objectives: [
          "Understand the JavaScript Single Thread Event Loop",
          "Instantiate and resolve Promises using .then() and async/await syntax"
        ],
        lessons: [
          {
            id: "wd-l-14-1",
            title: "The Event Loop & Callbacks",
            time: "40 min",
            summary: "Analyzing JavaScript single thread execution engines",
            content: `
### Asynchronous JavaScript
JavaScript runs on a single main thread. To avoid blocking the browser during heavy network fetches or file reads, it registers asynchronous tasks:
\`\`\`javascript
console.log("Start");

setTimeout(() => {
  console.log("Timeout task complete");
}, 2000);

console.log("End");
\`\`\`
*   Output: Start -> End -> (2 seconds delay) -> Timeout task complete.
            `,
            exercise: "Write a script that displays a timer counter counting up every 1 second in the console. Stop the timer after 5 seconds."
          },
          {
            id: "wd-l-14-2",
            title: "Promises & async/await",
            time: "50 min",
            summary: "Writing clean async scopes using await keywords",
            content: `
### Resolving Asynchronous Operations
Promises represent the eventual completion (or failure) of an async operation.

#### Modern async/await Syntax:
\`\`\`javascript
const fetchUserData = async () => {
  try {
    const data = await simulateApiRequest();
    console.log("User data retrieved: ", data);
  } catch (error) {
    console.error("API error encountered: ", error);
  }
};
\`\`\`
The \`await\` keyword pauses execution until the promise resolves, simplifying code structure compared to nested \`.then()\` callbacks.
            `,
            exercise: "Write a simulated promise that resolves after 1.5 seconds. Call it inside an async function using the try/catch format."
          }
        ]
      },
      {
        id: "wd-m-15",
        title: "Week 15: APIs, Storage & Error Handling",
        duration: "1 Week",
        difficulty: "Intermediate",
        objectives: [
          "Fetch remote JSON data from external public web APIs",
          "Read and write persistent objects inside browser LocalStorage"
        ],
        lessons: [
          {
            id: "wd-l-15-1",
            title: "APIs & Fetch Requests",
            time: "50 min",
            summary: "Fetching real-world remote JSON data",
            content: `
### Connecting with External APIs
Use native \`fetch()\` to query endpoint data:
\`\`\`javascript
const fetchWeather = async () => {
  const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true");
  if (!response.ok) {
    throw new Error("Network response failed");
  }
  const data = await response.json();
  console.log("Current temperature: ", data.current_weather.temperature);
};
\`\`\`
*   \`.json()\`: Parses the HTTP body streams into a usable JavaScript object.
            `,
            exercise: "Write a fetch function targeting the Open-Meteo weather API. Fetch coordinates of your city and log the results."
          },
          {
            id: "wd-l-15-2",
            title: "Web Storage: LocalStorage",
            time: "40 min",
            summary: "Persisting data across browser page reloads",
            content: `
### Persisting State
Browser variables reset on page refresh. To save state permanently, use \`localStorage\`:
\`\`\`javascript
const settings = { theme: "dark", volume: 80 };

// Storing objects (must convert to JSON strings first)
localStorage.setItem("user_settings", JSON.stringify(settings));

// Retrieving settings
const saved = localStorage.getItem("user_settings");
const parsed = JSON.parse(saved);
console.log(parsed.theme); // dark
\`\`\`
            `,
            exercise: "Create a simple text input. When text changes, store it in localStorage. Verify it is still there when you refresh the page."
          }
        ]
      },
      {
        id: "wd-m-16",
        title: "Week 16: Modern JavaScript, OOP & Capstone Project",
        duration: "1 Week",
        difficulty: "Advanced",
        objectives: [
          "Implement class-based architectures and prototype rules",
          "Build and deploy a complete, modular, interactive front-end web application"
        ],
        lessons: [
          {
            id: "wd-l-16-1",
            title: "Object-Oriented Programming (OOP) in JavaScript",
            time: "50 min",
            summary: "Declaring ES6 classes and inheritance guidelines",
            content: `
### Object-Oriented JS Classes
ES6 classes wrap prototypes in a clean, maintainable structure:
\`\`\`javascript
class Developer {
  constructor(name, language) {
    this.name = name;
    this.language = language;
  }
  
  writeCode() {
    return \`\${this.name} is writing \${this.language} script...\`;
  }
}

const ishaan = new Developer("Ishaan", "JavaScript");
console.log(ishaan.writeCode()); // Ishaan is writing JavaScript script...
\`\`\`
            `,
            exercise: "Build a class 'Account' containing a balance property, and create methods for withdraw and deposit."
          },
          {
            id: "wd-l-16-2",
            title: "Final Capstone Challenge",
            time: "120 min",
            summary: "Building and deploying a dynamic web application",
            content: `
### Course Completion Milestone
Your final milestone is to synthesize everything you have learned in HTML, CSS, and JavaScript.

#### Capstone Requirements:
1.  **Semantic Layout:** A fully structured HTML5 page (header, main, section, footer).
2.  **Modern CSS Layout:** Grid for dashboard cards, Flexbox for navigation list items.
3.  **Local Storage Cache:** Persists user settings, inputs, or selections.
4.  **Async Fetch Engine:** Queries weather, posts, or news data from a public endpoint.
5.  **Interactive Forms:** Performs input validations before firing actions.
            `,
            exercise: "Select your Capstone Project (e.g. Weather Dashboard, Personal Expense Tracker, or Recipe Hub). Build it locally and deploy it to Netlify or GitHub Pages."
          }
        ]
      }
    ]
  }
];

export const resourcesList = [
  {
    category: "Development Editors",
    items: [
      { name: "Visual Studio Code (VS Code)", desc: "The standard modern lightweight code editor.", link: "https://code.visualstudio.com" },
      { name: "CodePen Sandbox Editor", desc: "Instantly preview HTML/CSS edits in the browser.", link: "https://codepen.io" }
    ]
  },
  {
    category: "Learning Guides",
    items: [
      { name: "MDN Web Docs (HTML/CSS/JS)", desc: "The official web reference manual by Mozilla.", link: "https://developer.mozilla.org" },
      { name: "JavaScript.info Handbook", desc: "Deep dive explanations from basic operators to prototypes.", link: "https://javascript.info" }
    ]
  }
];

export const glossary = [
  { term: "HTML", def: "HyperText Markup Language - defines the structural document nodes." },
  { term: "CSS", def: "Cascading Style Sheets - defines layout styling, sizes, grids, and colors." },
  { term: "DOM", def: "Document Object Model - the object API tree mapping html elements to JS variables." },
  { term: "Event Listener", def: "A listener attached to DOM nodes that fires callback actions when clicked or key pressed." },
  { term: "Fetch API", def: "Asynchronous HTTP client interface targeting JSON endpoints in modern JS." },
  { term: "Flexbox", def: "One-dimensional elastic grid layout structure." },
  { term: "CSS Grid", def: "Two-dimensional rows and columns layout workspace." }
];
