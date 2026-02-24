import axios from 'axios';

// Get API key from environment (will be loaded by server.js)
const getGeminiApiKey = () => process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Step-specific prompts
const STEP_PROMPTS = {
  clean: (text) => `Clean the following text by removing extra whitespace and fixing basic grammar. Return only the cleaned text without any additional commentary:\n\n${text}`,

  summarize: (text) => `Summarize the following text into approximately 5 lines. Be concise and capture the main points:\n\n${text}`,

  extract: (text) => `Extract the key points from the following text and return them as bullet points. Each point should be on a new line starting with a bullet (•):\n\n${text}`,

  tag: (text) => `Classify the following text into ONE of these categories: Technology, Finance, Health, Education, or Other. Return ONLY the category name, nothing else:\n\n${text}`
};

// Sleep function for rate limiting
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Exponential backoff retry logic
async function retryWithBackoff(fn, maxRetries = 5) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      // Retry only on 429 (rate limit) or 503 (service unavailable) errors
      if (error.response?.status === 429 || error.response?.status === 503) {
        // Significantly longer delay for free tier: 4s, 8s, 16s, 32s
        const delay = Math.pow(2, attempt + 2) * 1000;
        console.log(`Rate limited. Retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})...`);
        await sleep(delay);

        if (attempt === maxRetries - 1) {
          throw new Error('Max retries reached for rate limit');
        }
      } else {
        // For other errors, throw immediately
        throw error;
      }
    }
  }
}

// Call Gemini API
async function callGemini(prompt) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const response = await axios.post(
    `${GEMINI_API_URL}?key=${apiKey}`,
    {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024
      }
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('No text response from Gemini');
  }

  return text.trim();
}

// Process a single step
export async function processStep(stepType, inputText) {
  const prompt = STEP_PROMPTS[stepType];
  if (!prompt) {
    throw new Error(`Unknown step type: ${stepType}`);
  }

  const output = await retryWithBackoff(() => callGemini(prompt(inputText)));
  return output;
}

// Process all steps sequentially
export async function processWorkflow(steps, initialInput) {
  const outputs = [];
  let currentInput = initialInput;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    console.log(`Processing step ${i + 1}/${steps.length}: ${step}`);

    // Process the step
    const output = await processStep(step, currentInput);

    outputs.push({
      step,
      output,
      timestamp: new Date()
    });

    // Output of current step becomes input for next step
    currentInput = output;

    // Add 4-second delay between LLM calls to respect strict free tier quota
    if (i < steps.length - 1) {
      await sleep(4000);
    }
  }

  return outputs;
}

// Health check for LLM with explicit hard timeout
export async function checkLLMHealth() {
  try {
    // Prevent the health check itself from hanging due to rate limits or dead connections
    const result = await Promise.race([
      callGemini('Hello'),
      new Promise((_, reject) => setTimeout(() => reject(new Error('LLM connection timed out')), 5000))
    ]);
    return { status: 'healthy', message: 'LLM is reachable' };
  } catch (error) {
    if (error.response?.status === 429 || error.response?.status === 503) {
      return { status: 'unhealthy', message: 'LLM is currently rate limited or overloaded' };
    }
    return { status: 'unhealthy', message: error.message };
  }
}
