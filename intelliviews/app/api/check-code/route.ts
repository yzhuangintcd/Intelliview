import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { code, taskDescription, starterCode, checksUsed } = await request.json();

    if (!code || !taskDescription) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if they've exceeded the limit
    if (checksUsed >= 3) {
      return NextResponse.json(
        { error: 'Maximum number of code checks (3) reached' },
        { status: 400 }
      );
    }

    // Prepare the system prompt for the interviewer
    const systemPrompt = `You are an experienced technical interviewer conducting a live coding interview.

Your role is to:
1. Check for syntax errors (if any)
2. Analyze if the candidate is on the right track to solving the problem
3. Provide helpful guidance like a real interviewer would - be encouraging but don't give away the answer
4. If there are issues, give subtle hints that guide them in the right direction
5. If they're doing well, acknowledge it and nudge them to consider edge cases or improvements

IMPORTANT GUIDELINES:
- NEVER provide the complete solution or fix the code directly
- Use questions to make them think ("Have you considered...?", "What happens when...?")
- Be supportive and encouraging (this is a real interview)
- If there are syntax errors, point them out specifically
- If the logic is flawed, ask guiding questions
- Keep your response concise (3-5 sentences max)
- Use a conversational, friendly tone like you're screen-sharing with them

Respond as if you're speaking directly to the candidate during a live interview session.`;

    const userMessage = `The candidate is working on the following problem:

PROBLEM:
${taskDescription}

ORIGINAL CODE:
${starterCode}

CANDIDATE'S CURRENT CODE:
${code}

Please review their code and provide guidance.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      temperature: 0.8,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: userMessage,
            },
          ],
        },
      ],
    });

    const feedback = message.content[0].type === 'text' 
      ? message.content[0].text 
      : 'Unable to analyze code';

    return NextResponse.json({
      success: true,
      feedback,
      checksRemaining: 2 - checksUsed,
    });

  } catch (error: any) {
    console.error('❌ Error checking code:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check code', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
