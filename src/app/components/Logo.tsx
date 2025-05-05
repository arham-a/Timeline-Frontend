import Link from 'next/link';

interface LogoProps {
  variant?: 'default' | 'light';
}

export function Logo({ variant = 'default' }: LogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-[var(--color-text-primary)]';
  
  return (
    <Link href="/" className="flex items-center gap-2 select-none">
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-lg transform rotate-3 transition-transform group-hover:rotate-6" />
        <div className="absolute inset-0 bg-white rounded-lg shadow-sm flex items-center justify-center">
          <svg
            className="w-5 h-5 text-[var(--color-primary)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
      <div className={`flex flex-col ${textColor}`}>
        <span className="text-lg font-bold leading-none">Timeline</span>
        <span className="text-xs opacity-75">Learning Path</span>
      </div>
    </Link>
  );
} 