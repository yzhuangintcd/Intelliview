import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface RequestBody {
  scenario: {
    id: number;
    title: string;
    situation: string;
  };
  role: string; // e.g., "Senior Software Engineer", "Full Stack Developer"
}

// Budget tracking (simple in-memory, reset on server restart)
let totalTokensUsed = 0;
const BUDGET_TOKENS = 20000; // ~$0.30 with Haiku pricing (10k tokens = ~$0.15)

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestBody;
    const { scenario, role } = body;

    // Check budget
    if (totalTokensUsed > BUDGET_TOKENS * 0.9) {
      return NextResponse.json(
        { error: 'API budget nearly reached. Please contact support.' },
        { status: 429 }
      );
    }

    const systemPrompt = `You are a concise technical interviewer evaluating candidates for a ${role} position. 
Your job is to ask ONE focused question for each behavioral scenario presented to you.

Guidelines:
- Keep the question short (1-2 sentences max, about 20-30 words)
- Ask a specific, probing question that tests their decision-making, communication, or integrity
- Be direct and professional
- Do NOT repeat the scenario back to them
- The question should make them think deeply about their approach

Scenario: "${scenario.title}" - ${scenario.situation}`;

    const userMessage = `Generate ONE focused interview question for this scenario. The question should probe how the candidate would handle this situation, focusing on their decision-making process and values.`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 100,
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

    // Extract token usage
    const inputTokens = response.usage.input_tokens;
    const outputTokens = response.usage.output_tokens;
    const totalTokens = inputTokens + outputTokens;
    totalTokensUsed += totalTokens;

    // Get the response text
    const aiResponse =
      response.content[0].type === 'text' ? response.content[0].text : '';

    console.log(`✅ Claude response generated`);
    console.log(`📊 Tokens used: ${totalTokens} (Total so far: ${totalTokensUsed})`);
    console.log(`💰 Approx cost: $${(totalTokensUsed * 0.00015).toFixed(4)}`);

    return NextResponse.json(
      {
        success: true,
        response: aiResponse,
        tokenUsage: {
          input: inputTokens,
          output: outputTokens,
          total: totalTokens,
          cumulativeTotal: totalTokensUsed,
          estimatedCost: `$${(totalTokensUsed * 0.00015).toFixed(4)}`,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error calling Claude API:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    );
  }
}
