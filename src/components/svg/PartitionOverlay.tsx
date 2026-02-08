import type { IdPartition } from '../../types/heraldry';
import { getClipPaths } from '../../data/partitions';
import { getHexEmail } from '../../data/tinctures';

/** Mouchetures d'hermine : motif répété sur fond argent */
function HerminePattern() {
  return (
    <defs>
      <pattern id="hermine-pattern" x="0" y="0" width="120" height="140" patternUnits="userSpaceOnUse">
        <rect width="120" height="140" fill="#F5F5F5" />
        {/* Moucheture centrée */}
        <g transform="translate(60, 50) scale(0.6)">
          <path d="M 0,-40 C -4,-25 -8,-10 -12,5 C -8,2 -4,0 0,5 C 4,0 8,2 12,5 C 8,-10 4,-25 0,-40 Z" fill="#2C2C2C" />
          <circle cx="-12" cy="12" r="4" fill="#2C2C2C" />
          <circle cx="12" cy="12" r="4" fill="#2C2C2C" />
          <circle cx="0" cy="16" r="4" fill="#2C2C2C" />
        </g>
        {/* Moucheture décalée */}
        <g transform="translate(0, 120) scale(0.6)">
          <path d="M 0,-40 C -4,-25 -8,-10 -12,5 C -8,2 -4,0 0,5 C 4,0 8,2 12,5 C 8,-10 4,-25 0,-40 Z" fill="#2C2C2C" />
          <circle cx="-12" cy="12" r="4" fill="#2C2C2C" />
          <circle cx="12" cy="12" r="4" fill="#2C2C2C" />
          <circle cx="0" cy="16" r="4" fill="#2C2C2C" />
        </g>
        <g transform="translate(120, 120) scale(0.6)">
          <path d="M 0,-40 C -4,-25 -8,-10 -12,5 C -8,2 -4,0 0,5 C 4,0 8,2 12,5 C 8,-10 4,-25 0,-40 Z" fill="#2C2C2C" />
          <circle cx="-12" cy="12" r="4" fill="#2C2C2C" />
          <circle cx="12" cy="12" r="4" fill="#2C2C2C" />
          <circle cx="0" cy="16" r="4" fill="#2C2C2C" />
        </g>
      </pattern>
    </defs>
  );
}

/** Retourne le fill pour un émail (couleur hex ou pattern) */
function getEmailFill(emailId: string): string {
  if (emailId === 'hermine') return 'url(#hermine-pattern)';
  return getHexEmail(emailId);
}

interface Props {
  partition: IdPartition;
  emaux: string[];
}

/** Affiche les zones colorées d'une partition */
export default function PartitionOverlay({ partition, emaux }: Props) {
  const clipPaths = getClipPaths(partition);
  const needsHermine = emaux.some((e) => e === 'hermine');

  return (
    <>
      {needsHermine && <HerminePattern />}
      {clipPaths.map((path, i) => {
        const emailId = emaux[i] || emaux[0] || 'argent';
        return (
          <path
            key={`partition-${partition}-${i}`}
            d={path}
            fill={getEmailFill(emailId)}
          />
        );
      })}
    </>
  );
}
