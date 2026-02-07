import { useDroppable } from '@dnd-kit/core';
import type { ReactNode } from 'react';

interface Props {
  id: string;
  children: ReactNode;
}

export default function DroppableZone({ id, children }: Props) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`droppable-zone ${isOver ? 'droppable-over' : ''}`}
    >
      {children}
    </div>
  );
}
