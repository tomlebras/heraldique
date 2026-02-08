import type { Meuble } from '../types/heraldry';

/** Meubles héraldiques français */
export const MEUBLES: Meuble[] = [
  { id: 'lion', nom: 'Lion', description: 'Rampant (dressé, de profil). Symbole de courage et de force.' },
  { id: 'lionceau', nom: 'Lionceau', description: 'Lion de taille réduite. Utilisé quand l\'écu en porte plusieurs.' },
  { id: 'leopard', nom: 'Léopard', description: 'Lion passant (marchant), la tête de face. C\'est un lion dans une autre posture.' },
  { id: 'aigle', nom: 'Aigle', description: 'Représentée éployée (ailes étendues), symbole de puissance et de majesté.' },
  { id: 'fleur-de-lys', nom: 'Fleur de lys', description: 'Symbole royal français par excellence, représentant la pureté et la royauté.' },
  { id: 'etoile', nom: 'Étoile', description: 'Étoile à cinq rais (pointes), symbole de noblesse et de grandeur.' },
  { id: 'croissant', nom: 'Croissant', description: 'Croissant de lune, pointes tournées vers le chef.' },
  { id: 'tour', nom: 'Tour', description: 'Tour crénelée, symbole de protection et de défense.' },
  { id: 'epee', nom: 'Épée', description: 'Épée haute, symbole de justice et de vaillance.' },
  { id: 'arbre', nom: 'Arbre', description: 'Arbre arraché (avec ses racines visibles), symbole de vie et de résistance.' },
  { id: 'cerf', nom: 'Cerf', description: 'Cerf passant ou élancé, symbole de sagesse et de longévité.' },
  { id: 'coquille', nom: 'Coquille', description: 'Coquille Saint-Jacques, symbole de pèlerinage et de dévotion.' },
];

/**
 * Retourne le SVG path d'un meuble, centré sur (0,0), taille ~200×200.
 * Sera ensuite translaté/scalé selon la position sur l'écu.
 */
