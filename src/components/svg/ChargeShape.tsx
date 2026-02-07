import type { MeublePose } from '../../types/heraldry';
import { getHexEmail } from '../../data/tinctures';
import { getMeublePath, getPositionPixels } from '../../data/charges';

interface Props {
  meuble: MeublePose;
}

/** Affiche un meuble posé sur l'écu */
export default function ChargeShape({ meuble }: Props) {
  const path = getMeublePath(meuble.meuble);
  if (!path) return null;

  const pos = getPositionPixels(meuble.position);
  const scale = 1.2;

  return (
    <g transform={`translate(${pos.x}, ${pos.y}) scale(${scale})`}>
      <path
        d={path}
        fill={getHexEmail(meuble.email)}
        stroke="#1a1a1a"
        strokeWidth="1"
      />
    </g>
  );
}
