import OpenAI from 'openai';

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY;

// Initialize the OpenAI client if API key is available
let openai: OpenAI | null = null;

if (openaiApiKey) {
  openai = new OpenAI({ 
    apiKey: openaiApiKey,
    dangerouslyAllowBrowser: true // Allow usage in browser environment
  });
}

export async function summarizeText(text: string): Promise<string> {
  try {
    // If no API key, use the backend service
    if (!openai) {
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to summarize text');
      }

      const data = await response.json();
      return data.summary;
    }

    // Use OpenAI directly if API key is available
    const prompt = `Please summarize the following text concisely while maintaining key points:\n\n${text}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content || 'No summary generated';
  } catch (error) {
    console.error('Error summarizing text:', error);
    throw error;
  }
}

export async function answerQuestion(question: string, context?: string): Promise<string> {
  try {
    // If no API key, use the backend service
    if (!openai) {
      const response = await fetch('/api/ai/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, context }),
      });

      if (!response.ok) {
        throw new Error('Failed to answer question');
      }

      const data = await response.json();
      return data.answer;
    }

    // Use OpenAI directly if API key is available
    let prompt = `Please answer the following question concisely and accurately: ${question}`;
    
    if (context) {
      prompt = `Based on the following information:\n\n${context}\n\nPlease answer this question: ${question}`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content || 'No answer generated';
  } catch (error) {
    console.error('Error answering question:', error);
    throw error;
  }
}

export async function generateQuizQuestions(subject: string, topic: string, count: number = 5): Promise<any> {
  try {
    // If no API key, return dummy data
    if (!openai) {
      return {
        questions: [
          {
            question: `Sample ${subject} question about ${topic}?`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: "Option A"
          }
        ]
      };
    }

    // Use OpenAI directly if API key is available
    const prompt = `Generate ${count} multiple-choice quiz questions about ${topic} for a ${subject} class. 
    For each question, provide four options and indicate the correct answer. 
    Format your response as a JSON object with this structure:
    {
      "questions": [
        {
          "question": "Question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "Option that is correct"
        }
      ]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No content returned from OpenAI');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    throw error;
  }
}

export async function analyzePerformanceTrends(performanceData: any): Promise<string> {
  try {
    // If no API key, return dummy data
    if (!openai) {
      return "Performance analysis not available. Please check back later.";
    }

    // Use OpenAI directly if API key is available
    const prompt = `Analyze the following student performance data and provide a concise summary of trends and recommendations:
    ${JSON.stringify(performanceData)}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content || 'No analysis generated';
  } catch (error) {
    console.error('Error analyzing performance trends:', error);
    throw error;
  }
}
