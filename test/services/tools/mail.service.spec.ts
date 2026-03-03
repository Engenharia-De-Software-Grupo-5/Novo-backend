jest.mock('nodemailer', () => ({
  createTransport: jest.fn(),
}));

describe('MailService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call transporter.sendMail with correct payload (to, subject, text)', async () => {
    const nodemailer = require('nodemailer');
    const sendMail = jest.fn().mockResolvedValue({ messageId: '1' });

   
    nodemailer.createTransport.mockReturnValue({ sendMail });

    const { MailService } = require('src/services/tools/mail.service');
    const service = new MailService();

    await service.sendMail('user@mail.com', 'Hello', 'Body text');

    expect(sendMail).toHaveBeenCalledTimes(1);
    expect(sendMail.mock.calls[0][0]).toMatchObject({
      to: 'user@mail.com',
      subject: 'Hello',
      text: 'Body text',
    });
  });

  it('should propagate errors from sendMail', async () => {
    const nodemailer = require('nodemailer');
    const sendMail = jest.fn().mockRejectedValue(new Error('smtp down'));

    nodemailer.createTransport.mockReturnValue({ sendMail });

    const { MailService } = require('src/services/tools/mail.service');
    const service = new MailService();

    await expect(service.sendMail('a@b.com', 'x', 'y')).rejects.toThrow('smtp down');
  });
});