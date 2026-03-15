// src/components/common/Tooltip.tsx
import type { ReactNode } from 'react';

interface Props {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, position = 'top' }: Props) {
  return (
    <div className={`tooltip tooltip-${position}`}>
      {children}
      <span className="tooltip-content">{content}</span>
    </div>
  );
}