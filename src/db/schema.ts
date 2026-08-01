export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatar: string | null;
  preferences: string | null;
  createdAt: string;
}

export interface NewUser extends Omit<User, "id" | "createdAt"> {}

export interface EmailHistory {
  id: string;
  userId: string;
  topic: string;
  subject: string;
  recipient: string | null;
  tone: string | null;
  language: string | null;
  length: string | null;
  generatedEmail: string;
  feature: string;
  createdAt: string;
}

export interface NewEmailHistory extends Omit<EmailHistory, "id" | "createdAt"> {}

export interface Template {
  id: number;
  category: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}
