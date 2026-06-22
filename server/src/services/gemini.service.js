import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-3.5-flash';

/**
 * Helper to wrap Gemini calls with exactly one retry on failure
 * (e.g., if Gemini returns invalid JSON despite the schema, or an API error occurs).
 */
const withRetry = async (operation) => {
  try {
    return await operation();
  } catch (error) {
    console.error('[Gemini Service] Operation failed, retrying once...', error);
    try {
      return await operation();
    } catch (retryError) {
      console.error('[Gemini Service] Operation failed on retry.', retryError);
      throw new Error('AI Service is currently unavailable or returned invalid data.');
    }
  }
};

/**
 * Generate Interview Questions
 * @param {Object} params
 * @param {string} params.role
 * @param {string} params.difficulty
 * @param {string} params.interviewType - 'TECHNICAL', 'BEHAVIORAL', or 'MIXED'
 * @param {number} params.questionCount
 * @returns {Promise<Array<{question: string, type: 'TECHNICAL' | 'BEHAVIORAL'}>>}
 */
export const generateQuestions = async ({ role, difficulty, interviewType, questionCount }) => {
  const prompt = `You are an expert technical interviewer.
Generate exactly ${questionCount} interview questions for a ${difficulty} level ${role} role.
The interview type is ${interviewType}.
Provide a mix of technical and behavioral questions if the type is MIXED, otherwise focus purely on the requested type.`;

  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          description: 'A list of interview questions.',
          items: {
            type: Type.OBJECT,
            properties: {
              question: {
                type: Type.STRING,
                description: 'The interview question text.',
              },
              type: {
                type: Type.STRING,
                description: 'The type of the question. Must be strictly TECHNICAL or BEHAVIORAL.',
                enum: ['TECHNICAL', 'BEHAVIORAL'],
              },
            },
            required: ['question', 'type'],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text());
    
    if (!Array.isArray(parsed) || parsed.length !== questionCount) {
      throw new Error('AI did not return the expected number of questions.');
    }

    return parsed;
  });
};

/**
 * Evaluate Interview Answer
 * @param {Object} params
 * @param {string} params.question - The question text
 * @param {string} params.answer - The candidate's answer
 * @returns {Promise<{score: number, strengths: string[], weaknesses: string[], suggestions: string[], feedback: string}>}
 */
export const evaluateAnswer = async ({ question, answer }) => {
  const prompt = `You are an expert interviewer evaluating a candidate's answer.
Question: ${question}
Candidate's Answer: ${answer}

Evaluate the answer. Score it from 0 to 100.
Identify strengths and weaknesses.
Provide actionable suggestions for improvement.
Provide an overall feedback summary.`;

  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.INTEGER,
              description: 'A score from 0 to 100 representing the quality of the answer.',
            },
            strengths: {
              type: Type.ARRAY,
              description: 'List of strengths in the candidate\'s answer.',
              items: { type: Type.STRING },
            },
            weaknesses: {
              type: Type.ARRAY,
              description: 'List of weaknesses or gaps in the candidate\'s answer.',
              items: { type: Type.STRING },
            },
            suggestions: {
              type: Type.ARRAY,
              description: 'Actionable suggestions for how the candidate can improve their answer.',
              items: { type: Type.STRING },
            },
            feedback: {
              type: Type.STRING,
              description: 'Overall feedback summary (1-2 paragraphs).',
            },
          },
          required: ['score', 'strengths', 'weaknesses', 'suggestions', 'feedback'],
        },
      },
    });

    const parsed = JSON.parse(response.text());

    // Validate score range just to be safe
    if (parsed.score < 0) parsed.score = 0;
    if (parsed.score > 100) parsed.score = 100;

    return parsed;
  });
};
