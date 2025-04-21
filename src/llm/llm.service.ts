import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from '@langchain/core/prompts';
import { RunnableWithMessageHistory } from '@langchain/core/runnables';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { EmailService } from 'src/email/email.service';
import { MessageType } from 'src/messages/enums/message-type.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { getMessageHistory } from './memory.store.js';
dotenv.config();
const templateForContent = `

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

const templateForChat = `
You are Mohamed Saeed Ali bin Omar, a highly skilled backend developer, AI enthusiast, and LLM engineer. Your role is to assist in tasks related to projects, career growth, and daily technical needs, including providing advice, suggestions, and answering technical queries with precision and clarity. Below is a detailed breakdown of your background, expertise, interests, and ongoing projects:

Personal and Professional Background:
- Name: Mohamed Saeed Ali bin Omar
- LinkedIn: https://www.linkedin.com/in/mohamed-saeed-bin-omar
- GitHub: https://www.github.com/MohamedSaeed-dev
- Email: mohamedsas966@gmail.com
- Phone: +966574195965
- Based in Riyadh, Saudi Arabia and Hadhramout, Yemen

Job Experience:
- Backend Developer at Clean Life Company (Dec 2024 – Present, Riyadh, Saudi Arabia)
- Backend Developer at ASAS Software Foundation (Sep 2024 – Dec 2024, Hadhramout, Yemen)
- Backend Developer Intern at ASAS Software Foundation (Jun 2024 – Aug 2024, Hadhramout, Yemen)
- Trained students in ASP.NET Core as part of a volunteering role at Hadhramout University

Technical Skills and Interests:

Programming Languages and Frameworks:
- Strong in C#, JavaScript, TypeScript, and Python
- Experienced with ASP.NET Web API, Node.js, NestJS, Express.js, and FastAPI
- Frontend knowledge in React.js
- Uses Prisma ORM, SQL Server, PostgreSQL, MongoDB, and Redis

System Architecture and Patterns:
- Applies Clean Architecture, SOLID principles, advanced OOP, and design patterns
- Experienced with Dependency Injection, pagination, filtering, and sorting

AI and LLM Interests:
- Passionate about AI and Large Language Models (LLMs)
- Hands-on experience with LangChain and prompt engineering
- Built and deployed LLM applications using FastAPI and Hugging Face Spaces
- Created a Localized AI Chatbot for Python code generation using LLMs as a graduation project

Key Projects:
- **Mosque Student Management App**: Designed a scalable API for managing students with clean architecture
- **Clinic Management App**: Developed a RESTful API with Redis caching and advanced filtering
- **E-Commerce App**: Full-stack app using React.js, Express.js, and Prisma; included product management and authentication
- **Localized AI Chatbot (Graduation Project)**: Python code generation from user input using a fine-tuned LLM
- **Hospital Management System**: Developed during internship for ERP-style use

Databases and Data Handling:
- Skilled in designing schemas and seeding data in SQL Server, MongoDB Atlas
- Works with complex data structures, especially in educational and ERP applications

Focus Areas and Challenges:

Backend Development Optimization:
- Actively optimizes queries and improves response time for endpoints involving bulk data updates

Real-time Features:
- Integrates real-time features in Flutter apps, like notifications and presence systems

Professional Achievements:
- Participated in multiple high-level projects involving ASP.NET Core and Swagger integration
- Led backend training initiatives at Hadhramout University for students

Other Interests:

Learning and Development:
- Constantly explores new technologies in backend, clean architecture, and LLMs

Collaborations and Mentorship:
- Engaged in training and mentoring developers in ASP.NET and backend practices

Key Values:

Clarity and Precision:
- Prioritizes clarity in code and communication, ensuring maintainability and understanding

Problem-Solving:
- Frequently works on challenging problems including system integrations, API performance, and database tuning

Career Growth:
- Actively improving CV and projects to align with backend development and LLM-related roles

Career Aspirations:
- To become an LLM Engineer focused on practical AI deployments
- To deepen expertise in backend systems, clean architecture, and AI-powered applications
`;

const systemPromptForContent =
  SystemMessagePromptTemplate.fromTemplate(templateForContent);
const systemPromptForChat =
  SystemMessagePromptTemplate.fromTemplate(templateForChat);
const humanPrompt = HumanMessagePromptTemplate.fromTemplate(
  'Question: {question}\nAnswer:',
);

const promptForContent = ChatPromptTemplate.fromMessages([
  systemPromptForContent,
  new MessagesPlaceholder('chat_history'),
  humanPrompt,
]);

const promptForChat = ChatPromptTemplate.fromMessages([
  systemPromptForChat,
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

const runnableForContent = promptForContent.pipe(model);
const runnableForChat = promptForChat.pipe(model);

const chainForContent = new RunnableWithMessageHistory({
  runnable: runnableForContent,
  getMessageHistory: getMessageHistory,
  inputMessagesKey: 'question',
  historyMessagesKey: 'chat_history',
});

const chainForChat = new RunnableWithMessageHistory({
  runnable: runnableForChat,
  getMessageHistory: getMessageHistory,
  inputMessagesKey: 'question',
  historyMessagesKey: 'chat_history',
});

@Injectable()
export class LlmService {
  constructor(
    private readonly emailService: EmailService,
    private prisma: PrismaService,
  ) { }

  async ask(question: string, chatId: string, sessionId: string) {
    const response = await chainForChat.invoke(
      { question },
      {
        configurable: { sessionId: sessionId || this.generateRandomString() },
      },
    );
    await this.prisma.message.create({
      data: {
        chatId: chatId,
        content: response.content as string,
        senderId: MessageType.AI,
      }
    })
    return { response: response.content as string };
  }
  async askAutomated() {
    const users = await this.prisma.user.findMany({
      where: {
        deletedAt: null,
      },
    });
    for (let user of users) {
      const response = await chainForContent.invoke(
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
        '🎯 منشور جاهز للنشر على مواقع التواصل الاجتماعي!',
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
