import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-[var(--color-border)] pt-[5rem]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <svg className="h-8 w-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-xl font-bold text-[var(--color-text-primary)]">Timeline</span>
            </Link>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Create, share, and explore learning timelines. Your journey to knowledge starts here.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/explore" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                  Explore Timelines
                </Link>
              </li>
              <li>
                <Link href="/auth" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/user" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors">
                  My Timelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Creators Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wider">
              Created By
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center">
                  <span className="text-[var(--color-primary)] font-semibold">SR</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">Shareeq Rashid</p>
                  <p className="text-xs text-[var(--color-text-tertiary)]">Full Stack Developer</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center">
                  <span className="text-[var(--color-primary)] font-semibold">AA</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">Arham Alvi</p>
                  <p className="text-xs text-[var(--color-text-tertiary)]">Full Stack Developer</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center">
                  <span className="text-[var(--color-primary)] font-semibold">FA</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">Faiq Afaq</p>
                  <p className="text-xs text-[var(--color-text-tertiary)]">Developer</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[var(--color-text-tertiary)]">
              © {new Date().getFullYear()} Timeline. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-primary)] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-primary)] transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 