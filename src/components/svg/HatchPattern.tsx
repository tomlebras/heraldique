import type { Email } from '../../types/heraldry';

/** Patterns de hachures héraldiques pour le noir et blanc */
export default function HatchPattern({ email }: { email: Email }) {
  const id = `hachure-${email.id}`;
  const stroke = '#1a1a1a';
  const sw = 1.5;
  const size = 10;

  switch (email.hachures) {
    case 'points':
      // Or : semé de points
      return (
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <rect width={size} height={size} fill="white" />
          <circle cx={size / 2} cy={size / 2} r={1.5} fill={stroke} />
        </pattern>
      );

    case 'horizontal':
      // Azur : lignes horizontales
      return (
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <rect width={size} height={size} fill="white" />
          <line x1={0} y1={size / 2} x2={size} y2={size / 2} stroke={stroke} strokeWidth={sw} />
        </pattern>
      );

    case 'vertical':
      // Gueules : lignes verticales
      return (
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <rect width={size} height={size} fill="white" />
          <line x1={size / 2} y1={0} x2={size / 2} y2={size} stroke={stroke} strokeWidth={sw} />
        </pattern>
      );

    case 'diagonale-gauche':
      // Sinople : diagonale haut-gauche vers bas-droite
      return (
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <rect width={size} height={size} fill="white" />
          <line x1={0} y1={0} x2={size} y2={size} stroke={stroke} strokeWidth={sw} />
        </pattern>
      );

    case 'diagonale-droite':
      // Pourpre : diagonale haut-droite vers bas-gauche
      return (
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <rect width={size} height={size} fill="white" />
          <line x1={size} y1={0} x2={0} y2={size} stroke={stroke} strokeWidth={sw} />
        </pattern>
      );

    case 'croise':
      // Sable : lignes croisées
      return (
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <rect width={size} height={size} fill="white" />
          <line x1={0} y1={size / 2} x2={size} y2={size / 2} stroke={stroke} strokeWidth={sw} />
          <line x1={size / 2} y1={0} x2={size / 2} y2={size} stroke={stroke} strokeWidth={sw} />
        </pattern>
      );

    case 'aucune':
    default:
      // Argent : blanc uni
      return (
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <rect width={size} height={size} fill="white" />
        </pattern>
      );
  }
}

export function getHatchPatternId(emailId: string): string {
  return `hachure-${emailId}`;
}
