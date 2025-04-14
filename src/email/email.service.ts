import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleInit {
  private transporter;

  async onModuleInit() {
    await this.createTransporter();
  }

  private async createTransporter() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    if (!this.transporter) await this.createTransporter();

    const info = await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      html,
    });
  }
}
