import { useDraggable } from '@dnd-kit/core';
import type { ReactNode } from 'react';

interface Props {
  id: string;
  children: ReactNode;
}

export default function DraggableItem({ id, children }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

  const style: React.CSSProperties = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    touchAction: 'none',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}
