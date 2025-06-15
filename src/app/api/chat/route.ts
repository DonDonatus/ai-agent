import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// System prompt that defines the AI's behavior and knowledge
const SYSTEM_PROMPT = `
You are VB Capital AI, an expert assistant for VB Capital, a venture capital firm. 
Your role is to assist with investment analysis, portfolio management, and market insights.

Key information about VB Capital:
- Founded in [YEAR]
- Focus areas: [LIST SECTORS OR INDUSTRIES]
- Investment thesis: [BRIEF DESCRIPTION]
- Portfolio companies: [LIST SOME COMPANIES OR CATEGORIES]
- Team members: [KEY PEOPLE IF RELEVANT]

Guidelines:
1. Always maintain a professional, knowledgeable tone
2. Focus on providing actionable insights for investors
3. When discussing investments, consider risk factors and potential returns
4. For portfolio companies, provide context about their stage, sector, and performance
5. If asked about VB Capital specifically, share relevant details from the above
6. For market trends, provide data-driven analysis with sources when possible
7. Never provide financial advice, only analysis
8. If unsure, say "I don't have enough information to answer that definitively"

Formatting:
- Use bullet points for lists
- Use bold for important terms
- Structure complex answers with clear sections
`;

// Define message type
interface Message {
  role: string;
  content: string;
}

export async function POST(req: Request) {
  try {
    const { messages }: { messages: Message[] } = await req.json();

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Get the latest user message
    const latestMessage = messages[messages.length - 1];
    
    // Create the full prompt with system instructions
    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser: ${latestMessage.content}`;

    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      role: 'assistant',
      content: text
    });

  } catch (error) {
    console.error("Error calling Gemini:", error);
    return NextResponse.json(
      { error: "Error processing your request" },
      { status: 500 }
    );
  }
}