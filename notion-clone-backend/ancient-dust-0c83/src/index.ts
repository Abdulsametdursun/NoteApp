import OpenAI from 'openai';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
	OPEN_AI_KEY: string;
	AI: Ai;
};

const app = new Hono<{ Bindings: Bindings }>();

// Apply CORS middleware for all routes
app.use(
	'/*',
	cors({
		origin: '*',
		allowHeaders: ['X-CustomHeader', 'Upgrade-Insecure-Request', 'Content-Type'],
		allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT'],
		exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
		maxAge: 600,
		credentials: true,
	})
);

// Endpoint to process user question based on document content using OpenAI
app.post('/chatToDocument', async (c) => {
	const openai = new OpenAI({
		apiKey: c.env.OPEN_AI_KEY,
	});

	const { documentData, question } = await c.req.json();
	const ChatCompletion = await openai.chat.completions.create({
		messages: [
			{
				role: 'system',
				content:
					'You are a assistant helping the user to chat to a document, I am providing a JSON file of the markdown for the document. Using this, answer the users question in the clearest way possible, the document is about.' +
					documentData,
			},
			{
				role: 'user',
				content: 'My Question is: ' + question,
			},
		],
		model: 'gpt-4o',
		temperature: 0.5,
	});
	const response = ChatCompletion.choices[0].message.content;
	return c.json({ message: response });
});

// Utility to safely prepare plain text from any input
function prepareText(input: unknown): string {
	if (typeof input === 'string') return input;
	try {
		return JSON.stringify(input)
			.replace(/\\n/g, ' ')
			.replace(/[{}[\]"]/g, '')
			.trim();
	} catch {
		return '';
	}
}

// Endpoint to summarize and translate a document using AI models
app.post('/translateDocument', async (c) => {
	try {
		const { documentData, targetLang } = await c.req.json();
		console.log('✅ Step 1: Request body parsed');
		console.log('🌐 Target Language:', targetLang);

		const inputText = prepareText(documentData);

		if (!inputText || inputText.split(' ').length < 5) {
			console.warn('⚠️ Input text too short for summarization:', inputText);
			return c.json({ translated_text: inputText });
		}

		console.log('✅ Step 2: Prepared inputText for summarization');
		console.log('📄 Text Preview:', inputText.slice(0, 300));

		// Summarization step using BART model
		const summaryResponse = await c.env.AI.run('@cf/facebook/bart-large-cnn', {
			input_text: inputText,
			max_length: 1000,
		});
		console.log('✅ Step 3: Received summaryResponse:', summaryResponse);

		const summary = summaryResponse?.summary;
		if (!summary || summary.includes('Ablockgroup')) {
			throw new Error('❌ Invalid or corrupted summary received');
		}

		// Translation step using M2M model
		const translationResponse = await c.env.AI.run('@cf/meta/m2m100-1.2b', {
			text: summary,
			source_lang: 'english',
			target_lang: targetLang,
		});
		console.log('✅ Step 4: Received translationResponse:', translationResponse);

		const translated = translationResponse?.translated_text;
		if (!translated) throw new Error('❌ No translated text returned');

		console.log('✅ Step 5: Returning final translated text');
		return c.json({ translated_text: translated });
	} catch (err) {
		console.error('❌ Error caught in /translateDocument:', err);
		return c.json({ error: 'Translation failed.' }, 500);
	}
});

export default app;
