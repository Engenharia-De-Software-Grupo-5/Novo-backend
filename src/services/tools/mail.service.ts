import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  async sendMail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: `Infinity Sistem - <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text,
    };

    return this.transporter.sendMail(mailOptions);
  }
}
