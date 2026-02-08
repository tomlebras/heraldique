import { useState, useRef } from 'react';
import type { HeraldryTerm } from '../../data/glossary';

interface Props {
  term: HeraldryTerm;
  children: React.ReactNode;
}

/** Mot avec tooltip instantané au hover montrant la définition héraldique */
export default function HeraldryTooltip({ term, children }: Props) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  return (
    <span
      ref={ref}
      className="heraldry-term"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span className="heraldry-tooltip">
          <strong>{term.term}</strong>
          <span>{term.definition}</span>
        </span>
      )}
    </span>
  );
}
