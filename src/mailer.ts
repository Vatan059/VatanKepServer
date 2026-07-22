import "dotenv/config";
import nodemailer from "nodemailer";

const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM, ALERT_TO } = process.env;

const isConfigured = !!(SMTP_HOST && SMTP_FROM && ALERT_TO);

const transporter = isConfigured
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT ? Number(SMTP_PORT) : 587,
      secure: SMTP_SECURE === "true",
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    })
  : null;

if (!isConfigured) {
  console.warn(
    "[mailer] SMTP ayarlari (.env: SMTP_HOST, SMTP_FROM, ALERT_TO) tanimli degil - e-posta uyarilari devre disi, sadece konsola yazilacak."
  );
}

export async function sendAlertEmail(subject: string, body: string): Promise<void> {
  if (!transporter) {
    console.warn(`[mailer] (SMTP tanimsiz, mail gonderilmedi) ${subject}\n${body}`);
    return;
  }
  try {
    await transporter.sendMail({
      from: SMTP_FROM,
      to: ALERT_TO,
      subject,
      text: body,
    });
    console.log(`[mailer] Gonderildi: ${subject}`);
  } catch (err) {
    console.error(`[mailer] Gonderilemedi: ${subject}`, err);
  }
}
