import { Injectable } from '@nestjs/common';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from '@langchain/core/prompts';
import { RunnableWithMessageHistory } from '@langchain/core/runnables';
import { getMessageHistory } from './memory.store.js';
import * as dotenv from 'dotenv';
import { Response } from 'express';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
dotenv.config();
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
  constructor(
    private readonly emailService: EmailService,
    private prisma: PrismaService,
    userService: UsersService,
  ) {}

  async ask(question: string, sessionId: string) {
    const response = await chain.invoke(
      { question },
      {
        configurable: { sessionId: sessionId || this.generateRandomString() },
      },
    );
    return { response: response.content as string };
  }
  async askAutomated() {
    const users = await this.prisma.user.findMany({
      where: {
        deletedAt: null,
      },
    });
    for (let user of users) {
      const response = await chain.invoke(
        { question: 'انشى محتوى جديد عشوائي' },
        {
          configurable: { sessionId: this.generateRandomString() },
        },
      );

      const content = response.content as string;
      const emailHtml = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f7f7f7;
          padding: 20px;
          color: #222;
        }
        .container {
          background-color: #fff;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          direction: rtl;
          text-align: right;
          line-height: 1.8;
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #888;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        ${content}
      </div>
      <div class="footer">
  البريد أُرسل بواسطة مساعد الذكاء الاصطناعي 🤖✨<br>
  <a href="${process.env.BASE_URL}/users/${user.id}/unsubscribe" style="color: #007bff;">لالغاء الاشتراك اضغط هنا</a>
</div>

    </body>
    </html>
  `;

      await this.emailService.sendMail(
        user.email,
        '🎯 منشور جاهز للنشر على LinkedIn!',
        emailHtml,
      );
    }
  }

  // to create random sessionId for each user
  generateRandomString(length: number = 5): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomChar = characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
      result += randomChar;
    }
    return result;
  }
}
