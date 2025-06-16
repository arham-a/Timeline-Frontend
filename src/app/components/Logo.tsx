import Link from 'next/link';

interface LogoProps {
  variant?: 'default' | 'light';
}

export function Logo({ variant = 'default' }: LogoProps) {
  const textColor = variant === 'light' ? 'text-black' : 'text-[var(--color-text-primary)]';

  return (
    <Link href="/" className="flex items-center gap-2 select-none">
      <div className="relative w-10 h-10">
        {/* Remove background layers and use transparent container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-6 h-6 md:w-7 md:h-7 text-[var(--color-primary)]"
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
