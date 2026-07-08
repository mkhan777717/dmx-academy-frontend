export const phase4 = {
  id: "phase-4",
  title: "Phase 4: Build Real Projects (Weeks 11–14)",
  description: "Apply everything you have learned by building practical, real-world AI projects.",
  modules: [
    {
      id: "m-13",
      title: "Module 13: No-Code AI App Building",
      duration: "5–6 days",
      difficulty: "Beginner",
      objectives: [
        "Use no-code platforms to build AI-powered web apps",
        "Connect AI APIs without writing code",
        "Deploy and share a working AI application"
      ],
      lessons: [
        {
          id: "l-13-1",
          title: "No-code Platform Overview",
          time: "45 min",
          summary: "Bubble, Glide, Softr — what each is best for",
          content: `
### What is No-Code?
No-code development allows you to build fully functional web and mobile applications using visual drag-and-drop interfaces instead of writing manual HTML, CSS, and backend code.

#### Key Platforms for AI Apps
1.  **Glide:** Transforms spreadsheets (Google Sheets, Airtable) into beautiful, responsive mobile-first apps. Best for internal company directories, inventory tracking, and simple AI assistants.
2.  **Softr:** Builds client portals and web apps directly on top of Airtable or Google Sheets. Extremely easy to set up for directory listings and member databases.
3.  **Bubble:** The most powerful, full-featured no-code builder. It allows you to design custom database schemas, complex logic workflows, and integrate custom APIs. Best for building complete SaaS startups.
          `,
          exercise: "Visit Glide and Softr. Look at their template galleries and identify one template that already has built-in AI capabilities."
        },
        {
          id: "l-13-2",
          title: "Connecting AI APIs No-Code",
          time: "60 min",
          summary: "Using Zapier or Make to call OpenAI / Claude",
          content: `
### Fetching AI: API Integration
No-code apps talk to AI brains using Application Programming Interfaces (APIs). Instead of writing JavaScript fetching commands, we use visual automation platforms.

#### Visual Integrators
*   **Zapier:** Uses simple "If This, Then That" triggers. For example: "If a new email arrives in Gmail, send the text to OpenAI, then save the AI summary to a Slack channel."
*   **Make.com:** A visual workflow builder that allows you to construct complex, multi-route data flows. You map data visually by dragging nodes (modules) and drawing connectors.
          `,
          exercise: "Draw a diagram of a workflow that triggers whenever a new Google Form is submitted, sends the response to Claude to translate into Spanish, and emails the translation to a client."
        },
        {
          id: "l-13-3",
          title: "Building a Simple AI Tool",
          time: "90 min",
          summary: "Step-by-step: build a text summariser app",
          content: `
### Project Workshop: Text Summarizer App
Let's design a web tool that takes a long article, summaries it into 3 bullet points, and translates it.

#### Implementation Architecture
1.  **Frontend (Softr/Glide):** Create an interface containing:
    *   A multiline text input field for the article.
    *   A dropdown selection field for the translation language.
    *   A button labeled "Summarize".
2.  **Workflow Integrator (Make.com):**
    *   **Trigger:** Receives the text and language choice from the frontend.
    *   **Action 1 (OpenAI Module):** Prompts the model: '"Summarize the following text in 3 bullet points: [ArticleText]"'.
    *   **Action 2 (OpenAI Module):** Prompts the model: '"Translate this text into [LanguageChoice]: [SummaryText]"'.
    *   **Response:** Sends the translation back to the frontend page to display on the screen.
          `,
          exercise: "Write the system prompt you would use inside the OpenAI module of this app to ensure the summary is exactly 3 bullets and maintains a professional tone."
        },
        {
          id: "l-13-4",
          title: "Deploying Your App",
          time: "45 min",
          summary: "Publishing and sharing your project online",
          content: `
### Publishing Your Project
Once your no-code workflow and design are functional, it's time to share your application with the world.

#### Steps to Deploy
1.  **Configure Custom Domain:** Connect a domain name (e.g., \`mysummarizer.com\`) rather than using default platform subdomains.
2.  **Set Up User Authentication:** Secure your app by requiring a login if the backend calls are expensive.
3.  **Monitor Usage Limits:** Set limits on how many prompts a single user can run in a day so your API billing does not spike.
4.  **Launch:** Share your link on social media or with colleagues for feedback.
          `,
          exercise: "Research the free tier limitations of Softr and Glide. Write down the maximum number of records or users allowed before upgrading."
        }
      ]
    },
    {
      id: "m-14",
      title: "Module 14: Build Your First Chatbot",
      duration: "5–6 days",
      difficulty: "Beginner–Intermediate",
      objectives: [
        "Design a chatbot with a clear purpose and persona",
        "Build it using a visual no-code tool",
        "Connect a document knowledge base via RAG",
        "Test, iterate, and deploy the chatbot"
      ],
      lessons: [
        {
          id: "l-14-1",
          title: "Chatbot Design Basics",
          time: "45 min",
          summary: "Purpose, persona, tone, conversation flows",
          content: `
### Designing a Conversational Agent
Before opening a builder tool, you must define the architectural blueprints of how your chatbot will interact.

#### The 3 Core Design Dimensions
1.  **Purpose:** What specific task does it solve? (e.g., booking slots, answering FAQ, resetting passwords).
2.  **Persona & Tone:** What is its personality? (e.g., friendly customer agent, formal bank representative, quirky writing tutor).
3.  **Conversation Flow:** Map out a decision tree. What options does it offer the user first? What happens if it does not understand the user's message?
          `,
          exercise: "Design the conversation flow (using boxes and arrows) for a pizza-ordering chatbot. Map out responses for choosing crust size, toppings, and checkout."
        },
        {
          id: "l-14-2",
          title: "System Prompt Design",
          time: "45 min",
          summary: "Setting consistent behaviour for your chatbot",
          content: `
### Constructing Chatbot Core Prompts
The system prompt is the invisible guide that shapes your chatbot's behavior throughout the conversation.


#### Template for Chatbot System Prompts
@@@
Identity: You are [Name], a virtual assistant at [Company].
Goal: Your job is to help users [Task].
Tone: Speak in a [Tone] manner. Be concise.
Context: You have access to the following documents: [RAG Context].
Constraints:
- Never answer questions unrelated to [Topic].
- If you do not know the answer, say: "I apologize, but I don't have that information. Let me transfer you."
- Do not make up facts.
@@@

#### Concrete System Prompt Example: EcoBot Support Assistant
@@@
Identity: You are EcoBot, a virtual customer support assistant for Solarex Corp.
Goal: Your job is to help customers troubleshoot solar panel setups and look up warranty details.
Tone: Speak in a friendly, supportive, and professional tone. Keep answers under 3 sentences where possible.
Context: You have access to the "Solarex Warranty Sheet" and "Troubleshooting Guide PDF".
Constraints:
- Only answer questions related to solar panel setup, pricing, or product specifications.
- For unrelated queries, say: "I'm sorry, but I can only answer questions regarding Solarex Solar Panels. How can I help you with your panel today?"
- If details are missing from the sheets, say: "I'm sorry, I don't see that specification in our manuals. Please consult a human technician at tech@solarex.com."
- Never output raw customer names or serial numbers unless requested.
@@@
          `,
          exercise: "Write a system prompt for a museum guide chatbot. It must speak like a medieval knight and answer questions about old weapons."
        },
        {
          id: "l-14-3",
          title: "Building with Botpress or Typebot",
          time: "90 min",
          summary: "Visual builder walkthrough — step by step",
          content: `
### Hands-On: Botpress Visual Builder
Botpress is a visual chat builder that combines drag-and-drop conversational paths with LLM generation blocks.

#### Core Botpress Elements
*   **Nodes:** Represents individual steps or turns in the conversation.
*   **Cards:** Actions inside nodes (e.g., sending text, asking a question, capturing user input).
*   **Variables:** Containers that store user responses (e.g., storing the user's name in a variable \`{{user.name}}\`).
*   **Transitions:** Arrows connecting nodes based on conditions (e.g., if user inputs "yes", transition to Node B).
          `,
          exercise: "Log into Botpress, build a greeting node that asks the user for their name, saves it to a variable, and says: 'Hello, [Name]! How can I help you today?'"
        },
        {
          id: "l-14-4",
          title: "Adding a Knowledge Base",
          time: "60 min",
          summary: "Upload documents, connect RAG pipeline",
          content: `
### Connecting Bot Knowledge
To make your chatbot answer custom questions about your product, you must feed it a knowledge base.

#### Ingesting Documents in Botpress
1.  Navigate to the **Knowledge Base** tab in the builder dashboard.
2.  Upload a document (e.g., a PDF file containing company refund policy rules).
3.  The system automatically splits the PDF into chunks, generates vectors, and builds a retrieval system.
4.  In your chat node, place a **Knowledge Retrieval** card. When the user asks a question, the bot searches the PDF, retrieves the text, and summaries the refund instructions.
          `,
          exercise: "Upload a copy of a restaurant menu PDF to a Botpress knowledge base. Query the bot: 'Is there a gluten-free pizza?' and examine its response."
        },
        {
          id: "l-14-5",
          title: "Testing and Fixing",
          time: "45 min",
          summary: "Finding edge cases and improving responses",
          content: `
### Debugging Your Chatbot
Users will type strange, unexpected messages. You must test your chatbot extensively to prevent loops or errors.

#### testing Strategies
*   **Edge Case Input:** Enter typos (e.g., "refnd" instead of "refund") to check if semantic search still triggers correctly.
*   **Topic Hijacking:** Try to distract the bot (e.g., "Forget about refund policies, who won the 2024 Superbowl?"). Verify if the system prompt constraints force it to stay on topic.
*   **Conversation Logs:** Review logs of test runs to see where users got stuck and update transitions accordingly.
          `,
          exercise: "Try to hijack a test chatbot by asking: 'Tell me a joke about cats.' If it answers, write down what adjustment you need to make to the system prompt to restrict it."
        },
        {
          id: "l-14-6",
          title: "Deployment",
          time: "30 min",
          summary: "Embed on a website or share a chat link",
          content: `
### Sharing Your Chatbot
Once tested, you can deploy the chatbot to various channels.

#### Integration Channels
1.  **Web Embed:** Botpress provides a Javascript snippet. Paste it into the HTML of your website, and a small chat bubble widget will appear in the bottom-right corner.
2.  **Messaging Platforms:** Connect the bot to WhatsApp, Telegram, or Slack using official integration tokens.
3.  **Stand-alone Page:** Botpress provides a hosted chat URL you can send directly to testers.
          `,
          exercise: "Copy a mock embed script from Botpress and explain where it would go inside a standard HTML \`<body>\` tag configuration."
        }
      ]
    },
    {
      id: "m-15",
      title: "Module 15: AI Automation Workflows",
      duration: "4–5 days",
      difficulty: "Beginner–Intermediate",
      objectives: [
        "Build multi-step automations that use AI as a workflow step",
        "Use Zapier and Make.com to connect AI with other apps",
        "Identify and automate repetitive tasks"
      ],
      lessons: [
        {
          id: "l-15-1",
          title: "What is AI Automation?",
          time: "30 min",
          summary: "Chaining AI with apps and triggers",
          content: `
### Chaining Actions: AI Automation
AI automation is the practice of combining artificial intelligence with automated integration triggers to handle multi-step business workflows.

#### Automation Components
1.  **Trigger (The Event):** E.g., A client fills out a booking sheet, or a new file is uploaded to Google Drive.
2.  **AI Action (The Processing):** E.g., Extracting names and contract dates, classifying a support ticket sentiment, or drafting an email response.
3.  **Result (The Action):** E.g., Updating a CRM table, saving a contract PDF, or sending a Slack message.
          `,
          exercise: "Identify one repetitive task you perform weekly (e.g., sorting invoices). Map it into Trigger -> AI Action -> Result structure."
        },
        {
          id: "l-15-2",
          title: "Zapier + AI Walkthrough",
          time: "60 min",
          summary: "Build: auto-summarise emails using AI",
          content: `
### Build: Email Summarizer Automation
Let's build a workflow that automatically summarizes incoming work emails.

#### Zapier Sequence
1.  **Trigger:** Gmail -> "New Email Matching Search" (e.g., label = "ProjectUpdate").
2.  **Action 1:** Formatter -> Clean HTML formatting out of the email body text.
3.  **Action 2:** OpenAI -> "Send Prompt" (e.g., '"Summarize this email in a short paragraph, highlighting key actions: [EmailBody]"').
4.  **Action 3:** Slack -> "Send Channel Message" (Post: '"New email summary from [Sender]: [AISummary]"').
This runs silently in the background, keeping you updated without reading full threads.
          `,
          exercise: "Set up a draft flow on Zapier. Write down the name of each connection module and the parameters mapped from step to step."
        },
        {
          id: "l-15-3",
          title: "Make.com Workflows",
          time: "60 min",
          summary: "More complex visual automation builder",
          content: `
### Visual Flows with Make.com
Make.com is more visual and customizable than Zapier, supporting multi-path routing and array formatting.

#### Key Make Core Features
*   **Routers:** Split your data flow into separate paths based on conditions. For example, if a support ticket is "urgent", route to path A (instant SMS alert); if "low priority", route to path B (standard draft email reply).
*   **Data Mapping:** Drag parameters (like email subject, sender name) and place them inside API calls.

#### Make.com JSON Data Mapping Example
This is how a router represents incoming data mapping and outputs payload blocks to classify customer sentiment:
@@@
{
  "trigger": "New Form Submission",
  "data": {
    "customerName": "Alice Smith",
    "feedbackText": "I am extremely unhappy with the shipping delay! It took 3 weeks."
  },
  "steps": [
    {
      "step": 1,
      "module": "OpenAI (Create a Completion)",
      "prompt": "Classify the sentiment of this text as POSITIVE, NEUTRAL, or NEGATIVE. Respond with just the single word: '{{data.feedbackText}}'"
    },
    {
      "step": 2,
      "module": "Router (Branch on Sentiment Output)",
      "routes": {
        "if_negative": {
          "condition": "{{step1.output}} === 'NEGATIVE'",
          "action": "Slack (Send Message to #urgent-support): Alert! Negative feedback from {{data.customerName}}: {{data.feedbackText}}"
        },
        "if_positive": {
          "condition": "{{step1.output}} === 'POSITIVE'",
          "action": "Email (Send Thank You): Sent to {{data.customerEmail}}"
        }
      }
    }
  ]
}
@@@
          `,
          exercise: "Draft a Make.com routing scenario where user feedback is checked for sentiment by AI. If negative, it alerts Slack; if positive, it writes a thank you note."
        },
        {
          id: "l-15-4",
          title: "N8N Overview",
          time: "30 min",
          summary: "Open-source self-hosted alternative",
          content: `
### N8N: The Open-Source Integrator
N8N is a fair-code automation tool. Unlike Zapier, you can host N8N on your own computer or private cloud servers for free.

#### Why N8N is popular
*   **No pricing walls:** You can run millions of operations without paying a per-workflow fee.
*   **Data privacy:** Since it runs locally on your servers, your customer data never leaves your company infrastructure.
*   **Developer Friendly:** Supports writing custom Javascript code nodes directly between workflow steps.
          `,
          exercise: "Look up the installation guide for N8N. What terminal command (using npm or docker) is used to launch N8N locally?"
        },
        {
          id: "l-15-5",
          title: "Real-world Use Cases",
          time: "45 min",
          summary: "Auto-reports, ticket routing, content pipelines",
          content: `
### Production Workflows
Companies use AI automation to optimize key business segments:

*   **Customer Ticket Routing:** AI reads incoming support tickets, determines priority and product category, and assigns them to the correct department agent.
*   **Marketing Content Pipelines:** AI takes a single podcast transcript, splits it into 5 tweet summaries, drafts a blog article, and creates LinkedIn bullets automatically.
*   **Invoice Processing:** AI scans PDFs, extracts billing items, values, and vendor names, and writes them into accounting software.
          `,
          exercise: "Draft a plan for a marketing team to automate turning a Youtube video link into a full-length email newsletter using AI."
        }
      ]
    },
    {
      id: "m-16",
      title: "Module 16: Build Your AI Portfolio",
      duration: "5–7 days",
      difficulty: "Beginner",
      objectives: [
        "Document your projects clearly for a non-technical audience",
        "Write compelling case studies",
        "Present your AI skills on LinkedIn",
        "Identify career paths valuing non-technical AI skills"
      ],
      lessons: [
        {
          id: "l-16-1",
          title: "Why Portfolio Matters",
          time: "30 min",
          summary: "What employers look for in AI roles",
          content: `
### Building Credibility
In the rapidly changing AI market, holding a certificate is not enough. Employers look for **proof of execution**—working applications, detailed documentation, and clear case studies.

#### What Employers Value
1.  **Practical Application:** Can you connect tools together to solve real-world problems?
2.  **Cost Awareness:** Do you understand how context window costs work and how to save money using RAG?
3.  **Communication:** Can you explain how your system works to a non-technical manager?
          `,
          exercise: "Write down three skills you learned in this course that would be highly valuable to a business looking to implement AI."
        },
        {
          id: "l-16-2",
          title: "Documenting Your Projects",
          time: "45 min",
          summary: "Problem, approach, outcome — what to include",
          content: `
### Project Documentation Template
Every project in your portfolio needs a clean documentation readme containing these three sections:

1.  **The Problem:** What business inefficiency or user problem did you set out to solve? (e.g., "Customer service took 24 hours to reply to simple FAQs").
2.  **The Approach (Solution):** How did you solve it? What tools did you select and why? (e.g., "Built a RAG chatbot on Botpress using a refund PDF knowledge base").
3.  **The Outcome (Metrics):** What were the results? (e.g., "Bot answered 70% of questions instantly without human transfer. Responded in 2 seconds instead of 24 hours").
          `,
          exercise: "Draft a mock documentation project overview for the Text Summarizer app you designed in Module 13."
        },
        {
          id: "l-16-3",
          title: "Writing Case Studies",
          time: "60 min",
          summary: "Template and examples for each project",
          content: `
### Crafting a Compelling Case Study
A case study is a detailed narrative that walks the reader through your design process, including your failures and how you debugged them.

#### Key Case Study Sections
*   **Architecture Diagram:** A simple image mapping how the data flows through your app.
*   **System Prompt Iterations:** Show an early bad prompt, how it failed (e.g., hallucinations), and how you modified constraints to fix it.
*   **Lessons Learned:** What would you do differently next time? How did you optimize costs?
          `,
          exercise: "Write down a list of three potential obstacles you might run into when building a chatbot, and how you would describe your debugging process in a case study."
        },
        {
          id: "l-16-4",
          title: "LinkedIn for AI Professionals",
          time: "45 min",
          summary: "How to position your AI skills and experience",
          content: `
### Marketing Your Skills
Position yourself as a practical AI solution builder. Highlight hands-on experience and tool knowledge.

#### LinkedIn Optimization Tips
*   **Headline:** Instead of "Student looking for work", write "AI Ops & Automation Builder | No-Code Chatbot Architect | Prompt Engineer".
*   **Featured Section:** Link directly to your live chatbot projects, case study documents, or portfolio pages.
*   **Experience Blurbs:** Write: "Built an automated email routing pipeline saving 5 hours of manual triage weekly using Make.com and Claude APIs."
          `,
          exercise: "Write a draft of a LinkedIn post introducing a chatbot project you built. Make it engaging, highlight the problem solved, and link to a demo."
        },
        {
          id: "l-16-5",
          title: "AI Communities",
          time: "30 min",
          summary: "Discord, Reddit, Hugging Face, events",
          content: `
### Joining the Global AI Space
AI moves too fast for books; you must learn from active online groups.

#### Key Online Channels
*   **Reddit:** r/LocalLLaMA (local models), r/ChatGPT (general prompts), r/artificial.
*   **Discord:** Tool builder servers (Botpress, Zapier, Pinecone) where developers share tips and troubleshooting code.
*   **Hugging Face:** The community hub for open-source AI models, datasets, and web app demos.
          `,
          exercise: "Find and join one public AI-focused Discord community or subreddit. Browse the active threads and note down a discussion topic."
        },
        {
          id: "l-16-6",
          title: "Career Paths Overview",
          time: "45 min",
          summary: "AI product manager, AI ops, prompt engineer, and more",
          content: `
### Non-Technical AI Careers
You do not need a computer science degree to get hired in the AI sector.

#### Key Career Tracks
1.  **AI Operations Specialist:** Analyzes corporate work steps, recommends AI tools, and sets up visual automations (Make, Zapier) to optimize team workflows.
2.  **AI Product Manager:** Manages the development of AI products, ensures prompts match customer expectations, and coordinates engineers and designers.
3.  **Prompt Engineer / Conversation Designer:** Focuses on writing system prompts, refining chatbot flows, and auditing outputs for accuracy and safety guidelines.
          `,
          exercise: "Browse a job board (like LinkedIn or Indeed) for roles containing 'AI Operations' or 'AI Product Manager'. Write down the required qualifications."
        }
      ]
    }
  ]
};
