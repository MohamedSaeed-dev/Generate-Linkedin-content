import { Injectable } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from '@langchain/core/runnables';
import { getMessageHistory } from './memory.store.js';
import * as dotenv from 'dotenv'
import { Response } from 'express';
dotenv.config()
const template = `

أنت مساعد ذكي ومحترف في كتابة منشورات عربية مشوقة وجذابة على LinkedIn. وظيفتك هي إنشاء منشور واحد فقط في كل مرة، يتناول موضوعًا عشوائيًا إما في مجال الذكاء الاصطناعي (خاصة LLMs) أو تطوير الباكند باستخدام NestJS.

✅ الشروط:

اكتب بأسلوب حيوي ومثير، مع لمسة احترافية تلائم جمهور LinkedIn.

استخدم اللغة العربية الفصحى البسيطة، وتجنب المصطلحات المعقدة دون شرح.

اجعل المقدمة تجذب الانتباه، والنهاية تحتوي على دعوة للنقاش أو مشاركة الآراء.

لا تذكر أن الموضوع عشوائي، بل قدّمه كفكرة ملهمة أو تجربة تستحق المشاركة.

استخدم الرموز التعبيرية المناسبة 🎯💡🚀 ولكن بدون إفراط.

اجعل طول المنشور مناسباً (من 400 إلى 500 كلمة).

✅ أمثلة للمواضيع المحتملة:

كيف يمكن لـ LLMs تحسين تجربة المستخدم في تطبيقات الدعم الفني.

استخدام Event-Driven Architecture في NestJS لتوسيع نطاق الأنظمة.

الفرق بين RAG و Fine-tuning في تدريب نماذج اللغة.

تجربة بناء RESTful API بمستوى احترافي باستخدام NestJS و TypeORM.

🎯 الهدف: تحفيز المطورين والمهتمين بالتقنية للتفاعل، ومشاركة المعرفة، وبناء هوية مهنية قوية على LinkedIn.


`;

const systemPrompt = SystemMessagePromptTemplate.fromTemplate(template);
const humanPrompt = HumanMessagePromptTemplate.fromTemplate(
  'Question: {question}\nAnswer:',
);

const prompt = ChatPromptTemplate.fromMessages([
  systemPrompt,
  new MessagesPlaceholder('chat_history'),
  humanPrompt,
]);

const model = new ChatGoogleGenerativeAI({
  model: 'gemini-2.0-flash-thinking-exp-01-21',
  maxOutputTokens: 4096,
  temperature: 0.5,
  topP: 0.5,
  apiKey: process.env.GOOGLE_API_KEY,
});

const runnable = prompt.pipe(model);

const chain = new RunnableWithMessageHistory({
  runnable,
  getMessageHistory: getMessageHistory,
  inputMessagesKey: 'question',
  historyMessagesKey: 'chat_history',
});

@Injectable()
export class LlmService {
  async ask(question: string, sessionId: string, res: Response) {
    // res.setHeader('Content-Type', 'text/event-stream');
    // res.setHeader('Cache-Control', 'no-cache');
    // res.setHeader('Connection', 'keep-alive');
    // res.flushHeaders();

    // const stream = await chain.stream({ question }, { configurable: { sessionId } });

    // for await (const chunk of stream) {
    //   res.write(`data: ${JSON.stringify(chunk.content)}\n\n`);
    // }

    // res.write(`event: end\ndata: [DONE]\n\n`);
    // res.end();

     const response = await chain.invoke({ question }, { configurable: { sessionId } });
    return {response :response.content}
  }
}
