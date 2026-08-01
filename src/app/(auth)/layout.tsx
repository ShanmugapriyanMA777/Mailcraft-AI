import Link from "next/link";
import { Mail } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <div className="flex-1 grid lg:grid-cols-2">
        <div className="flex flex-col p-6 sm:p-10">
          <Link href="/" className="flex items-center gap-2.5 w-fit">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-500/30">
              <Mail className="h-4 w-4" />
            </div>
            <span className="text-base font-semibold tracking-tight text-ink-900 dark:text-ink-50">
              MailCraft AI
            </span>
          </Link>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-sm">{children}</div>
          </div>
          <p className="text-center text-xs text-ink-500 dark:text-ink-400 mt-6">
            © {new Date().getFullYear()} MailCraft AI
          </p>
        </div>
        <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-brand-500 to-brand-700 p-12">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3), transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.2), transparent 50%)",
            }}
          />
          <div className="relative z-10 m-auto max-w-md text-white">
            <h2 className="text-4xl font-semibold tracking-tight leading-tight">
              Write better emails, faster than ever.
            </h2>
            <p className="mt-4 text-brand-100 text-lg">
              Join thousands of professionals using MailCraft AI to draft polished emails in
              seconds.
            </p>
            <div className="mt-10 space-y-3">
              {[
                "10+ email tools in one place",
                "Done by Team Priyan",
                "9 languages supported",
                "Free to get started",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2 text-brand-50">
                  <div className="grid h-5 w-5 place-items-center rounded-full bg-white/20">
                    <svg viewBox="0 0 24 24" className="h-3 w-3 fill-white">
                      <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  </div>
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
