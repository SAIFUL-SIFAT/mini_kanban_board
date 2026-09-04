import { cn } from '../../lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse border-2 border-[#18181B] bg-zinc-200 shadow-[3px_3px_0px_0px_#000]',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
