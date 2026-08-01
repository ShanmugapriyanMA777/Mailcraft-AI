import OpenAI from "openai";

const API_KEY = process.env.OPENROUTER_API_KEY;

if (!API_KEY) {
  console.warn("OPENROUTER_API_KEY not set - AI features will use a fallback");
}

const openai = API_KEY ? new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: API_KEY,
}) : null;

export const SYSTEM_PROMPT = `You are an expert business communication assistant. Generate clear, grammatically correct, concise, and professional emails based on the user's input. Always include a relevant subject line, greeting, body, closing, and signature. Follow the requested tone, length, and language.`;

export type Tone =
  | "Professional"
  | "Friendly"
  | "Formal"
  | "Casual"
  | "Polite"
  | "Persuasive"
  | "Apologetic"
  | "Thank You"
  | "Follow-up"
  | "Appreciation";

export const TONES: Tone[] = [
  "Professional",
  "Friendly",
  "Formal",
  "Casual",
  "Polite",
  "Persuasive",
  "Apologetic",
  "Thank You",
  "Follow-up",
  "Appreciation",
];

export type Length = "Short" | "Medium" | "Long";
export const LENGTHS: Length[] = ["Short", "Medium", "Long"];

export type Language =
  | "English"
  | "Tamil"
  | "Hindi"
  | "French"
  | "German"
  | "Spanish"
  | "Arabic"
  | "Japanese"
  | "Chinese";

export const LANGUAGES: Language[] = [
  "English",
  "Tamil",
  "Hindi",
  "French",
  "German",
  "Spanish",
  "Arabic",
  "Japanese",
  "Chinese",
];

export type EmailResult = {
  subject: string;
  greeting: string;
  body: string;
  closing: string;
  signature: string;
  full: string;
};

function parseEmail(text: string, fallbackSubject: string): EmailResult {
  const lines = text.split("\n");
  let subject = fallbackSubject;
  let bodyText = text;
  const subjectMatch = text.match(/^Subject:\s*(.+)$/im);
  if (subjectMatch) {
    subject = subjectMatch[1].trim();
    bodyText = text.replace(/^Subject:\s*.+\n*/im, "").trim();
  }
  const lines2 = bodyText.split("\n").filter((l) => l.trim());
  const greeting = lines2[0] || "Hello,";
  const signature = lines2[lines2.length - 1] || "Best regards,";
  const closingIndex = lines2.findIndex(
    (l) => /best regards|sincerely|kind regards|warm regards|regards|thank you|thanks|cheers|yours/i.test(
      l.trim()
    )
  );
  const closing = closingIndex >= 0 ? lines2[closingIndex] : "Best regards,";
  const bodyLines =
    closingIndex > 0
      ? lines2.slice(1, closingIndex)
      : lines2.slice(1, lines2.length - 1);
  const body = bodyLines.join("\n\n") || bodyText;
  const full = `${subject}\n\n${greeting}\n\n${body}\n\n${closing}\n\n${signature}`;
  return { subject, greeting, body, closing, signature, full };
}

async function callAI(prompt: string): Promise<string> {
  if (!openai) {
    throw new Error(
      "AI service is not configured. Please set the OPENROUTER_API_KEY environment variable."
    );
  }
  const response = await openai.chat.completions.create({
    model: "google/gemini-2.5-flash",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt }
    ],
  });
  return response.choices[0]?.message?.content || "";
}

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
export function checkRateLimit(identifier: string, maxPerHour = 60): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (entry.count >= maxPerHour) return false;
  entry.count++;
  return true;
}

export async function generateEmail(params: {
  recipientName?: string;
  recipientRole?: string;
  topic: string;
  purpose?: string;
  keywords?: string;
  tone: string;
  length: string;
  language: string;
}): Promise<EmailResult> {
  const wordGuidance: Record<string, string> = {
    Short: "60-120 words",
    Medium: "150-250 words",
    Long: "300-450 words",
  };
  const prompt = `Generate an email with the following requirements:
- Recipient Name: ${params.recipientName || "Not specified"}
- Recipient Role: ${params.recipientRole || "Not specified"}
- Topic: ${params.topic}
- Purpose: ${params.purpose || "Not specified"}
- Keywords to include: ${params.keywords || "None"}
- Tone: ${params.tone}
- Length: ${params.length} (${wordGuidance[params.length] || ""})
- Language: ${params.language}

Format the response starting with "Subject:" on the first line, then the email body.`;

  const text = await callAI(prompt);
  return parseEmail(text, `Re: ${params.topic}`);
}

export async function checkGrammar(email: string): Promise<string> {
  const prompt = `Correct the grammar, improve vocabulary and sentence structure of the following email while preserving its original meaning. Return ONLY the corrected email text, no explanations or labels.

Email:
"""
${email}
"""`;
  return callAI(prompt);
}

export async function rewriteEmail(
  email: string,
  style: string
): Promise<string> {
  const prompt = `Rewrite the following email to be ${style}. Preserve the core message but adjust the tone, structure, and word choice. Return ONLY the rewritten email, no explanations or labels.

Email:
"""
${email}
"""`;
  return callAI(prompt);
}

export async function translateEmail(
  email: string,
  language: string
): Promise<string> {
  const prompt = `Translate the following email to ${language}. Maintain the original formatting (line breaks, paragraph structure, and any salutations/signatures). Return ONLY the translated email, no explanations or labels.

Email:
"""
${email}
"""`;
  return callAI(prompt);
}

export async function generateSubjects(topic: string): Promise<string[]> {
  const prompt = `Generate 10 suitable, compelling email subject lines for an email about: "${topic}". 
Return ONLY a numbered list (1-10), one subject per line. Do not include any other text.`;
  const text = await callAI(prompt);
  return text
    .split("\n")
    .map((l) => l.replace(/^\d+[.)]\s*/, "").trim())
    .filter((l) => l.length > 0)
    .slice(0, 10);
}

export async function smartReply(
  email: string,
  replyType: "Short" | "Professional" | "Friendly" | "Decline" | "Accept"
): Promise<string> {
  const prompt = `Generate a ${replyType} reply to the following incoming email. Return ONLY the reply email, no explanations.

Incoming email:
"""
${email}
"""`;
  return callAI(prompt);
}
