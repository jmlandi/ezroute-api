import { Injectable } from '@nestjs/common';

@Injectable()
export class ResendService {
  /**
   * Sending transactional emails via Resend
   */
  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    // resend.emails.send(...)
    console.log(`[Resend] Sending email to ${to} with subject: ${subject}`);
  }
}
