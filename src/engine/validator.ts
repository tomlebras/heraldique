import { getEmail } from '../data/tinctures';

/** Vérifie la règle des émaux : pas métal sur métal ni couleur sur couleur */
export function validerRegleDesEmaux(email1: string, email2: string): boolean {
  const e1 = getEmail(email1);
  const e2 = getEmail(email2);
  if (!e1 || !e2) return false;
  return e1.type !== e2.type;
}

/** Vérifie qu'un blason respecte la règle des émaux (champ vs pièce/meuble) */
export function validerBlason(emaux: string[], pieceEmail?: string, meublesEmaux?: string[]): string[] {
  const erreurs: string[] = [];
  const champPrincipal = emaux[0];

  if (pieceEmail && !validerRegleDesEmaux(champPrincipal, pieceEmail)) {
    erreurs.push(`La pièce ne peut pas être de ${pieceEmail} sur un champ de ${champPrincipal} (même catégorie d'émail).`);
  }

  if (meublesEmaux) {
    for (const mEmail of meublesEmaux) {
      if (!validerRegleDesEmaux(champPrincipal, mEmail)) {
        erreurs.push(`Un meuble ne peut pas être de ${mEmail} sur un champ de ${champPrincipal} (même catégorie d'émail).`);
      }
    }
  }

  return erreurs;
}
