import type { Email } from '../types/heraldry';

/** Les 7 émaux de l'héraldique française */
export const EMAUX: Email[] = [
  {
    id: 'or',
    nom: 'Or',
    hex: '#FFD700',
    type: 'metal',
    hachures: 'points',
  },
  {
    id: 'argent',
    nom: 'Argent',
    hex: '#F5F5F5',
    type: 'metal',
    hachures: 'aucune',
  },
  {
    id: 'gueules',
    nom: 'Gueules',
    hex: '#E21313',
    type: 'couleur',
    hachures: 'vertical',
  },
  {
    id: 'azur',
    nom: 'Azur',
    hex: '#0055A4',
    type: 'couleur',
    hachures: 'horizontal',
  },
  {
    id: 'sinople',
    nom: 'Sinople',
    hex: '#1B8C2F',
    type: 'couleur',
    hachures: 'diagonale-gauche',
  },
  {
    id: 'sable',
    nom: 'Sable',
    hex: '#2C2C2C',
    type: 'couleur',
    hachures: 'croise',
  },
  {
    id: 'pourpre',
    nom: 'Pourpre',
    hex: '#9B30FF',
    type: 'couleur',
    hachures: 'diagonale-droite',
  },
];

export function getEmail(id: string): Email | undefined {
  return EMAUX.find((e) => e.id === id);
}

export function getHexEmail(id: string): string {
  return getEmail(id)?.hex ?? '#CCCCCC';
}

/** Vérifie la règle des émaux : pas métal sur métal ni couleur sur couleur */
export function regleDesEmaux(email1: string, email2: string): boolean {
  const e1 = getEmail(email1);
  const e2 = getEmail(email2);
  if (!e1 || !e2) return false;
  return e1.type !== e2.type;
}
