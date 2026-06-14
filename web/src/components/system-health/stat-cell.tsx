import { Label, Value, Sub, Skeleton } from './primitives';

interface StatCellProps {
  label: string;
  value: React.ReactNode;
  unit?: string;
  sub?: React.ReactNode;
  accentSub?: boolean;
  loading?: boolean;
  className?: string;
}

export function StatCell({
  label,
  value,
  unit,
  sub,
  accentSub,
  loading = false,
  className,
}: StatCellProps) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      {loading ? (
        <div className="flex flex-col gap-2 mt-1">
          <Skeleton w="w-16" h="h-[18px]" />
          <Skeleton w="w-32" />
        </div>
      ) : (
        <>
          <Value unit={unit}>{value}</Value>
          {sub && <Sub accent={accentSub}>{sub}</Sub>}
        </>
      )}
    </div>
  );
}
