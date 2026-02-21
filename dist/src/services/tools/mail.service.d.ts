export declare class MailService {
    private transporter;
    sendMail(to: string, subject: string, text: string): Promise<any>;
}
