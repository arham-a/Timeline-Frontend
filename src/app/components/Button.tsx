import { ButtonHTMLAttributes, ElementType, ReactNode, MouseEvent } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] focus:ring-[var(--color-primary)]',
        secondary: 'bg-[var(--color-primary-light)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light-hover)] focus:ring-[var(--color-primary-light)]',
        outline: 'border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] focus:ring-[var(--color-primary)]',
        ghost: 'text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] focus:ring-[var(--color-primary)]',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
      },
      size: {
        sm: 'text-sm px-3 py-1.5',
        md: 'text-base px-4 py-2',
        lg: 'text-lg px-6 py-3',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

type ButtonBaseProps = {
  children: ReactNode;
  loading?: boolean;
  icon?: ReactNode;
  as?: ElementType;
  href?: string;
  className?: string;
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
};

export type ButtonProps = ButtonBaseProps & VariantProps<typeof buttonVariants>;

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  loading,
  icon,
  disabled,
  as: Component = 'button',
  ...props
}: ButtonProps) {
  const Comp = Component;
  return (
    <Comp
      className={buttonVariants({ variant, size, fullWidth, className })}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </Comp>
  );
} 