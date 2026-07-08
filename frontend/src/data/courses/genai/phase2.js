export const phase2 = {
  id: "phase-2",
  title: "Phase 2: Core Gen AI Concepts (Weeks 4–6)",
  description: "Now that you have the foundations, this phase covers the core ideas behind modern Gen AI.",
  modules: [
    {
      id: "m-5",
      title: "Module 5: Large Language Models (LLMs)",
      duration: "4–5 days",
      difficulty: "Beginner–Intermediate",
      objectives: [
        "Understand what makes a model 'large'",
        "Describe the Transformer architecture conceptually",
        "Explain attention mechanisms in plain language",
        "Distinguish between pre-training, fine-tuning, and RLHF",
        "Compare major LLMs: GPT-4, Claude, Gemini, Llama"
      ],
      lessons: [
        {
          id: "l-5-1",
          title: "What makes a model 'large'?",
          time: "45 min",
          summary: "Parameters, scale, and why size matters",
          content: `
### What is a "Large" Language Model?
The word **"Large"** in LLM refers to two characteristics: the scale of the neural network parameters and the volume of training text.

#### The Scale of Parameters
Parameters are the internal connections (weights) that the model adjusts during training.
*   **Small Models:** A basic spam filter might have 1,000 parameters.
*   **Large Models:** GPT-3 has **175 billion** parameters. Modern models (like GPT-4 or Claude 3) are rumored to contain over **1 trillion** parameters.
*   **Why Size Matters:** As models scale, they undergo "emergent abilities." At small sizes, models cannot solve word puzzles or write code. Once they exceed a certain parameter threshold, they suddenly "learn" these capabilities without explicit training.
          `,
          exercise: "Look up the parameter size of the following open models: Llama-3-8B, Llama-3-70B, and Mistral-7B. What does the 'B' stand for?"
        },
        {
          id: "l-5-2",
          title: "The Transformer Architecture",
          time: "60 min",
          summary: "The engine behind modern AI — no math needed",
          content: `
### The Transformer Architecture
Before 2017, language models read text word-by-word in sequence (using Recurrent Neural Networks, RNNs). If a sentence was 100 words long, the model forgot the first word by the time it reached the last.

#### The Breakthrough of 2017
In 2017, Google researchers introduced the **Transformer** architecture. Instead of sequential processing, the Transformer processes **all words in a sentence simultaneously**.

#### Key Advantages
*   **Parallelization:** Because it processes words together, training can be distributed across thousands of GPUs, making it possible to train on the entire public internet.
*   **Long-Range Context:** The model can instantly connect a word at the beginning of a page with a word at the bottom of the page, maintaining thematic consistency.
          `,
          exercise: "Explain in your own words why reading an entire sentence at once (parallel) is faster than reading it word-by-word (sequential)."
        },
        {
          id: "l-5-3",
          title: "Attention Mechanisms",
          time: "45 min",
          summary: "How AI decides which words are most important",
          content: `
### The Attention Mechanism
The core engine of the Transformer is the **"Self-Attention"** mechanism. It allows the model to calculate how much "attention" it should pay to other words in the sentence to understand the current word.

#### The Classic Example
Look at these two sentences:
1.  "The animal didn't cross the street because **it** was too tired."
2.  "The animal didn't cross the street because **it** was too wide."

How does the computer know what the word **"it"** refers to?
*   In sentence 1, the attention mechanism calculates that **"it"** has a strong relationship with **"animal"** (because "tired" applies to animals).
*   In sentence 2, the attention mechanism calculates that **"it"** has a strong relationship with **"street"** (because "wide" applies to streets).

#### Step-by-Step Attention: The QKV Retreival System
Self-attention calculates this relationship using three vectors for each word: **Query (Q)**, **Key (K)**, and **Value (V)**. Think of it like looking up folders in a file cabinet:
*   **Query (Q):** "What I am looking for." (The current word's inquiry)
*   **Key (K):** "What label I have." (Every word's index tags)
*   **Value (V):** "What I actually am." (The actual semantic content of each word)

Let's calculate self-attention step-by-step for the sentence: **"The cat sat on the mat."**
1.  **Linear Projection:** Each word's raw embedding vector is multiplied by trained weight matrices (W_Q, W_K, W_V) to generate unique Q, K, and V vectors.
2.  **Calculate Attention Scores:** When processing the word **"sat"**, the model multiplies the Query (Q) vector of "sat" by the Key (K) vectors of *all* other words in the sentence (using dot product multiplication):
    *   \`Score(sat, cat) = Q(sat) • K(cat) = 42\` (High relevance!)
    *   \`Score(sat, mat) = Q(sat) • K(mat) = 12\` (Low relevance!)
3.  **Scaling:** The dot products are divided by a scaling factor (square root of d_k, where d_k is the key dimensions) to prevent numbers from exploding during training.
4.  **Softmax Normalization:** The scaled scores are fed into a *Softmax* mathematical function. This converts them into probability percentages that add up to 1.0 (representing where to focus):
    *   \`Weight(sat, cat) = 82%\`
    *   \`Weight(sat, mat) = 10%\`
    *   \`Weight(sat, sat) = 8%\`
5.  **Weighted Summation:** The model multiplies each word's Value (V) vector by its normalized percentage weight and adds them up:
    @@@
    Context Vector = (0.82 * V(cat)) + (0.10 * V(mat)) + (0.08 * V(sat))
    @@@
    This outputs a new "context-aware" representation for the word "sat" that carries the information of the "cat" performing the action!
          `,
          exercise: "In the sentence: 'The bank of the river was muddy, so I walked to the bank to deposit my check.' How does self-attention help determine the meaning of the two instances of 'bank'?"
        },
        {
          id: "l-5-4",
          title: "Pre-training",
          time: "30 min",
          summary: "Learning from the entire internet",
          content: `
### Pre-training: The First Phase of LLM Creation
Pre-training is where the model acquires its raw knowledge and language comprehension.

#### The Task: Next-Token Prediction
During pre-training, the model is fed trillions of words of raw text. Its sole task is to read a block of text and guess the next word.
*   *Input:* "The capital of France is [?]"
*   *Correct Output:* "Paris"
*   *Input:* "def add(a, b): return [?]"
*   *Correct Output:* "a + b"

#### The Outcome
After predicting next words billions of times across the web, the model gains a rich understanding of syntax, grammar, facts, reasoning, and programming. However, it is not a helpful assistant yet—it just completes text. If you ask it: "Can you help me write an email?", it might complete it with: "...and also help me buy groceries."
          `,
          exercise: "Why is a pre-trained model alone not ideal for a customer support chatbot? What would happen if a user asked it a question?"
        },
        {
          id: "l-5-5",
          title: "Fine-tuning and RLHF",
          time: "45 min",
          summary: "Making a general model into a helpful assistant",
          content: `
### Turning raw models into helpful assistants
To make a pre-trained model useful for dialogue, AI developers use two additional training steps:

#### 1. Instruction Fine-Tuning
The model is trained on a smaller, curated dataset of Q&A pairs written by humans. E.g.:
*   *Input:* "Explain photosynthsis in one sentence."
*   *Output:* "Photosynthesis is the process by which green plants use sunlight to synthesize nutrients from carbon dioxide and water."
This teaches the model the "conversation format."

#### 2. Reinforcement Learning from Human Feedback (RLHF)
Human trainers review the model's outputs and score them based on usefulness, truthfulness, and safety.
*   If a model outputs helpful, safe answers, it gets a positive reward.
*   If it outputs toxic, biased, or harmful answers, it gets a negative penalty.
This is what makes models polite, helpful, and safe.
          `,
          exercise: "Why is human feedback (RLHF) critical for safety? Name one topic where we would want the model to refuse to answer (e.g., building a bomb)."
        },
        {
          id: "l-5-6",
          title: "Comparing Major LLMs",
          time: "45 min",
          summary: "ChatGPT, Claude, Gemini, Llama strengths and limits",
          content: `
### The Major LLM Players
Today's market is dominated by a few leading companies offering proprietary models, alongside a vibrant community of open-weights models.

#### 1. OpenAI (GPT-4 / o1)
*   **Strengths:** Industry leader in raw reasoning, coding, and mathematical logic.
*   **Best For:** Complex analytical tasks, coding architectures, structured JSON generation.

#### 2. Anthropic (Claude 3.5 Sonnet / Opus)
*   **Strengths:** Exceptional at natural, empathetic writing, long-form document analysis, and detailed coding.
*   **Best For:** Writing essays, parsing PDFs, code refactoring.

#### 3. Google (Gemini 1.5 Pro / Flash)
*   **Strengths:** Massive context window (up to 2 million tokens), excellent search integration, multimodal video analysis.
*   **Best For:** Uploading entire books or videos, searching web facts.

#### 4. Meta (Llama 3 / 3.1)
*   **Strengths:** Fully open-source weights. Free to download, run locally, and custom-fine-tune on private servers.
*   **Best For:** Companies needing local privacy or custom AI models.

#### Benchmark Performance Comparison Grid
Below is a comparison of performance on standard academic evaluations (MMLU for general knowledge, GPQA for graduate-level reasoning, and HumanEval for python coding tasks):

| Model name | Primary Developer | Access Type | MMLU (Knowledge) | GPQA (Reasoning) | HumanEval (Coding) | Context Window |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Claude 3.5 Sonnet** | Anthropic | Proprietary | 88.7% | 59.4% (Diamond) | 92.0% | 200,000 Tokens |
| **GPT-4o** | OpenAI | Proprietary | 88.7% | 53.6% (Diamond) | 90.2% | 128,000 Tokens |
| **Gemini 1.5 Pro** | Google | Proprietary | 85.9% | 46.2% (Diamond) | 84.1% | 2,000,000 Tokens |
| **Llama 3.1 (405B)** | Meta | Open weights | 88.6% | 51.1% (Diamond) | 89.0% | 128,000 Tokens |
          `,
          exercise: "Create a summary matrix listing the main developer, license type (Open or Closed), and key strength of OpenAI GPT, Anthropic Claude, Google Gemini, and Meta Llama."
        }
      ]
    },
    {
      id: "m-6",
      title: "Module 6: Prompt Engineering",
      duration: "5–6 days",
      difficulty: "Beginner",
      objectives: [
        "Understand why prompt construction matters",
        "Apply zero-shot, few-shot, and chain-of-thought prompting",
        "Write system prompts",
        "Structure prompts using the 4-part framework"
      ],
      lessons: [
        {
          id: "l-6-1",
          title: "What is a prompt?",
          time: "30 min",
          summary: "Why the same question gets very different answers",
          content: `
### What is a Prompt?
A prompt is the instruction or input text you give to an AI model to guide its output.

#### Why Formulation Matters
Because LLMs are probabilistic autocomplete engines, they react heavily to context. Even a slight change in how you phrase your prompt shifts the model's statistical pathways, leading to completely different outputs.
*   **Weak Prompt:** "Write about coding."
    *   *Result:* A generic, boring paragraph summarizing what software is.
*   **Structured Prompt:** "Write a 3-bullet-point summary explaining the benefits of clean code for absolute beginners. Use an encouraging tone."
    *   *Result:* A highly focused, readable, and target-audience-aligned response.
          `,
          exercise: "Take a simple request (e.g., 'tell me about Rome') and rewrite it into a highly descriptive prompt using target details, length, and format goals."
        },
        {
          id: "l-6-2",
          title: "Zero-Shot Prompting",
          time: "30 min",
          summary: "Asking directly without examples",
          content: `
### Zero-Shot Prompting
Zero-shot prompting means asking the model to perform a task without giving it any examples of how you want it done.

#### When to Use
Use zero-shot prompting when:
*   The task is simple and standard (e.g., translation, summarization, general Q&A).
*   You are brainstorming or seeking creative ideas.
*   The model already possesses massive background knowledge on the subject.

#### Example
*   **Prompt:** "Translate the following text into French: 'AI is changing the future of work.'"
*   **Response:** "'L'IA change l'avenir du travail.'"
          `,
          exercise: "Write a zero-shot prompt requesting a summary of the difference between solar and wind energy."
        },
        {
          id: "l-6-3",
          title: "Few-Shot Prompting",
          time: "45 min",
          summary: "Giving examples to guide the model",
          content: `
### Few-Shot Prompting
Few-shot prompting is the technique of showing the model one or more examples of inputs and their desired outputs before asking it to solve the actual task.

#### Why it Works
Showing examples defines the structure, tone, format, and boundaries of the response, preventing formatting errors.

#### Example Prompt
\`\`\`
Tweet: "I hate waiting in line at the airport." -> Sentiment: Negative
Tweet: "The weather today is wonderful!" -> Sentiment: Positive
Tweet: "The package should arrive on Wednesday." -> Sentiment: Neutral
Tweet: "My new laptop just broke on day one." -> Sentiment: [?]
\`\`\`
By feeding this context, the model knows exactly to output a single word like **"Negative"** rather than writing a long paragraph explaining the laptop's warranty.
          `,
          exercise: "Create a few-shot prompt (with 3 examples) that takes a full name (e.g., 'John Smith') and outputs a username in the format: 'firstletter_lastname_member' (e.g., 'j_smith_member')."
        },
        {
          id: "l-6-4",
          title: "Chain-of-Thought (CoT) Prompting",
          time: "45 min",
          summary: "Asking AI to reason step by step",
          content: `
### Chain-of-Thought Prompting
If you ask an LLM a complex math or logic puzzle, it might jump to a quick, incorrect answer. This happens because it tries to generate the final answer immediately without "thinking space."

#### The Solution: Let's Think Step-by-Step
Chain-of-thought prompting forces the model to write out its intermediate reasoning steps before declaring the final answer.

#### Example
*   **Without CoT:** "A farmer has 15 apples. He sells 5, buys 10, and eats 2. How many does he have? Give me just the number." (Higher chance of errors on complex problems).
*   **With CoT:** "A farmer has 15 apples. He sells 5, buys 10, and eats 2. Let's solve this step by step:
    1. First, compute initial count...
    2. Subtract sold...
    3. Add bought...
    4. Subtract eaten..."
Giving the model "space" to generate logical text steps increases reasoning accuracy dramatically.
          `,
          exercise: "Write a chain-of-thought prompt to solve a logic puzzle (e.g., 'If John is taller than Mark, and Mark is taller than Dave, is Dave taller than John? Walk me through your thinking step-by-step.')"
        },
        {
          id: "l-6-5",
          title: "Role Prompting",
          time: "30 min",
          summary: "“Act as a…” technique",
          content: `
### Role Prompting (Persona Setup)
Role prompting involves instructing the AI to adopt a specific persona, profession, or expert character before answering.

#### Why it works
Setting a role narrows down the statistical space of words the model uses. An "expert security analyst" will use precise, technical terms, while a "kindergarten teacher" will use simple, analogical terms.

#### Example Comparisons
*   **Role 1:** "You are a senior JavaScript developer. Explain callbacks."
*   **Role 2:** "You are a professional chef. Explain callbacks using cooking metaphors."
          `,
          exercise: "Write a prompt asking the AI to explain 'inflation' under two different roles: a Wall Street banker and a 10-year-old child."
        },
        {
          id: "l-6-6",
          title: "System vs User Prompts",
          time: "30 min",
          summary: "Setting persistent instructions for a session",
          content: `
### System Prompts vs. User Prompts
When building chatbots or using advanced APIs, you will encounter two separate channels of communication:

#### 1. System Prompt (System Instructions)
*   **Definition:** High-level instructions that define the model's identity, tone, guidelines, and restrictions.
*   **Behavior:** The user does not see this prompt, but it acts as a persistent set of rules for the entire chat session.
*   *Example:* "You are a helpful customer assistant for BankCo. You must never offer investment advice. If asked, politely decline."

#### 2. User Prompt (User Messages)
*   **Definition:** The individual questions, files, or messages sent by the human user during the chat.
*   *Example:* "Can you reset my password?"
          `,
          exercise: "Draft a system prompt for a math tutor bot that refuses to give the direct answer and instead forces the user to find it by asking leading questions."
        },
        {
          id: "l-6-7",
          title: "Common Prompting Mistakes",
          time: "45 min",
          summary: "Vagueness, missing context, no format guidance",
          content: `
### How NOT to Prompt
Writing bad prompts leads to generic, inaccurate, or off-topic responses. Avoid these common mistakes:

#### 1. Extreme Vagueness
*   *Bad:* "Make a newsletter."
*   *Good:* "Write a weekly newsletter header and 3 short product blurbs for an audience of freelance copywriters. Style it in a witty, lighthearted tone."

#### 2. Lack of Output Format Guidance
If you need JSON, a bulleted list, or a table, state it! Otherwise, the model will output a block of paragraphs.

#### 3. Over-Constraining
Writing 50 rules that contradict each other will make the model hallucinate or ignore guidelines. Keep instructions clear and sequenced.
          `,
          exercise: "Take this weak prompt: 'tell me how to study' and point out three missing pieces of context, then rewrite it."
        },
        {
          id: "l-6-8",
          title: "Prompt Rewriting Workshop",
          time: "60 min",
          summary: "Transform weak prompts into strong ones",
          content: `
### The 4-Part Prompt Framework
Use this framework to write perfect prompts every time:
1.  **Context:** The background situation.
2.  **Task:** The direct action.
3.  **Format:** The style of the output (table, list, code block).
4.  **Constraints:** Tone, word count, topics to avoid.

#### The Prompt Makeover
*   **Before (Weak):** "Help me prepare for an interview."
*   **After (Strong):** "I am interviewing for a Junior Frontend Developer role at a startup tomorrow. Please act as the interviewer. Ask me 5 common React 19 questions, one at a time. Wait for my response before asking the next question. Keep your tone professional and encouraging."
          `,
          exercise: "Apply the 4-Part Prompt Framework to draft a prompt asking for a healthy meal plan for a busy student. Label each of the four components in your prompt."
        }
      ]
    },
    {
      id: "m-7",
      title: "Module 7: AI Image Generation",
      duration: "3–4 days",
      difficulty: "Beginner",
      objectives: [
        "Explain how diffusion models generate images",
        "Use Midjourney, DALL-E, or Stable Diffusion",
        "Write effective image prompts including negative prompts",
        "Understand ethical concerns around AI-generated images"
      ],
      lessons: [
        {
          id: "l-7-1",
          title: "How Diffusion Models Work",
          time: "45 min",
          summary: "Starting from noise, refining to an image",
          content: `
### How Diffusion Models Work
While LLMs predict text, image generators use a class of neural networks called **Diffusion Models**.

#### The Training Process (Adding Noise)
1.  Take a clean image (e.g., a photo of a dog) and gradually add digital noise (static) until it is completely unrecognizable.
2.  Train the neural network to reverse this process: look at a slightly noisy image and predict how to subtract the noise to make it clean again.

#### The Generation Process (Subtracting Noise)
1.  The model starts with a canvas of **pure random visual noise** (like TV static).
2.  Guided by your prompt embedding, the model subtracts noise in 30-50 steps, slowly shaping the static into a coherent image of the dog.
          `,
          exercise: "Why do diffusion models start with random noise? If they started with a blank white canvas, would the images be as diverse? Explain."
        },
        {
          id: "l-7-2",
          title: "Key Tools Overview",
          time: "45 min",
          summary: "Midjourney, DALL-E 3, Stable Diffusion, Firefly",
          content: `
### Comparing Image Generators
The three primary image generators differ in accessibility, quality, and customizability.

#### 1. Midjourney
*   **Aesthetics:** The industry leader in photorealism, artistic styles, and cinematic lighting.
*   **Access:** Accessed via Discord.
*   **Best For:** Premium marketing materials, concepts, and concept art.

#### 2. DALL-E 3 (OpenAI)
*   **Prompt Alignment:** Exceptional at understanding complex prompts and text inside images.
*   **Access:** Integrated directly inside ChatGPT Plus.
*   **Best For:** Simple mockups, exact layouts, and comic styling.

#### 3. Stable Diffusion (Stability AI)
*   **Control:** Fully open-source. Can be run locally, offering total control over layout, pose matching (ControlNet), and fine-tuning.
*   **Best For:** Advanced developers requiring deep layout customizability.
          `,
          exercise: "Create a simple table comparing Midjourney, DALL-E 3, and Stable Diffusion across three metrics: user accessibility, ability to render text, and open-source status."
        },
        {
          id: "l-7-3",
          title: "Writing Image Prompts",
          time: "60 min",
          summary: "Style, subject, composition, lighting keywords",
          content: `
### Anatomy of an Image Prompt
An effective image prompt needs more than just a subject. It requires details about camera angles, styles, and lighting.

#### The 4-Component Image Prompt
1.  **Subject:** What is the main focus? (e.g., "A red fox")
2.  **Environment/Background:** Where is it? (e.g., "in a snowy pine forest at twilight")
3.  **Style/Medium:** Is it a photo, painting, 3D render, watercolor? (e.g., "Macro photography, realistic, detailed fur")
4.  **Lighting & Color:** (e.g., "Golden hour lighting, soft warm glow, 35mm lens")

#### Poor vs. Good Prompt
*   *Poor:* "Car on street."
*   *Good:* "A sleek vintage 1960s sports car parked on a wet cobblestone street in London at night. Neon signs reflecting in puddles. Cinematic lighting, photorealistic, 8k resolution."
          `,
          exercise: "Draft a high-quality image prompt for a website header image showing a modern workspace. Include subject, environment, camera angle, and lighting keywords."
        },
        {
          id: "l-7-4",
          title: "Negative Prompts",
          time: "30 min",
          summary: "Telling AI what to exclude from the image",
          content: `
### Negative Prompting
A negative prompt tells the image generator what elements you do **NOT** want to appear in the final image.

#### Why it is useful
Sometimes, models tend to add default elements (like trees, text, extra limbs, or specific color palettes) based on statistical association.
*   **Stable Diffusion & Midjourney** support explicit negative parameters (e.g., \`--no trees\`).
*   **Common Negative Keywords:** "ugly, deformed, low resolution, blurry, extra fingers, text, watermark, signature."
          `,
          exercise: "If you want an image of a clean, minimalist room with absolutely no furniture except a single chair, draft the prompt and the negative prompt."
        },
        {
          id: "l-7-5",
          title: "Ethics of AI Images",
          time: "45 min",
          summary: "Deepfakes, consent, copyright, misinformation",
          content: `
### Ethical Concerns in AI Art and Imaging
The rapid rise of photorealistic image generation has triggered massive social and legal discussions.

#### Key Ethical Debates
1.  **Copyright & Artist Consent:** Image generators are trained on billions of copyrighted artworks scraped from the web without the original artists' consent or compensation.
2.  **Deepfakes & Fraud:** The ability to generate realistic photos of politicians, celebrities, or ordinary people in fake situations, leading to blackmail and fake news.
3.  **Bias Amplification:** If image models are trained on biased image databases, they default to stereotypes (e.g., plotting 'a doctor' as a male and 'a housekeeper' as a female).
          `,
          exercise: "Write a short opinion paragraph explaining whether you think AI developers should be legally required to license all images used for training."
        }
      ]
    },
    {
      id: "m-8",
      title: "Module 8: Embeddings and Vector Search",
      duration: "3–4 days",
      difficulty: "Beginner–Intermediate",
      objectives: [
        "Explain what an embedding is using simple analogies",
        "Understand why similar words cluster in vector space",
        "Know the purpose of vector databases",
        "Understand how semantic search differs from keyword search"
      ],
      lessons: [
        {
          id: "l-8-1",
          title: "What is an embedding?",
          time: "45 min",
          summary: "Turning words and sentences into numbers",
          content: `
### What is an Embedding?
Computers cannot read text or look at images; they only understand numbers. An **embedding** is a technique that converts words, sentences, or images into a long list of numbers (called a **vector**).

#### Semantic Mapping
What makes embeddings magical is that these lists of numbers represent the **semantic meaning** of the text.
*   The word **"king"** and **"queen"** will have vectors that look very similar.
*   The word **"king"** and **"banana"** will have vectors that look completely different.
By representing meaning as numbers, computers can run mathematical formulas to determine if two sentences are discussing similar concepts.
          `,
          exercise: "Why can't we just assign a single number to each word (e.g., Cat=1, Dog=2, Car=100)? Explain why list-based vectors are needed to capture complex meanings."
        },
        {
          id: "l-8-2",
          title: "Vector Space Explained",
          time: "45 min",
          summary: "Why “king - man + woman = queen”",
          content: `
### Vector Space & Semantic Math
Imagine plotting words in a massive 3D coordinate space. This is **Vector Space**.

#### The Famous Equation
Because embeddings map words based on relationships, you can perform vector math on concepts:
*   \`King\` - \`Man\` + \`Woman\` = \`Queen\`
*   \`Paris\` - \`France\` + \`Germany\` = \`Berlin\`

#### Distance Metrics
To measure similarity in vector space, we calculate the geometric distance (like Cosine Similarity) between coordinate points. If the angle between two sentence vectors is small, the sentences have similar meanings, even if they share zero identical words!
          `,
          exercise: "Look at the sentences: 1. 'I love puppies.' 2. 'Canines are my favorite animals.' 3. 'The weather is rainy.' Explain why vectors for 1 and 2 will cluster closer in vector space than 3."
        },
        {
          id: "l-8-3",
          title: "Vector Databases",
          time: "30 min",
          summary: "Pinecone, Weaviate, Chroma — what they store",
          content: `
### What is a Vector Database?
Traditional databases (like SQL or MongoDB) index data by keywords, dates, or numbers. If you search for "automobile", it will not find entries containing only "car".

#### Vector Databases
A Vector Database is optimized specifically to store millions of embedding vectors and search through them at lightning speeds.
*   **How Search Works:** You enter a search query, the database converts the query into a vector, and then retrieves the "nearest neighbors" in vector coordinates.
*   **Leading Tools:** Pinecone, Weaviate, Milvus, Chroma, and pgvector.
          `,
          exercise: "Research and list three popular vector databases. Which one is best for lightweight, local testing (hint: Chroma)?"
        },
        {
          id: "l-8-4",
          title: "Semantic Search",
          time: "45 min",
          summary: "Finding meaning, not just matching keywords",
          content: `
### Semantic Search vs. Keyword Search
Semantic search is what powers modern search tools like Google and AI document readers.

#### Keyword Search (Traditional)
*   Scans for exact letter matches.
*   *Query:* "remedy for headache"
*   *Result:* Only finds articles containing the exact phrase "remedy for headache". Misses articles saying "aspirin treats migraines".

#### Semantic Search (AI-Powered)
*   Scans for conceptual matches using embeddings.
*   *Query:* "remedy for headache"
*   *Result:* Correctly identifies and retrieves articles mentioning "curing pain in the skull" or "medical treatments for neural tension".
          `,
          exercise: "Write a short scenario showing how a customer support portal improves its self-help search using semantic embeddings instead of simple database queries."
        }
      ]
    }
  ]
};
