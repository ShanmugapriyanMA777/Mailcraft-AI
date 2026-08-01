import Link from "next/link";
import { Mail, Send, Code2, Briefcase } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-ink-200/60 bg-white dark:border-ink-800/60 dark:bg-ink-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                <Mail className="h-4 w-4" />
              </div>
              <span className="text-base font-semibold text-ink-900 dark:text-ink-50">
                MailCraft AI
              </span>
            </Link>
            <p className="mt-3 text-sm text-ink-600 dark:text-ink-400 max-w-xs">
              AI-powered email writing that helps you craft perfect emails in seconds.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <a
                href="#"
                className="grid h-8 w-8 place-items-center rounded-lg text-ink-500 hover:bg-ink-100 hover:text-ink-900 dark:hover:bg-ink-800 dark:hover:text-ink-50"
              >
                <Send className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="grid h-8 w-8 place-items-center rounded-lg text-ink-500 hover:bg-ink-100 hover:text-ink-900 dark:hover:bg-ink-800 dark:hover:text-ink-50"
              >
                <Code2 className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="grid h-8 w-8 place-items-center rounded-lg text-ink-500 hover:bg-ink-100 hover:text-ink-900 dark:hover:bg-ink-800 dark:hover:text-ink-50"
              >
                <Briefcase className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50">Product</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/#features" className="text-ink-600 hover:text-brand-600 dark:text-ink-400 dark:hover:text-brand-400">Features</Link></li>
              <li><Link href="/#how-it-works" className="text-ink-600 hover:text-brand-600 dark:text-ink-400 dark:hover:text-brand-400">How it Works</Link></li>
              <li><Link href="/#testimonials" className="text-ink-600 hover:text-brand-600 dark:text-ink-400 dark:hover:text-brand-400">Testimonials</Link></li>
              <li><Link href="/#faq" className="text-ink-600 hover:text-brand-600 dark:text-ink-400 dark:hover:text-brand-400">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50">Account</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/login" className="text-ink-600 hover:text-brand-600 dark:text-ink-400 dark:hover:text-brand-400">Login</Link></li>
              <li><Link href="/register" className="text-ink-600 hover:text-brand-600 dark:text-ink-400 dark:hover:text-brand-400">Get Started</Link></li>
              <li><Link href="/dashboard" className="text-ink-600 hover:text-brand-600 dark:text-ink-400 dark:hover:text-brand-400">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink-900 dark:text-ink-50">Legal</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#" className="text-ink-600 hover:text-brand-600 dark:text-ink-400 dark:hover:text-brand-400">Privacy</a></li>
              <li><a href="#" className="text-ink-600 hover:text-brand-600 dark:text-ink-400 dark:hover:text-brand-400">Terms</a></li>
              <li><a href="#" className="text-ink-600 hover:text-brand-600 dark:text-ink-400 dark:hover:text-brand-400">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-ink-200 pt-6 dark:border-ink-800 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-ink-500 dark:text-ink-400">
            © {new Date().getFullYear()} MailCraft AI. All rights reserved.
          </p>
          <p className="text-xs text-ink-500 dark:text-ink-400">
            Done by Team Priyan
          </p>
        </div>
      </div>
    </footer>
  );
}
