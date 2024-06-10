import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { PostInquiryRequestDto } from './inquiries.request.dto';
import { EmailService } from '@libs/email';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InquiriesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async createInquiry(dto: PostInquiryRequestDto) {
    await this.emailService.sendEmail({
      to: this.configService.get('GMAIL_USERNAME'),
      subject: '고객 문의',
      html: this.createInquiryHtmlFromJson(dto),
    });
    return this.prismaService.inquiry.create({ data: dto });
  }

  private createInquiryHtmlFromJson(dto: PostInquiryRequestDto): string {
    return `
      <h2>고객 정보</h2>
      작성자 이름: ${dto.name}<br>
      작성자 핸드폰 번호: ${dto.phone}<br>
      작성자 이메일: ${dto.email}<br>
      담당직원: ${dto.staffName || '없음'}<br>
      <br><br>
      <h2>문의 내용</h2>
      ${dto.content}
      <br><br>
      <h3>문의 날짜</h3>
      ${dto.createdAt}<br>
    `;
  }
}
