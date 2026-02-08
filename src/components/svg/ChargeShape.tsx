import type { MeublePose } from '../../types/heraldry';
import { getMeublePath, getPositionPixels } from '../../data/charges';
import { getHexEmail } from '../../data/tinctures';

/** Meubles disponibles en SVG externe (dans /charges/) */
const SVG_CHARGES = new Set([
  'lion', 'lionceau', 'leopard', 'aigle', 'fleur-de-lys', 'croissant',
  'tour', 'epee', 'arbre', 'cerf', 'coquille',
]);

/** Meubles qui réutilisent le SVG d'un autre meuble */
const SVG_ALIAS: Record<string, string> = {
  'lionceau': 'lion',
};

/** Taille personnalisée pour certains meubles */
const CHARGE_SIZE: Record<string, number> = {
  'lionceau': 170,
};

interface Props {
  meuble: MeublePose;
}

/** Affiche un meuble posé sur l'écu */
export default function ChargeShape({ meuble }: Props) {
  const pos = getPositionPixels(meuble.position);
  const size = 240;

  if (SVG_CHARGES.has(meuble.meuble)) {
    const svgFile = SVG_ALIAS[meuble.meuble] ?? meuble.meuble;
    const chargeSize = CHARGE_SIZE[meuble.meuble] ?? size;
    return (
      <image
        href={`${import.meta.env.BASE_URL}charges/${svgFile}.svg`}
        x={pos.x - chargeSize / 2}
        y={pos.y - chargeSize / 2}
        width={chargeSize}
        height={chargeSize}
        preserveAspectRatio="xMidYMid meet"
      />
    );
  }

  // Fallback : inline path (cerf et autres non téléchargés)
  const path = getMeublePath(meuble.meuble);
  if (!path) return null;

  return (
    <g transform={`translate(${pos.x}, ${pos.y}) scale(1.2)`}>
      <path
        d={path}
        fill={getHexEmail(meuble.email)}
        stroke="#1a1a1a"
        strokeWidth="1"
      />
    </g>
  );
}
