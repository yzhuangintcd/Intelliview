import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { connectToMongo } from '@/lib/mongodb';
import InterviewResponse from '@/models/InterviewResponse';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface RequestBody {
  candidateEmail: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestBody;
    const { candidateEmail } = body;

    if (!candidateEmail) {
      return NextResponse.json(
        { error: 'Candidate email is required' },
        { status: 400 }
      );
    }

    // Fetch all responses for this candidate
    await connectToMongo();
    const responses = await InterviewResponse.find({ candidateEmail })
      .sort({ createdAt: 1 });

    if (responses.length === 0) {
      return NextResponse.json(
        { error: 'No interview responses found for this candidate' },
        { status: 404 }
      );
    }

    // Organize responses by interview type
    const technical1Responses = responses.filter(r => r.interviewType === 'technical1');
    const technical2Responses = responses.filter(r => r.interviewType === 'technical2');
    const behaviouralResponses = responses.filter(r => r.interviewType === 'behavioural');

    // Build context for Claude
    const interviewContext = `
INTERVIEW PERFORMANCE ANALYSIS

=== TECHNICAL ASSESSMENT 1 (Coding & Bug Fixes) ===
${technical1Responses.map(r => `
Task: ${r.taskTitle}
Difficulty: ${r.metadata?.difficulty || 'Unknown'}
Response:
${r.response}
Time Spent: ${r.timeSpentSeconds}s
`).join('\n---\n') || 'No responses submitted'}

=== TECHNICAL ASSESSMENT 2 (Scenario Analysis & Decision Making) ===
${technical2Responses.map(r => `
Task: ${r.taskTitle}
Difficulty: ${r.metadata?.difficulty || 'Unknown'}
Response:
${r.response}
Time Spent: ${r.timeSpentSeconds}s
`).join('\n---\n') || 'No responses submitted'}

=== BEHAVIORAL ASSESSMENT (Workplace Scenarios) ===
${behaviouralResponses.map(r => `
Scenario: ${r.taskTitle}
Question Asked: ${r.metadata?.question || 'N/A'}
Candidate Response:
${r.response}
`).join('\n---\n') || 'No responses submitted'}
`;

    const systemPrompt = `You are a senior engineering manager providing constructive feedback after a comprehensive technical interview. 

Your task is to analyze the candidate's performance across all three interview sections and provide:
1. Overall assessment (1-2 sentences)
2. Key strengths (2-3 bullet points)
3. Areas for improvement (2-3 bullet points with specific, actionable advice)
4. Recommended next steps for their development

Be:
- Constructive and encouraging
- Specific (reference actual responses when possible)
- Actionable (give concrete steps they can take)
- Balanced (acknowledge strengths even when pointing out weaknesses)
- Professional and supportive

Format your response in clear sections with markdown formatting.`;

    const userMessage = `Please analyze this candidate's interview performance and provide detailed feedback:\n\n${interviewContext}`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      temperature: 0.7,
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

    // Extract the response text
    const feedback =
      response.content[0].type === 'text' ? response.content[0].text : '';

    console.log('✅ Performance analysis generated');
    console.log(`📊 Tokens used: ${response.usage.input_tokens + response.usage.output_tokens}`);

    return NextResponse.json(
      {
        success: true,
        feedback,
        stats: {
          totalResponses: responses.length,
          technical1Count: technical1Responses.length,
          technical2Count: technical2Responses.length,
          behaviouralCount: behaviouralResponses.length,
          totalTimeSpent: responses.reduce((sum, r) => sum + (r.timeSpentSeconds || 0), 0),
        },
        tokenUsage: {
          input: response.usage.input_tokens,
          output: response.usage.output_tokens,
          total: response.usage.input_tokens + response.usage.output_tokens,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error analyzing performance:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze performance',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
