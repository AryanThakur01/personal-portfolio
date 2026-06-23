import { cn } from '../../utils';

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  className?: string;
  children?: React.ReactNode;
};

export function SectionHeader({
  eyebrow,
  title,
  className,
  children,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:justify-between sm:items-end gap-8 mb-10',
        className,
      )}>
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="font-mono font-medium text-[26px] tracking-[-0.01em] mt-3 mb-0 text-text">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}
