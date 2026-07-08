export const phase1 = {
  id: "phase-1",
  title: "Phase 1: Foundations of AI (Weeks 1–3)",
  description: "Build your mental model before touching any tools. This phase is the most important — do not skip it.",
  modules: [
    {
      id: "m-1",
      title: "Module 1: What is Artificial Intelligence?",
      duration: "3–4 days",
      difficulty: "Beginner",
      objectives: [
        "Explain the difference between AI, machine learning, and deep learning",
        "Give real-world examples of AI in everyday life",
        "Understand why AI is different from traditional software",
        "Describe the history of AI in simple terms"
      ],
      lessons: [
        {
          id: "l-1-1",
          title: "What is AI, really?",
          time: "45 min",
          summary: "Definitions, myths vs reality, everyday examples",
          content: `
### What is Artificial Intelligence?
Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think and learn like humans. The term may also be applied to any machine that exhibits traits associated with a human mind such as learning and problem-solving.

#### The Core Objective of AI
The ultimate goal of AI is to build systems that can perform complex cognitive tasks autonomously, mimicking human abilities like:
*   **Reasoning:** Making logical decisions and solving problems.
*   **Learning:** Improving performance over time based on feedback.
*   **Perception:** Interpreting sensory inputs (images, sound, text).
*   **Language Understanding:** Processing natural human dialogue.

#### Myths vs. Reality
1.  **Myth:** AI is a conscious, sentient being that wants to take over the world.
    *   **Reality:** AI is software. It runs on mathematical models, algorithms, and data. It has no feelings, desires, or self-awareness.
2.  **Myth:** AI can solve any problem instantly.
    *   **Reality:** AI is highly specialized. An AI designed to play chess cannot write an email, and an AI designed to recognize tumors cannot drive a car.
3.  **Myth:** AI works with 100% accuracy.
    *   **Reality:** AI is probabilistic. It makes educated guesses based on statistical patterns.

#### Everyday Examples of AI
You likely interact with AI multiple times a day without realizing it:
*   **Recommendation Systems:** YouTube, Netflix, or Spotify suggesting content. For instance, Spotify converts songs and user behavior into 100-dimensional mathematical vectors. It uses *Collaborative Filtering* algorithms to find other users with similar listening vectors and recommends tracks they liked that you haven't heard yet.
*   **Spam Filters:** Gmail automatically sorting emails into primary and spam folders based on natural language processing (NLP) models checking text semantics.
*   **Biometrics:** Apple FaceID recognizing your face to unlock your smartphone by projecting 30,000 invisible infrared dots to map depth geometry, matching it against a stored facial map vector.
*   **Smart Assistants:** Siri, Google Assistant, or Alexa parsing voice commands through Automatic Speech Recognition (ASR) and parsing intent.
          `,
          exercise: "List 5 apps on your smartphone. Research or deduce which features of those apps use AI (e.g., auto-complete in keyboard, photo enhancement in camera)."
        },
        {
          id: "l-1-2",
          title: "AI vs ML vs Deep Learning",
          time: "45 min",
          summary: "The hierarchy of terms explained simply",
          content: `
### The Hierarchy of AI Terms
Many people use the terms **Artificial Intelligence (AI)**, **Machine Learning (ML)**, and **Deep Learning (DL)** interchangeably, but they are nested subsets of each other.

#### 1. Artificial Intelligence (AI)
The broadest category. It includes any technique that enables computers to mimic human behavior. This includes "Expert Systems" (if-then logical rules written by humans) as well as data-driven learning models.

#### 2. Machine Learning (ML)
A subset of AI. Instead of writing code with explicit instructions and logical rules, we write algorithms that learn patterns from data. The computer uses these patterns to make predictions or decisions on new, unseen data.

#### 3. Deep Learning (DL)
A subset of ML. It uses multi-layered artificial neural networks (loosely modeled after the human brain) to solve highly complex tasks. Deep learning is responsible for the massive breakthroughs in image recognition, translation, and text generation.

#### The Transportation Analogy
Think of this hierarchy like transportation:
*   **AI** is the concept of a **Vehicle** (includes everything from bicycles, steam trains, to electric sports cars).
*   **Machine Learning** is a **Car** (a specific type of vehicle that runs on fuel and roads).
*   **Deep Learning** is an **Electric Car** (a modern, advanced subset of cars that uses a specialized battery propulsion system).
          `,
          exercise: "Draw a Venn diagram representing the relationship between AI, Machine Learning, and Deep Learning. Label each circle with a short description."
        },
        {
          id: "l-1-3",
          title: "History of AI",
          time: "30 min",
          summary: "Key milestones from 1950 to today",
          content: `
### Chronological History of AI
AI is not a new field. It has evolved over more than seven decades, alternating between periods of high optimism and "AI Winters" (funding cuts and loss of interest).

#### Key Historical Milestones
1.  **1950 (The Turing Test):** Alan Turing publishes "Computing Machinery and Intelligence," introducing the Turing Test to measure machine intelligence.
2.  **1956 (Dartmouth Conference):** John McCarthy coins the term "Artificial Intelligence" at the Dartmouth Summer Research Project, founding the academic field of AI.
3.  **1974–1980 (First AI Winter):** Initial excitement fades because computers lack the storage capacity and processing speed to solve real problems.
4.  **1997 (Deep Blue):** IBM's Deep Blue supercomputer beats world chess champion Garry Kasparov, proving machines can beat humans in specialized strategy games.
5.  **2012 (The Deep Learning Boom):** AlexNet wins the ImageNet competition by a massive margin using a Deep Convolutional Neural Network, launching the modern Deep Learning revolution.
6.  **2017 (The Transformer Paper):** Google researchers publish "Attention Is All You Need," introducing the Transformer neural network architecture that makes ChatGPT, Claude, and Gemini possible.
7.  **2022 (ChatGPT Launch):** OpenAI releases ChatGPT, bringing Generative AI into public mainstream awareness and triggering a global AI race.
          `,
          exercise: "Create a visual timeline with the 5 most important dates in AI history. Write one sentence explaining why each event was a turning point."
        },
        {
          id: "l-1-4",
          title: "Narrow AI vs General AI",
          time: "30 min",
          summary: "Why today's AI is still limited",
          content: `
### Artificial Narrow Intelligence (ANI) vs. Artificial General Intelligence (AGI)
AI systems are categorized based on their level of intelligence and adaptability.

#### 1. Artificial Narrow Intelligence (ANI)
*   **Definition:** Also known as **Weak AI**, this refers to AI systems designed and trained for a specific, single task.
*   **Capabilities:** They can outperform humans in their specific domain (e.g., playing chess, translating text, detecting spam), but they cannot perform tasks outside their training.
*   **Current State:** Every single AI system in existence today—from ChatGPT to self-driving cars—is Narrow AI.

#### 2. Artificial General Intelligence (AGI)
*   **Definition:** Also known as **Strong AI**, this refers to hypothetical machines that possess human-like cognitive capabilities.
*   **Capabilities:** An AGI system could learn, understand, reason, and apply knowledge across an infinite variety of tasks, adapting to new situations just like a human being.
*   **Current State:** AGI does not exist yet. It remains a theoretical goal of major AI laboratories.

#### Comparison Table
| Feature | Narrow AI (ANI) | General AI (AGI) |
| :--- | :--- | :--- |
| **Adaptability** | Can only perform pre-defined tasks | Can learn any intellectual task a human can |
| **Context** | Operates strictly within parameters | Understands broad context and common sense |
| **Examples** | Siri, ChatGPT, Midjourney, Tesla Autopilot | Sci-Fi characters (HAL 9000, Jarvis) |
| **Feasibility** | Fully commercialized and in use | Theoretical, subject of active research |
          `,
          exercise: "If you had access to a true AGI assistant today, name three complex, multi-domain tasks you would ask it to accomplish that current tools like ChatGPT cannot do."
        },
        {
          id: "l-1-5",
          title: "How AI Differs from Software",
          time: "30 min",
          summary: "Rules vs learning — the core distinction",
          content: `
### Traditional Software vs. Machine Learning
To understand how AI works, you must understand the paradigm shift from traditional computer science to machine learning.

#### Traditional Programming (Rule-Based)
In traditional software engineering, a human programmer writes explicit instructions (rules) and inputs data. The computer executes these instructions and produces an output.
*   **Formula:** Data + Rules = Answer
*   **Example:** A developer writes rules to block email addresses containing "free money" to filter spam. If the spammer changes the text to "fr33 m0ney", the developer must write a new rule.

#### Machine Learning (Data-Driven)
In machine learning, we feed the computer data and the corresponding answers (labels). The machine learning algorithm analyzes this data and generates the rules (the model) in the form of mathematical weights.
*   **Formula:** Data + Answers = Rules (Model weights)
*   **Example (Predicting House Prices):**
    Instead of hardcoding a rule like "every square foot costs $200", we feed the ML model 1,000 house sizes (Data) and their actual sell prices (Answers). The model learns a linear equation:
    @@@
    Price = (w * Size) + b
    @@@
    Here, \`w\` (weight) and \`b\` (bias) are the parameters. The training process automatically adjusts \`w\` and \`b\` until the error is minimized. If \`w\` is trained to be \`215\` and \`b\` is \`50000\`, the model can predict a new house's price: \`Price = (215 * Size) + 50000\`.

@@@
Traditional Programming:
            [Data] + [Rules] -- -> [Computer] -- -> [Output]

Machine Learning:
            [Data] + [Output] -- -> [Computer] -- -> [Rules (Model Weights)]
@@@
          `,
          exercise: "Write a set of step-by-step rules (like a computer program) for how to recognize a cat. Notice how hard it is to write rules for ears, tails, whiskers, and textures without using machine learning."
        }
      ]
    },
    {
      id: "m-2",
      title: "Module 2: How Machines Learn",
      duration: "3–4 days",
      difficulty: "Beginner",
      objectives: [
        "Explain what training a model means",
        "Describe supervised, unsupervised, and reinforcement learning",
        "Understand what a neural network is conceptually",
        "Know the difference between training and inference"
      ],
      lessons: [
        {
          id: "l-2-1",
          title: "What is training?",
          time: "45 min",
          summary: "How models learn from data with examples",
          content: `
### Training a Machine Learning Model
Training is the process by which an algorithm adjusts its internal parameters to learn patterns from training data.

#### The Concept of Parameters
A model starts as a blank mathematical equation containing millions or billions of variables called **parameters** (or weights).
1.  **Initialization:** The parameters start as random numbers. The model makes completely wrong guesses.
2.  **Prediction:** The model processes training data and outputs a guess.
3.  **Loss Evaluation:** A mathematical formula (the loss function) measures how far off the model's guess is from the correct answer.
4.  **Optimization:** The optimization algorithm (e.g., Gradient Descent) updates the parameters slightly to decrease the error.
5.  **Iteration:** This cycle repeats millions of times until the error gets as small as possible.

#### Analogy: Learning to Shoot a Basketball
*   **Random Weights:** Your first shot has random force and angle. It misses completely.
*   **Feedback:** You see the ball went too far to the left.
*   **Optimization:** You adjust your wrist angle and push with less force.
*   **Iteration:** You practice 1,000 shots. Your brain refines the motor commands (weights) until you make consistent swishes (trained model).
          `,
          exercise: "Write a short paragraph explaining why a model needs to repeat the training process thousands of times instead of learning from a single example."
        },
        {
          id: "l-2-2",
          title: "Supervised Learning",
          time: "45 min",
          summary: "Learning from labelled examples (spam / not spam)",
          content: `
### Supervised Learning
Supervised learning is the most common form of machine learning. The model is trained on **labeled data**, which means each training example contains both the input features and the correct output label.

#### How It Works
Think of supervised learning like learning with a teacher. The teacher provides questions along with the answer key.
*   **Input (X):** Features (e.g., size of house, number of bedrooms, location).
*   **Output (Y):** Target label (e.g., price of house).
*   **Task:** Learn the mathematical mapping function that connects X to Y.

#### Key Applications
1.  **Classification:** Predicting a category or class.
    *   *Examples:* Spam vs. Not Spam, Cat vs. Dog, Default vs. Repay Loan.
2.  **Regression:** Predicting a continuous numeric value.
    *   *Examples:* Stock prices, temperature, future house prices.
          `,
          exercise: "Identify a real-world problem that could be solved using supervised classification, and list what the input features and target labels would be."
        },
        {
          id: "l-2-3",
          title: "Unsupervised Learning",
          time: "30 min",
          summary: "Finding patterns without labels",
          content: `
### Unsupervised Learning
In unsupervised learning, the model is trained on **unlabeled data**. The algorithm is not given any correct answers or target labels. Instead, it must find structure and relationships in the data on its own.

#### How It Works
Think of this like sorting a large pile of mixed coins. Nobody tells you what the coins are, but you can group them together by matching their sizes, colors, and weights.

#### Key Applications
1.  **Clustering:** Grouping similar data points together.
    *   *Example:* Customer Segmentation (grouping customers by buying habits to target ads).
2.  **Anomaly Detection:** Identifying data points that differ significantly from the norm.
    *   *Example:* Credit Card Fraud Detection (spotting an unusual purchase pattern).
3.  **Dimensionality Reduction:** Simplifying complex datasets by removing redundant features.
          `,
          exercise: "Describe how a retail store could use clustering to design custom discount packages for different groups of shoppers without labeling them beforehand."
        },
        {
          id: "l-2-4",
          title: "Reinforcement Learning",
          time: "30 min",
          summary: "Learning from rewards — how game-playing AI works",
          content: `
### Reinforcement Learning (RL)
Reinforcement learning is a method of training models through trial and error. The model learns to make decisions by interacting with an environment to maximize a cumulative **reward**.

#### The Core Framework
*   **Agent:** The AI model you are training.
*   **Environment:** The world the agent interacts with (e.g., a chess board, a video game screen, a maze).
*   **Action:** The moves or choices the agent can make.
*   **Reward/Penalty:** Feedback from the environment telling the agent if its action was good (+1 point) or bad (-1 point).

@@@
          [Action]
            + -------------------> [Environment]
            |                          |
            [Agent] | [New State & Reward]
        ^ --------------------------+
@@@

#### Famous Examples
*   **AlphaGo:** DeepMind's RL system that beat the world Go champion by playing millions of games against itself to learn winning strategies.
*   **Self-Driving Cars:** Learning when to accelerate, steer, or brake based on safety score rewards.
          `,
          exercise: "Imagine training an AI agent to solve a maze using reinforcement learning. What actions can the agent take? What would you reward it for, and what would you penalize it for?"
        },
        {
          id: "l-2-5",
          title: "What is a neural network?",
          time: "45 min",
          summary: "Layers, nodes, weights — explained visually",
          content: `
### Artificial Neural Networks (ANNs)
Artificial Neural Networks are computing systems inspired by the biological neural networks that make up animal brains. They are the backbone of Deep Learning.

#### Core Structure
A neural network consists of interconnected nodes called **neurons** arranged in layers:
1.  **Input Layer:** Receives the raw data features (e.g., pixel brightness values for an image).
2.  **Hidden Layers:** Intermediate layers where the math happens. Each node takes inputs, multiplies them by weights (strengths), adds them up, and passes them through an activation function.
3.  **Output Layer:** Produces the final prediction (e.g., "98% Probability of Cat").

#### Key Terms
*   **Node (Neuron):** A mathematical cell that receives, processes, and transmits information.
*   **Weight:** The strength of the connection between neurons. Adjusting weights is how the network learns.
*   **Bias:** An offset added to the weighted sum to adjust output thresholds.
*   **Activation Function:** Introduces non-linearity, allowing the network to learn complex shapes and curves instead of just straight lines.
          `,
          exercise: "Look at a diagram of a feedforward neural network. Identify the input layer, hidden layers, and output layer. Draw a single node showing inputs, weights, and summation."
        }
      ]
    },
    {
      id: "m-3",
      title: "Module 3: What is Generative AI?",
      duration: "2–3 days",
      difficulty: "Beginner",
      objectives: [
        "Explain how Generative AI differs from traditional AI",
        "Name the main types of Gen AI (text, image, audio, video)",
        "Understand what a token is and why it matters",
        "Know key milestones in Gen AI history"
      ],
      lessons: [
        {
          id: "l-3-1",
          title: "Gen AI vs Traditional AI",
          time: "30 min",
          summary: "Creates vs classifies — the key difference",
          content: `
### Generative AI vs. Traditional AI
Generative AI represents a major shift in what computers are capable of doing.

#### Traditional AI (Analytical / Discriminative)
Traditional AI is designed to analyze data, find patterns, classify items, or make predictions. It answers questions like:
*   "Is this transaction fraudulent?"
*   "Will this user click this advertisement?"
*   "Does this image contain a stop sign?"
*   *Outcome:* A classification label, a recommendation, or a probability percentage.

#### Generative AI
Generative AI is designed to create **new, original content** that did not exist before. It learns the underlying distribution of training data and samples from it to generate text, images, music, or code. It answers prompts like:
*   "Write a poem about a computer mouse in the style of Shakespeare."
*   "Create an image of an astronaut riding a horse on Mars."
*   "Write a Python function to sort list elements."
*   *Outcome:* A unique file, block of text, or media asset.
          `,
          exercise: "Write down three tasks in your daily life. Classify each as a task for Traditional AI (analysis, categorization) or Generative AI (creation, brainstorming)."
        },
        {
          id: "l-3-2",
          title: "Types of Generative AI",
          time: "45 min",
          summary: "Text, image, audio, video, code",
          content: `
### The Multimodal Landscape of Generative AI
Generative AI is not limited to text. It spans across multiple modalities, often combining them to create "multimodal" applications.

#### Major Generative Modalities
1.  **Text Generation (LLMs):** Generates essays, email replies, translations, summaries, and dialog responses.
    *   *Core Tools:* ChatGPT, Claude, Gemini.
2.  **Image Generation (Diffusion Models):** Generates photorealistic images, vectors, illustrations, and art.
    *   *Core Tools:* Midjourney, DALL-E 3, Stable Diffusion.
3.  **Code Generation:** Autocompletes, writes, debugs, and documents programming code.
    *   *Core Tools:* GitHub Copilot, Cursor, CodeLlama.
4.  **Audio & Music Generation:** Generates voiceovers, background tracks, ambient sounds, or full songs.
    *   *Core Tools:* ElevenLabs, Suno AI, Udio.
5.  **Video Generation:** Generates short video clips, avatars, animations, or text-to-video scenes.
    *   *Core Tools:* Runway Gen-2, Sora, Pika Labs.
          `,
          exercise: "Imagine a marketing campaign for a new beverage. List how you would use text, image, and video generators together to construct a full set of ad creatives."
        },
        {
          id: "l-3-3",
          title: "How LLMs Work (Overview)",
          time: "45 min",
          summary: "Reading and writing in tokens",
          content: `
### Large Language Models (LLMs) Under the Hood
At its core, an LLM is a giant auto-complete engine. It takes input text and predicts the most likely next word.

#### The Concept of Tokens
LLMs do not read text character-by-character or word-by-word. Instead, they process text in chunks called **tokens**.
*   A token can be a single character, a syllable, a whole word, or part of a word.
*   **Rule of Thumb:** 1 token ≈ 4 characters, or 0.75 English words.
*   *Example:* The word "unbelievable" might be split by the tokenizer into three tokens: \`["un", "believ", "able"]\`.

#### The Context Window
The context window is the maximum number of tokens a model can process in a single turn. It includes your prompt, any uploaded files, and the conversation history.
*   If the conversation exceeds the context window, the model starts forgetting the oldest messages, just like short-term memory limit in humans.
*   Modern context windows range from 4,000 tokens (older models) to over 1,000,000 tokens (Gemini 1.5).
          `,
          exercise: "Look at the phrase: 'Generative AI is revolutionary.' Count the words. Calculate the estimated token count using the rule of thumb (0.75 words per token)."
        },
        {
          id: "l-3-4",
          title: "Key Milestones",
          time: "30 min",
          summary: "GPT-3, ChatGPT, Claude, Gemini, Llama timeline",
          content: `
### The Modern Generative AI Timeline
The rapid acceleration of generative AI began in 2020 and has led to a highly competitive landscape of open-source and proprietary models.

#### Key Milestones
*   **June 2020 (GPT-3):** OpenAI releases GPT-3 with 175 billion parameters. It shows remarkable ability to write coherent, human-like essays, launching the LLM boom.
*   **November 2022 (ChatGPT):** Built on GPT-3.5, ChatGPT is launched for public use. It reaches 100 million monthly active users in just two months, the fastest consumer app growth in history.
*   **March 2023 (GPT-4):** OpenAI releases GPT-4, demonstrating advanced reasoning, exam-taking capabilities, and multimodal inputs (images).
*   **July 2023 (Llama 2):** Meta releases Llama 2, a powerful family of open-source LLMs free for commercial use, sparking an open-source development explosion.
*   **February 2024 (Gemini 1.5):** Google launches Gemini 1.5 with a breakthrough 2-million-token context window.
*   **Present:** Competition centers on speed, cost reduction, agents, and reasoning models (like OpenAI's o1 series).
          `,
          exercise: "Research and check which LLM providers currently offer the largest context window, and write down one use case that requires a huge context window."
        }
      ]
    },
    {
      id: "m-4",
      title: "Module 4: Data Basics",
      duration: "2–3 days",
      difficulty: "Beginner",
      objectives: [
        "Understand what training data is and why quality matters",
        "Distinguish between structured and unstructured data",
        "Know what data preprocessing involves"
      ],
      lessons: [
        {
          id: "l-4-1",
          title: "What is training data?",
          time: "30 min",
          summary: "Why AI needs massive amounts of examples",
          content: `
### Training Data Explained
Training data is the primary textbook that an AI system reads to learn. Without training data, an AI algorithm is just an empty mathematical formula.

#### The Scale of Data
Modern LLMs are trained on massive datasets containing trillions of words. This training data allows the model to learn grammar, facts about the world, reasoning strategies, coding structures, and cultural references.

#### The Cost of Data
Acquiring, storing, and processing training data is one of the most expensive parts of building modern AI. Massive supercomputers must run for months, consuming megawatts of electricity, just to read through the dataset once.
          `,
          exercise: "Why can't you build an advanced LLM using only the text of a single textbook? Explain in terms of vocabulary and general world knowledge."
        },
        {
          id: "l-4-2",
          title: "Structured vs Unstructured Data",
          time: "30 min",
          summary: "Tables vs text vs images",
          content: `
### Structured vs. Unstructured Data
Data comes in various formats. AI models process these formats differently.

#### Structured Data
*   **Definition:** Highly organized data that fits neatly into rows and columns (tables, databases, Excel spreadsheets).
*   **Characteristics:** Easily searchable, pre-defined schemas.
*   **Usage:** Used in traditional ML for predictions (e.g., forecasting sales based on transactions).

#### Unstructured Data
*   **Definition:** Information that does not have a pre-defined organizational framework.
*   **Characteristics:** Text files, PDFs, emails, audio recordings, images, video feeds.
*   **Usage:** Makes up about 80% of real-world data. Generative AI is uniquely capable of understanding and creating unstructured data.

#### Key Differences
*   **Structured:** Clean, mathematical, tabular.
*   **Unstructured:** Complex, high-dimensional, rich in semantic meaning.
          `,
          exercise: "Classify the following datasets as structured or unstructured: 1. A list of customer phone numbers. 2. A collection of podcast MP3 audio files. 3. A table showing weather temperatures. 4. A folder of client contract PDFs."
        },
        {
          id: "l-4-3",
          title: "Data Quality Matters",
          time: "45 min",
          summary: "Garbage in, garbage out — bias and noise",
          content: `
### Data Quality in AI
In computer science, there is a famous rule: **Garbage In, Garbage Out (GIGO)**. If you train your model on poor-quality data, it will produce poor-quality outputs.

#### Key Issues in Data Quality
1.  **Noise:** Random, incorrect, or irrelevant data points (e.g., typos, corrupted images, scrambled text files).
2.  **Bias (Historical Data Skew):** If training data reflects historical human prejudices, the model will learn and amplify those biases.
    *   *Real-World Example:* Amazon developed an experimental AI recruiting tool in 2018. Because it was trained on historical resumes submitted over a 10-year period—where the majority of engineering hires were male—the model actively penalised resumes containing the word "women's" (e.g. "women's chess club captain") and downgraded graduates from all-women colleges.
3.  **Duplication:** Replicated text or images can lead the model to over-memorize specific inputs, degrading its generalized performance.
4.  **Hallucinations/Falsities:** Inaccurate facts in training data make the model repeat incorrect information as truths.
          `,
          exercise: "Explain how a medical diagnosis AI might fail if it is trained exclusively on data from patients in a single country, ignoring diverse genetic backgrounds."
        },
        {
          id: "l-4-4",
          title: "Where AI Gets Its Data",
          time: "30 min",
          summary: "Web scraping, books, code, synthetic data",
          content: `
### Sources of AI Training Data
AI companies build massive datasets from diverse sources to train state-of-the-art models.

#### Main Data Sources
*   **Web Scraping (Common Crawl):** Automated bots scanning public pages across the internet, extracting articles, blog posts, forums, and transcripts.
*   **Books and Academic Literature:** Digital libraries containing millions of books, research papers, and technical documentations.
*   **Open-Source Repositories (GitHub):** Massive codebases in Python, Javascript, C++, SQL, etc., teaching the model how to program.
*   **Human Feedback (RLHF):** Humans grading outputs to teach safety and alignment.
*   **Synthetic Data:** Data generated *by another AI model*. For instance, using a large model to create thousands of math problems to train a smaller model.
          `,
          exercise: "Name one advantage and one disadvantage of using 'Synthetic Data' (AI-generated data) to train new AI models."
        },
        {
          id: "l-4-5",
          title: "Data Preprocessing",
          time: "30 min",
          summary: "Cleaning and filtering data before training",
          content: `
### Data Preprocessing
Data preprocessing is the phase where raw scraped data is cleaned, filtered, and converted into a structured format suitable for neural network training.

#### Key Preprocessing Steps
1.  **Deduplication:** Removing duplicate articles, sentences, or code segments.
2.  **PII Removal:** Scanning for Personally Identifiable Information (emails, phone numbers, addresses, social security numbers) and redacting them.
3.  **Hate & Offensive Content Filtering:** Removing toxic text, violence, and extreme content from the training set.
4.  **Language Identification:** Sorting data by language to balance training mixtures.
5.  **Tokenization:** Breaking down the cleaned text files into token indices that the neural network can ingest.
          `,
          exercise: "Why is PII removal (Personally Identifiable Information) a critical step in data preprocessing? What would happen if a customer support bot memorized a training email with someone's credit card number?"
        }
      ]
    }
  ]
};
