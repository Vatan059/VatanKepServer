import { sendAlertEmail } from "./mailer";

sendAlertEmail("VatanKepServer - test e-postasi", "Bu bir test mesajidir. SMTP ayarlariniz calisiyor.").then(() => {
  console.log("Bitti.");
});
