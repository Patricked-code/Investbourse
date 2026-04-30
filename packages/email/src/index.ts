import { loadServiceEnv } from "@investbourse/config";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

function htmlToText(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

async function sendWithResend(input: SendEmailInput, env: ReturnType<typeof loadServiceEnv>) {
  if (!env.RESEND_API_KEY) throw new Error("RESEND_API_KEY_REQUIRED");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text ?? htmlToText(input.html),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`RESEND_EMAIL_FAILED_${response.status}_${body}`);
  }

  return response.json();
}

async function sendWithSmtpPlaceholder(input: SendEmailInput) {
  console.info("SMTP provider configured. Install a SMTP client implementation before production SMTP use.", {
    to: input.to,
    subject: input.subject,
  });
  return { queued: true, provider: "smtp-placeholder" };
}

export async function sendEmail(input: SendEmailInput) {
  const env = loadServiceEnv();

  if (env.EMAIL_PROVIDER === "disabled") {
    console.info("Email disabled, message not sent", { to: input.to, subject: input.subject });
    return { skipped: true, provider: "disabled" };
  }

  if (env.EMAIL_PROVIDER === "resend") {
    return sendWithResend(input, env);
  }

  return sendWithSmtpPlaceholder(input);
}

export function passwordResetEmail(input: { resetUrl: string; fullName: string }) {
  return {
    subject: "Réinitialisation de votre accès Investbourse",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
        <h1>Réinitialisation de votre accès</h1>
        <p>Bonjour ${input.fullName},</p>
        <p>Une demande de réinitialisation de mot de passe a été effectuée pour votre compte Investbourse.</p>
        <p>Ce lien est temporaire et doit être utilisé rapidement :</p>
        <p><a href="${input.resetUrl}" style="display:inline-block;background:#020617;color:#fff;padding:12px 18px;border-radius:999px;text-decoration:none">Définir un nouveau mot de passe</a></p>
        <p>Si vous n’êtes pas à l’origine de cette demande, ignorez cet email.</p>
      </div>
    `,
  };
}

export function adminNotificationEmail(input: { title: string; body: string; url?: string }) {
  return {
    subject: input.title,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
        <h1>${input.title}</h1>
        <p>${input.body}</p>
        ${input.url ? `<p><a href="${input.url}" style="display:inline-block;background:#020617;color:#fff;padding:12px 18px;border-radius:999px;text-decoration:none">Ouvrir dans le cockpit</a></p>` : ""}
      </div>
    `,
  };
}
