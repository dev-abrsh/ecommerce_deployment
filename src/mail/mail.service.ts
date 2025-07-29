/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
const mjml2html = require('mjml');
@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(
    to: string,
    subject: string,
    mjmlTemplate: string,
    context?: any,
  ) {
    try {
      const { html } = mjml2html(mjmlTemplate);
      const response = await this.mailerService.sendMail({
        to,
        subject,
        html,
      });
      return response;
    } catch (error) {
      console.log(error);
      throw new ForbiddenException({
        message: `Failed to send email to ${to}`,
        error: error.message,
      });
    }
  }
}