export function getMeublePath(id: string): string {
  switch (id) {
    case 'fleur-de-lys':
      return `M 0,-90 C -8,-70 -15,-50 -20,-30 C -35,-50 -60,-65 -70,-55 C -80,-45 -65,-20 -45,-5 C -55,0 -65,5 -60,20 C -55,35 -35,30 -25,20 L -20,45 L -30,50 C -35,55 -35,65 -25,70 L 0,75 L 25,70 C 35,65 35,55 30,50 L 20,45 L 25,20 C 35,30 55,35 60,20 C 65,5 55,0 45,-5 C 65,-20 80,-45 70,-55 C 60,-65 35,-50 20,-30 C 15,-50 8,-70 0,-90 Z`;

    case 'lion':
      // Lion rampant stylisé
      return `M -20,80 L -30,40 C -40,20 -50,0 -45,-20 C -40,-35 -30,-50 -20,-60 C -10,-70 0,-80 10,-85 C 20,-80 25,-70 20,-55 L 30,-45 C 35,-55 45,-60 50,-50 C 55,-40 45,-30 35,-25 L 25,-15 C 30,-5 35,10 30,25 L 40,15 C 50,5 60,10 55,25 L 45,35 L 50,50 C 55,60 50,70 40,75 L 25,80 L 15,60 L 5,80 Z M -5,-60 C -10,-55 -10,-50 -5,-50 C 0,-50 0,-55 -5,-60 Z`;

    case 'leopard':
      // Léopard (lion passant, tête de face) — fallback
      return `M -70,30 L -60,10 C -55,-5 -45,-15 -30,-20 L -25,-35 C -20,-45 -10,-50 0,-45 L 10,-50 C 15,-55 25,-50 20,-40 L 15,-30 C 25,-25 35,-15 40,-5 L 50,0 L 60,5 L 70,-5 C 75,-10 80,-5 75,0 L 65,10 L 55,15 L 60,25 L 55,35 L 45,30 L 35,35 L 30,50 L 20,50 L 25,35 L 15,30 L 5,35 L 0,50 L -10,50 L -5,35 L -15,30 L -30,35 L -35,50 L -45,50 L -40,35 L -50,30 L -60,35 L -65,50 L -75,50 L -70,30 Z`;

    case 'aigle':
      // Aigle éployée
      return `M 0,-70 C -5,-60 -10,-50 -8,-40 C -15,-45 -30,-55 -50,-65 C -60,-70 -75,-68 -80,-60 C -85,-52 -78,-45 -65,-42 C -55,-40 -40,-35 -25,-25 C -35,-20 -45,-10 -40,0 L -55,5 C -65,8 -70,15 -60,20 L -40,15 L -30,25 C -35,40 -40,55 -35,70 L -25,75 L -20,55 L -10,40 L 0,50 L 10,40 L 20,55 L 25,75 L 35,70 C 40,55 35,40 30,25 L 40,15 L 60,20 C 70,15 65,8 55,5 L 40,0 C 45,-10 35,-20 25,-25 C 40,-35 55,-40 65,-42 C 78,-45 85,-52 80,-60 C 75,-68 60,-70 50,-65 C 30,-55 15,-45 8,-40 C 10,-50 5,-60 0,-70 Z`;

    case 'etoile':
      // Étoile à 5 rais
      return createStarPath(5, 60, 25);

    case 'croissant':
      return `M -50,30 C -50,-20 -20,-55 25,-55 C 35,-55 45,-50 50,-40 C 30,-45 5,-35 -10,-10 C -25,15 -25,45 -15,60 C -35,55 -50,45 -50,30 Z`;

    case 'tour':
      return `M -40,60 L -40,-30 L -40,-40 L -30,-40 L -30,-30 L -20,-30 L -20,-40 L -10,-40 L -10,-30 L 0,-30 L 0,-40 L 10,-40 L 10,-30 L 20,-30 L 20,-40 L 30,-40 L 30,-30 L 40,-30 L 40,-40 L 40,-30 L 40,60 L 20,60 L 20,30 L 10,30 L 10,60 L -10,60 L -10,30 L -20,30 L -20,60 Z`;

    case 'epee':
      return `M -3,-80 L 3,-80 L 3,-10 L 25,-10 L 25,-3 L 3,-3 L 3,70 L 8,80 L -8,80 L -3,70 L -3,-3 L -25,-3 L -25,-10 L -3,-10 Z`;

    case 'arbre':
      return `M -5,80 L -5,20 C -30,15 -50,-5 -50,-30 C -50,-55 -30,-75 0,-80 C 30,-75 50,-55 50,-30 C 50,-5 30,15 5,20 L 5,80 Z`;

    case 'cerf':
      return `M -30,70 L -25,30 L -35,10 L -30,-10 L -25,-25 C -20,-35 -10,-45 0,-50 L -15,-65 L -25,-80 L -15,-75 L -5,-60 L 0,-70 L 5,-80 L 10,-70 L 5,-55 L 15,-45 C 20,-40 25,-30 25,-15 L 30,0 L 25,15 L 30,40 L 25,70 L 15,70 L 20,40 L 15,20 L 5,25 L -5,25 L -15,20 L -20,40 L -15,70 Z M 10,-30 C 8,-33 5,-33 5,-30 C 5,-27 8,-27 10,-30 Z`;

    case 'coquille':
      return `M 0,-60 C 30,-55 55,-30 55,10 C 55,40 35,60 0,65 C -35,60 -55,40 -55,10 C -55,-30 -30,-55 0,-60 Z M 0,-45 L -10,55 M 0,-45 L 10,55 M 0,-45 L -30,45 M 0,-45 L 30,45 M 0,-45 L -45,25 M 0,-45 L 45,25 M 0,-45 L -50,0 M 0,-45 L 50,0`;

    default:
      return '';
  }
}

function createStarPath(points: number, outerR: number, innerR: number): string {
  const parts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI / points) * i - Math.PI / 2;
    const x = Math.round(r * Math.cos(angle));
    const y = Math.round(r * Math.sin(angle));
    parts.push(`${i === 0 ? 'M' : 'L'} ${x},${y}`);
  }
  parts.push('Z');
  return parts.join(' ');
}

export function getMeuble(id: string): Meuble | undefined {
  return MEUBLES.find((m) => m.id === id);
}

/** Position en pixels sur l'écu 600×720 */
export function getPositionPixels(position: string): { x: number; y: number } {
  switch (position) {
    case 'en-coeur': return { x: 300, y: 330 };
    case 'en-chef': return { x: 300, y: 160 };
    case 'en-pointe': return { x: 300, y: 560 };
    case 'en-canton-dextre-du-chef': return { x: 150, y: 160 };
    case 'en-canton-senestre-du-chef': return { x: 450, y: 160 };
    default: return { x: 300, y: 330 };
  }
}
