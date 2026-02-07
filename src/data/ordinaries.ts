import type { Piece } from '../types/heraldry';

/** Pièces honorables de l'héraldique française */
export const PIECES: Piece[] = [
  { id: 'fasce', nom: 'Fasce', description: 'Bande horizontale au centre de l\'écu, occupant un tiers de sa hauteur.' },
  { id: 'pal', nom: 'Pal', description: 'Bande verticale au centre de l\'écu, occupant un tiers de sa largeur.' },
  { id: 'bande', nom: 'Bande', description: 'Bande diagonale allant du canton dextre du chef au canton senestre de la pointe.' },
  { id: 'barre', nom: 'Barre', description: 'Bande diagonale allant du canton senestre du chef au canton dextre de la pointe.' },
  { id: 'chevron', nom: 'Chevron', description: 'Pièce en forme de V inversé, partant des flancs pour se rejoindre en pointe vers le chef.' },
  { id: 'croix', nom: 'Croix', description: 'Formée par la réunion de la fasce et du pal.' },
  { id: 'sautoir', nom: 'Sautoir', description: 'Croix en forme de X, formée par la réunion de la bande et de la barre.' },
  { id: 'chef', nom: 'Chef', description: 'Bande horizontale occupant le tiers supérieur de l\'écu.' },
  { id: 'champagne', nom: 'Champagne', description: 'Bande horizontale occupant le tiers inférieur de l\'écu.' },
  { id: 'bordure', nom: 'Bordure', description: 'Pièce qui entoure l\'écu sur tout son pourtour.' },
];

/**
 * Retourne le SVG path d'une pièce honorable.
 * Écu 600×720.
 */
export function getPiecePath(id: string): string {
  const W = 600;
  const H = 720;
  const MID_X = W / 2;
  const MID_Y = H / 2;
  const TIERS = H / 3;
  const TIERS_W = W / 3;
  const EPAISSEUR = 80; // épaisseur des pièces diagonales/chevron

  switch (id) {
    case 'fasce':
      return `M 0,${MID_Y - TIERS / 2} L ${W},${MID_Y - TIERS / 2} L ${W},${MID_Y + TIERS / 2} L 0,${MID_Y + TIERS / 2} Z`;

    case 'pal':
      return `M ${MID_X - TIERS_W / 2},0 L ${MID_X + TIERS_W / 2},0 L ${MID_X + TIERS_W / 2},${H} L ${MID_X - TIERS_W / 2},${H} Z`;

    case 'bande':
      return `M 0,${EPAISSEUR} L 0,0 L ${EPAISSEUR},0 L ${W},${H - EPAISSEUR} L ${W},${H} L ${W - EPAISSEUR},${H} Z`;

    case 'barre':
      return `M ${W - EPAISSEUR},0 L ${W},0 L ${W},${EPAISSEUR} L ${EPAISSEUR},${H} L 0,${H} L 0,${H - EPAISSEUR} Z`;

    case 'chevron':
      return `M 0,${MID_Y + 40} L ${MID_X},${MID_Y - 160} L ${W},${MID_Y + 40} L ${W},${MID_Y + 40 + EPAISSEUR} L ${MID_X},${MID_Y - 160 + EPAISSEUR} L 0,${MID_Y + 40 + EPAISSEUR} Z`;

    case 'croix':
      return `M ${MID_X - TIERS_W / 2},0 L ${MID_X + TIERS_W / 2},0 L ${MID_X + TIERS_W / 2},${MID_Y - TIERS / 2} L ${W},${MID_Y - TIERS / 2} L ${W},${MID_Y + TIERS / 2} L ${MID_X + TIERS_W / 2},${MID_Y + TIERS / 2} L ${MID_X + TIERS_W / 2},${H} L ${MID_X - TIERS_W / 2},${H} L ${MID_X - TIERS_W / 2},${MID_Y + TIERS / 2} L 0,${MID_Y + TIERS / 2} L 0,${MID_Y - TIERS / 2} L ${MID_X - TIERS_W / 2},${MID_Y - TIERS / 2} Z`;

    case 'sautoir':
      return `M ${MID_X},${MID_Y - 80} L ${W - 40},0 L ${W},0 L ${W},40 L ${MID_X + 80},${MID_Y} L ${W},${H - 40} L ${W},${H} L ${W - 40},${H} L ${MID_X},${MID_Y + 80} L 40,${H} L 0,${H} L 0,${H - 40} L ${MID_X - 80},${MID_Y} L 0,40 L 0,0 L 40,0 Z`;

    case 'chef':
      return `M 0,0 L ${W},0 L ${W},${TIERS} L 0,${TIERS} Z`;

    case 'champagne':
      return `M 0,${TIERS * 2} L ${W},${TIERS * 2} L ${W},${H} L 0,${H} Z`;

    case 'bordure': {
      const B = 40;
      const innerH = H * 0.72;
      return `M 0,0 L ${W},0 L ${W},${innerH} Q ${W},${H * 0.88} ${MID_X},${H} Q 0,${H * 0.88} 0,${innerH} Z ` +
        `M ${B},${B} L ${B},${innerH - 10} Q ${B},${H * 0.85} ${MID_X},${H - B * 1.5} Q ${W - B},${H * 0.85} ${W - B},${innerH - 10} L ${W - B},${B} Z`;
    }

    default:
      return '';
  }
}

export function getPiece(id: string): Piece | undefined {
  return PIECES.find((p) => p.id === id);
}
