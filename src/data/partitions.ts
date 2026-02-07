import type { Partition } from '../types/heraldry';

/** Partitions héraldiques françaises avec définitions de clip paths */
export const PARTITIONS: Partition[] = [
  {
    id: 'plein',
    nom: 'Plein',
    description: "L'écu est d'un seul émail, sans partition.",
    zones: 1,
  },
  {
    id: 'parti',
    nom: 'Parti',
    description: "L'écu est divisé verticalement en deux parties égales.",
    zones: 2,
  },
  {
    id: 'coupe',
    nom: 'Coupé',
    description: "L'écu est divisé horizontalement en deux parties égales.",
    zones: 2,
  },
  {
    id: 'tranche',
    nom: 'Tranché',
    description: "L'écu est divisé diagonalement du canton dextre du chef au canton senestre de la pointe.",
    zones: 2,
  },
  {
    id: 'taille',
    nom: 'Taillé',
    description: "L'écu est divisé diagonalement du canton senestre du chef au canton dextre de la pointe.",
    zones: 2,
  },
  {
    id: 'ecartele',
    nom: 'Écartelé',
    description: "L'écu est divisé en quatre quartiers par un trait vertical et un trait horizontal.",
    zones: 4,
  },
  {
    id: 'ecartele-en-sautoir',
    nom: 'Écartelé en sautoir',
    description: "L'écu est divisé en quatre quartiers par deux diagonales.",
    zones: 4,
  },
  {
    id: 'tierce-en-fasce',
    nom: 'Tiercé en fasce',
    description: "L'écu est divisé en trois bandes horizontales égales.",
    zones: 3,
  },
  {
    id: 'tierce-en-pal',
    nom: 'Tiercé en pal',
    description: "L'écu est divisé en trois bandes verticales égales.",
    zones: 3,
  },
];

export function getPartition(id: string): Partition | undefined {
  return PARTITIONS.find((p) => p.id === id);
}

/**
 * Retourne les clip paths SVG pour chaque zone d'une partition.
 * L'écu fait 600×720, forme française (pointe en bas).
 */
export function getClipPaths(id: string): string[] {
  const W = 600;
  const H = 720;
  const MID_X = W / 2;
  const MID_Y = H / 2;

  // Contour complet de l'écu français
  const ECU = `M 0,0 L ${W},0 L ${W},${H * 0.72} Q ${W},${H * 0.88} ${MID_X},${H} Q 0,${H * 0.88} 0,${H * 0.72} Z`;

  switch (id) {
    case 'plein':
      return [ECU];

    case 'parti':
      return [
        `M 0,0 L ${MID_X},0 L ${MID_X},${H} Q 0,${H * 0.88} 0,${H * 0.72} Z`,
        `M ${MID_X},0 L ${W},0 L ${W},${H * 0.72} Q ${W},${H * 0.88} ${MID_X},${H} Z`,
      ];

    case 'coupe':
      return [
        `M 0,0 L ${W},0 L ${W},${MID_Y} L 0,${MID_Y} Z`,
        `M 0,${MID_Y} L ${W},${MID_Y} L ${W},${H * 0.72} Q ${W},${H * 0.88} ${MID_X},${H} Q 0,${H * 0.88} 0,${H * 0.72} Z`,
      ];

    case 'tranche':
      return [
        `M 0,0 L ${W},0 L 0,${H * 0.72} Q 0,${H * 0.75} 0,${H * 0.72} Z`,
        `M ${W},0 L ${W},${H * 0.72} Q ${W},${H * 0.88} ${MID_X},${H} Q 0,${H * 0.88} 0,${H * 0.72} Z`,
      ];

    case 'taille':
      return [
        `M 0,0 L ${W},0 L ${W},${H * 0.72} Q ${W},${H * 0.75} ${W},${H * 0.72} Z`,
        `M 0,0 L 0,${H * 0.72} Q 0,${H * 0.88} ${MID_X},${H} Q ${W},${H * 0.88} ${W},${H * 0.72} Z`,
      ];

    case 'ecartele':
      return [
        `M 0,0 L ${MID_X},0 L ${MID_X},${MID_Y} L 0,${MID_Y} Z`,
        `M ${MID_X},0 L ${W},0 L ${W},${MID_Y} L ${MID_X},${MID_Y} Z`,
        `M 0,${MID_Y} L ${MID_X},${MID_Y} L ${MID_X},${H} Q 0,${H * 0.88} 0,${H * 0.72} Z`,
        `M ${MID_X},${MID_Y} L ${W},${MID_Y} L ${W},${H * 0.72} Q ${W},${H * 0.88} ${MID_X},${H} Z`,
      ];

    case 'ecartele-en-sautoir':
      return [
        // Chef (haut)
        `M 0,0 L ${W},0 L ${MID_X},${MID_Y} Z`,
        // Dextre (gauche)
        `M 0,0 L ${MID_X},${MID_Y} L 0,${H * 0.72} Q 0,${H * 0.82} 0,${H * 0.72} Z`,
        // Senestre (droite)
        `M ${W},0 L ${W},${H * 0.72} Q ${W},${H * 0.82} ${W},${H * 0.72} L ${MID_X},${MID_Y} Z`,
        // Pointe (bas)
        `M ${MID_X},${MID_Y} L ${W},${H * 0.72} Q ${W},${H * 0.88} ${MID_X},${H} Q 0,${H * 0.88} 0,${H * 0.72} Z`,
      ];

    case 'tierce-en-fasce': {
      const T = H / 3;
      return [
        `M 0,0 L ${W},0 L ${W},${T} L 0,${T} Z`,
        `M 0,${T} L ${W},${T} L ${W},${T * 2} L 0,${T * 2} Z`,
        `M 0,${T * 2} L ${W},${T * 2} L ${W},${H * 0.72} Q ${W},${H * 0.88} ${MID_X},${H} Q 0,${H * 0.88} 0,${H * 0.72} Z`,
      ];
    }

    case 'tierce-en-pal': {
      const T = W / 3;
      return [
        `M 0,0 L ${T},0 L ${T},${H} Q 0,${H * 0.88} 0,${H * 0.72} Z`,
        `M ${T},0 L ${T * 2},0 L ${T * 2},${H} L ${T},${H} Z`,
        `M ${T * 2},0 L ${W},0 L ${W},${H * 0.72} Q ${W},${H * 0.88} ${MID_X},${H} Q ${T * 2},${H * 0.95} ${T * 2},${H} Z`,
      ];
    }

    default:
      return [ECU];
  }
}
