import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* ─── Heading ────────────────────────────────────────────────────── */

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type HeadingSize = 'display-xl' | 'display-lg' | 'display-md' | 'heading-lg' | 'heading-md' | 'heading-sm';

interface HeadingProps {
  as?: HeadingLevel;
  size?: HeadingSize;
  children: ReactNode;
  className?: string;
  id?: string;
}

const headingSizes: Record<HeadingSize, string> = {
  'display-xl': 'text-display-xl font-display',
  'display-lg': 'text-display-lg font-display',
  'display-md': 'text-display-md font-display',
  'heading-lg': 'text-heading-lg font-display',
  'heading-md': 'text-heading-md font-display',
  'heading-sm': 'text-heading-sm font-display',
};

export function Heading({
  as: Tag = 'h2',
  size = 'heading-lg',
  children,
  className,
  id,
}: HeadingProps) {
  return (
    <Tag
      id={id}
      className={cn(headingSizes[size], className)}
    >
      {children}
    </Tag>
  );
}

/* ─── Text ───────────────────────────────────────────────────────── */

type TextSize = 'body-lg' | 'body-md' | 'body-sm' | 'caption' | 'mono-xs';
type TextTag = 'p' | 'span' | 'div' | 'label' | 'li' | 'figcaption' | 'blockquote';

interface TextProps {
  as?: TextTag;
  size?: TextSize;
  children: ReactNode;
  className?: string;
  muted?: boolean;
}

const textSizes: Record<TextSize, string> = {
  'body-lg': 'text-body-lg',
  'body-md': 'text-body-md',
  'body-sm': 'text-body-sm',
  'caption': 'text-caption',
  'mono-xs': 'text-mono-xs font-mono uppercase tracking-widest',
};

export function Text({
  as: Tag = 'p',
  size = 'body-md',
  children,
  className,
  muted = false,
}: TextProps) {
  return (
    <Tag
      className={cn(
        textSizes[size],
        muted && 'text-muted',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

