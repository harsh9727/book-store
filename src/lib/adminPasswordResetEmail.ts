const EMAILJS_SEND_URL = "https://api.emailjs.com/api/v1.0/email/send";
const EMAIL_TIMEOUT_MS = 10_000;

interface PasswordResetEmailConfiguration {
  serviceId: string;
  templateId: string;
  publicKey: string;
  privateKey: string;
}

function passwordResetEmailConfiguration(): PasswordResetEmailConfiguration {
  return {
    serviceId:
      process.env.EMAILJS_SERVICE_ID?.trim() ||
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID?.trim() ||
      "",
    templateId: process.env.EMAILJS_PASSWORD_RESET_TEMPLATE_ID?.trim() || "",
    publicKey:
      process.env.EMAILJS_PUBLIC_KEY?.trim() ||
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY?.trim() ||
      "",
    privateKey: process.env.EMAILJS_PRIVATE_KEY?.trim() || "",
  };
}

export function getPasswordResetEmailConfigurationIssues() {
  const configuration = passwordResetEmailConfiguration();
  const issues: string[] = [];

  if (!configuration.serviceId) {
    issues.push("EMAILJS_SERVICE_ID is required.");
  }
  if (!configuration.templateId) {
    issues.push("EMAILJS_PASSWORD_RESET_TEMPLATE_ID is required.");
  }
  if (!configuration.publicKey) {
    issues.push("EMAILJS_PUBLIC_KEY is required.");
  }
  if (!configuration.privateKey) {
    issues.push("EMAILJS_PRIVATE_KEY is required.");
  }

  return issues;
}

export async function sendAdminPasswordResetCode(
  toEmail: string,
  code: string,
) {
  const configuration = passwordResetEmailConfiguration();
  if (getPasswordResetEmailConfigurationIssues().length) {
    throw new Error("Password reset email is not configured.");
  }

  const response = await fetch(EMAILJS_SEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: configuration.serviceId,
      template_id: configuration.templateId,
      user_id: configuration.publicKey,
      accessToken: configuration.privateKey,
      template_params: {
        to_email: toEmail,
        otp_code: code,
        expires_minutes: "10",
        application_name: "GTBS Admin",
      },
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(EMAIL_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error("Password reset email delivery failed.");
  }
}
