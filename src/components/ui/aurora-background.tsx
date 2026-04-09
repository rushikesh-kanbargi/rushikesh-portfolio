import { cn } from '@/lib/utils';

type AuroraBackgroundProps = {
  className?: string;
  /** Lower intensity for busy sections */
  subtle?: boolean;
};

/** Soft drifting color blobs — common on [21st.dev](https://21st.dev/community/components)-style hero & CTA layouts */
export function AuroraBackground({ className, subtle }: AuroraBackgroundProps) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden
    >
      <div
        className={cn('aurora-layer', subtle && 'aurora-layer--subtle')}
      />
    </div>
  );
}
