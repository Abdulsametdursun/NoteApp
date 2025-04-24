import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log('🔑 ENV KEY (server):', process.env.OPENAI_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('💡 Incoming request body:', body);

    const { documentData, question } = body;

    if (!documentData || !question) {
      console.log('❌ documentData or question missing:', { documentData, question });
      return NextResponse.json({ error: 'Missing input' }, { status: 400 });
    }

    const context = documentData.slice(0, 4000);

    const prompt = `
You are an assistant helping with document analysis.
The document is:
${context}

Question: ${question}
Answer:
`;

    console.log('🧠 Prompt sent to OpenAI:', prompt);

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const message = completion.choices[0]?.message?.content;

    return NextResponse.json({ message });
  } catch (error: any) {
    console.error('❌ chatToDocument error:', error?.message || error);
    return NextResponse.json({ error: error?.message || 'Something went wrong' }, { status: 500 });
  }
}
