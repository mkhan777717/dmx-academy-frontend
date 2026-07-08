import { phase1 } from "./phase1";
import { phase2 } from "./phase2";
import { phase3 } from "./phase3";
import { phase4 } from "./phase4";

export const allPhases = [phase1, phase2, phase3, phase4];

export const resourcesList = [
  {
    category: "Learn Concepts",
    items: [
      { name: "Google's 'Introduction to Generative AI'", desc: "Free basic course on Google Cloud Skills Boost.", link: "https://www.cloudskillsboost.google/course_templates/536" },
      { name: "Andrej Karpathy's 'Neural Networks: Zero to Hero'", desc: "Superb YouTube video playlist on building neural networks from scratch.", link: "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUbhy1y" },
      { name: "Claude.ai", desc: "Use Claude as your personal AI coding and concept tutor.", link: "https://claude.ai" },
      { name: "3Blue1Brown 'Neural Networks' Series", desc: "Stunning visual mathematical breakdowns on YouTube.", link: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi" }
    ]
  },
  {
    category: "Hands-On Tools",
    items: [
      { name: "ChatGPT", desc: "Run code analysis, test prompts, and generate images.", link: "https://chatgpt.com" },
      { name: "DALL-E 3 via Bing", desc: "Generate free high-quality AI images.", link: "https://www.bing.com/images/create" },
      { name: "Perplexity.ai", desc: "AI-powered semantic search for fact research.", link: "https://perplexity.ai" },
      { name: "Botpress", desc: "Drag-and-drop conversational chatbot designer.", link: "https://botpress.com" },
      { name: "Zapier", desc: "Automate app actions and trigger AI nodes.", link: "https://zapier.com" }
    ]
  },
  {
    category: "Stay Current",
    items: [
      { name: "The Rundown AI", desc: "Daily newsletter covering key news in plain English.", link: "https://www.therundown.ai" },
      { name: "Ben's Bites", desc: "Highly popular daily digest of tools and hacks.", link: "https://bensbites.beehiiv.com" },
      { name: "r/LocalLLaMA Reddit", desc: "Active community exploring open-source models.", link: "https://www.reddit.com/r/LocalLLaMA" }
    ]
  }
];

export const glossary = [
  { term: "AI (Artificial Intelligence)", def: "Making computers perform cognitive tasks normally requiring human intelligence, such as translation, vision, or decision making." },
  { term: "Machine Learning (ML)", def: "A subset of AI where systems automatically learn patterns and rules from historical data rather than following explicit coder instructions." },
  { term: "Deep Learning", def: "A subset of machine learning that utilizes multi-layered neural networks to analyze complex data patterns like pixels or text blocks." },
  { term: "LLM (Large Language Model)", def: "A massive neural network model trained on trillions of text words, optimized to understand, complete, and generate human languages." },
  { term: "Token", def: "The basic unit of text processed by an LLM. 1 token is roughly 4 characters, or 0.75 English words." },
  { term: "Context Window", def: "The maximum buffer size (in tokens) that an LLM can parse and remember during a single query session." },
  { term: "Prompt", def: "The starting input instructions, text questions, or file contexts fed to an AI to dictate its output." },
  { term: "Prompt Engineering", def: "The practice of structuring prompts (using context, role, constraints, formatting) to get high-quality outputs from AI models." },
  { term: "Fine-Tuning", def: "Training an existing pre-trained model further on a smaller, specialized dataset to adapt its style, format, or task proficiency." },
  { term: "RLHF (Reinforcement Learning from Human Feedback)", def: "A model refinement technique that uses human evaluation ratings to guide the model toward safe, polite, and helpful responses." },
  { term: "Embedding", def: "A long list of numbers (vector) representing the semantic meaning of a word, sentence, or document." },
  { term: "Vector Database", def: "A specialized data store optimized to save high-dimensional embedding vectors and perform rapid coordinate nearest-neighbor searches." },
  { term: "RAG (Retrieval-Augmented Generation)", def: "An architecture that retrieves relevant document chunks matching a user query, then feeds them to the LLM to write factual answers." },
  { term: "Hallucination", def: "A phenomenon where an LLM confidently outputs incorrect, fabricated, or false facts, believing they are correct." },
  { term: "Diffusion Model", def: "A class of image-generation neural networks that starts with TV static noise and refines it iteratively to form clear pictures." },
  { term: "AI Agent", def: "An autonomous system that uses an observe-think-act loop and tools (APIs, databases, web search) to complete multi-step tasks." },
  { term: "Parameters", def: "The internal numeric variables (weights and biases) of a neural network adjusted during training that determine how the model processes data." },
  { term: "Inference", def: "The phase where a trained model processes new inputs to output results (different from the training phase)." },
  { term: "Transformer", def: "The groundbreaking neural network architecture introduced by Google in 2017 using attention mechanisms that powers modern LLMs." },
  { term: "No-Code", def: "A programming paradigm that uses visual drag-and-drop interfaces to construct web pages and database logic without coding." }
];
