/**
 * llmGenerator.js — LLM-powered viva question generation.
 *
 * Generates a balanced mix of question types sequentially to avoid local CPU timeouts
 * and JSON truncation errors.
 */

const { generateJSON, OllamaUnavailableError } = require('../lib/ai/llm.service');

// Distribution across 6 types (proportional for any count)
const QUESTION_TYPES = [
  { type: 'Definition',      description: 'Ask the student to define a concept or term from the material.' },
  { type: 'Conceptual',      description: 'Ask the student to explain how something works or why it exists.' },
  { type: 'Comparison',      description: 'Ask the student to compare two concepts (e.g. X vs Y).' },
  { type: 'Scenario-Based',  description: 'Present a realistic scenario and ask what happens or what they would do.' },
  { type: 'Application',     description: 'Ask how a concept is applied to solve a real problem.' },
  { type: 'Coding-Oriented', description: 'Ask to write, trace, or reason about a code snippet related to the topic.' },
];

async function llmGenerator(text, subject, count) {
  // Limit context to avoid blowing token budget
  const contextText = text.length > 4500 ? text.slice(0, 4500) + '…' : text;

  const generatedQuestions = [];
  const seenTexts = new Set();

  // Cycle difficulties: EASY, MEDIUM, HARD
  const difficulties = ['EASY', 'MEDIUM', 'HARD'];

  console.log(`[LLMGenerator] Starting sequential generation for ${count} questions...`);

  for (let i = 0; i < count; i++) {
    const type = QUESTION_TYPES[i % QUESTION_TYPES.length];
    const difficulty = difficulties[i % difficulties.length];
    const avoidList = generatedQuestions.map(q => q.questionText);

    const prompt = `You are an expert technical examiner creating a viva question for "${subject}".

## Study Material
${contextText}

## Task
Generate exactly ONE "${type.type}" viva question based on the material above.
Type description: ${type.description}
Difficulty level: ${difficulty}

${avoidList.length > 0 ? `Avoid generating questions similar or duplicate to these existing questions:\n${avoidList.map(q => `- ${q}`).join('\n')}` : ''}

Requirements:
- The question must be derived from the material above, not from general knowledge.
- EASY = straightforward recall, MEDIUM = understanding/application, HARD = analysis/synthesis.
- expectedAnswer must be 2-3 sentences drawn from the material.
- keywords = 5-8 essential terms a correct answer MUST include (comma-separated).

Return ONLY a JSON object:
{
  "questionText": "...",
  "type": "${type.type}",
  "subject": "${subject}",
  "topic": "<specific sub-topic, 1-3 words>",
  "difficulty": "${difficulty}",
  "expectedAnswer": "...",
  "keywords": "..."
}`;

    try {
      console.log(`[LLMGenerator] Generating question ${i + 1}/${count} (${type.type}, ${difficulty})...`);
      // Since it's a single question, we can restrict maxTokens to 512, which makes it even faster!
      const { data } = await generateJSON(prompt, { temperature: 0.3, maxTokens: 512 });

      if (data && data.questionText) {
        const questionText = String(data.questionText).trim();
        const key = questionText.toLowerCase().slice(0, 60);

        if (!seenTexts.has(key) && questionText.length > 10) {
          seenTexts.add(key);
          generatedQuestions.push({
            questionText,
            subject:        String(data.subject || subject).trim(),
            topic:          String(data.topic || 'General').trim(),
            difficulty:     ['EASY','MEDIUM','HARD'].includes(String(data.difficulty).toUpperCase())
                              ? String(data.difficulty).toUpperCase() : difficulty,
            expectedAnswer: String(data.expectedAnswer || '').trim(),
            keywords:       String(data.keywords || '').trim(),
          });
        } else {
          console.warn(`[LLMGenerator] Skipped duplicate/empty question for index ${i}`);
        }
      }
    } catch (err) {
      if (err instanceof OllamaUnavailableError) throw err;
      console.error(`[LLMGenerator] Failed generating question index ${i}:`, err.message);
      // Continue to try generating other questions
    }
  }

  if (generatedQuestions.length === 0) {
    throw new Error('AI question generation failed completely.');
  }

  console.log(`[LLMGenerator] Generation completed. Successfully generated ${generatedQuestions.length}/${count} questions.`);
  return generatedQuestions;
}

module.exports = { llmGenerator };
