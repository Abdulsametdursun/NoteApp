import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { documentData, targetLang } = await req.json();

    if (!documentData || !targetLang) {
      return NextResponse.json({ message: 'Missing parameters' }, { status: 400 });
    }

    const prompt = `
      Translate this document summary into ${targetLang}:
      -----
      ${documentData}
      -----
      Respond with only the translated summary.
    `;

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const translated_text = chatCompletion.choices[0]?.message.content?.trim() || '';

    return NextResponse.json({ translated_text });
  } catch (error) {
    console.error('🔥 Translation error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
