import nodemailer from 'nodemailer';

class EmailService {
    constructor() {
        this.transporter = null;
        this.config = null;
    }

    configure(config) {
        this.config = config;
        this.transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.port === 465, // true for 465, false for other ports
            auth: {
                user: config.user,
                pass: config.pass,
            },
        });
    }

    async verifyConnection() {
        if (!this.transporter) {
            throw new Error('Email service not configured');
        }
        return this.transporter.verify();
    }

    async sendEmail(to, subject, html) {
        if (!this.transporter) {
            throw new Error('Email service not configured');
        }

        const info = await this.transporter.sendMail({
            from: `"${this.config.fromName || 'Prospect Engine'}" <${this.config.user}>`,
            to,
            subject,
            html,
        });

        return info;
    }
}

export const emailService = new EmailService();
