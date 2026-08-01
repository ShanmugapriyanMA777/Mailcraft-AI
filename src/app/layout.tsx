import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "MailCraft AI — AI Email Writer",
  description:
    "Generate professional emails in seconds with OpenRouter AI. Smart replies, grammar checks, translations, and more.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${outfit.variable} min-h-screen antialiased bg-galaxy`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              richColors
              theme="dark"
              toastOptions={{
                style: {
                  background: "rgb(13 13 28)",
                  border: "1px solid rgb(45 45 63)",
                  color: "white",
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
