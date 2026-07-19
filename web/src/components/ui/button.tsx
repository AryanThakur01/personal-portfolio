import { cn } from '../../utils';

export type ButtonVariant = 'primary' | 'secondary' | 'accent';
export type ButtonSize = 'sm' | 'md';

const BASE =
  'inline-flex items-center font-mono tracking-[0.02em] rounded-[4px] transition-all duration-150 no-underline cursor-pointer disabled:opacity-50 disabled:pointer-events-none';

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-[#001a1f] font-semibold hover:bg-[#22cce7] hover:-translate-y-px',
  secondary:
    'border border-border-hover text-text hover:border-accent-line hover:text-accent',
  accent:
    'text-accent border border-accent-line bg-accent-soft hover:bg-[rgba(6,182,212,0.2)] hover:border-accent',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'gap-2 px-3 py-[6px] text-[12px]',
  md: 'gap-[10px] px-[18px] py-[11px] text-[12px]',
};

export function buttonVariants({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonVariants({ variant, size, className })} {...props}>
      {children}
    </button>
  );
}
