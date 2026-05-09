import { Resend } from "resend";

export async function sendWelcomeEmail(input: { email: string; discord?: string; role: string }) {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: input.email,
    subject: "Bienvenido a Uruguay Demon List",
    html: `
      <div style="font-family:Inter,Arial,sans-serif;background:#050505;color:#f5f5f5;padding:24px;border-radius:16px;border:1px solid #1f1f27;max-width:640px;">
        <h1 style="margin:0 0 12px 0;font-size:24px;">Registro completado en UYDL</h1>
        <p style="color:#c8c8d4;">Tu cuenta quedó creada correctamente.</p>
        <table style="width:100%;margin-top:16px;border-collapse:collapse;">
          <tr><td style="padding:8px;border:1px solid #222233;">Email</td><td style="padding:8px;border:1px solid #222233;">${input.email}</td></tr>
          <tr><td style="padding:8px;border:1px solid #222233;">Discord</td><td style="padding:8px;border:1px solid #222233;">${input.discord ?? "No especificado"}</td></tr>
          <tr><td style="padding:8px;border:1px solid #222233;">Rol</td><td style="padding:8px;border:1px solid #222233;">${input.role}</td></tr>
        </table>
      </div>
    `,
  });
}
