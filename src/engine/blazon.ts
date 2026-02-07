import type { Blason } from '../types/heraldry';
import { getEmail } from '../data/tinctures';
import { getPartition } from '../data/partitions';
import { getPiece } from '../data/ordinaries';
import { getMeuble } from '../data/charges';

/** Génère le blasonnement en français d'un blason */
export function blasonner(blason: Blason): string {
  const parts: string[] = [];

  // 1. Champ
  const partition = getPartition(blason.partition);
  if (blason.partition === 'plein') {
    const email = getEmail(blason.emaux[0]);
    parts.push(`D'${apostropheEmail(email?.nom ?? '')}`);
  } else if (partition) {
    const nomsEmaux = blason.emaux.map((id) => getEmail(id)?.nom ?? id);
    if (blason.partition === 'parti' || blason.partition === 'coupe' ||
        blason.partition === 'tranche' || blason.partition === 'taille') {
      parts.push(`${partition.nom}, d'${apostropheEmail(nomsEmaux[0])} et d'${apostropheEmail(nomsEmaux[1])}`);
    } else if (blason.partition === 'ecartele') {
      parts.push(`Écartelé, au 1 et 4 d'${apostropheEmail(nomsEmaux[0])}, au 2 et 3 d'${apostropheEmail(nomsEmaux[1])}`);
    } else {
      parts.push(`${partition.nom}, ${nomsEmaux.map((n, i) => `${i + 1}) d'${apostropheEmail(n)}`).join(', ')}`);
    }
  }

  // 2. Pièce
  if (blason.piece) {
    const piece = getPiece(blason.piece.id);
    const emailPiece = getEmail(blason.piece.email);
    if (piece && emailPiece) {
      const article = articlePiece(piece.nom);
      parts.push(`${article}${piece.nom.toLowerCase()} d'${apostropheEmail(emailPiece.nom)}`);
    }
  }

  // 3. Meubles
  for (const mp of blason.meubles) {
    const meuble = getMeuble(mp.meuble);
    const emailMeuble = getEmail(mp.email);
    if (meuble && emailMeuble) {
      const article = articleMeuble(meuble.nom);
      parts.push(`${article}${meuble.nom.toLowerCase()} d'${apostropheEmail(emailMeuble.nom)}`);
    }
  }

  return parts.join(', ') + '.';
}

/** Gère l'apostrophe devant les émaux commençant par voyelle */
function apostropheEmail(nom: string): string {
  const lower = nom.toLowerCase();
  if (['a', 'e', 'i', 'o', 'u', 'é', 'è'].some((v) => lower.startsWith(v))) {
    return lower;
  }
  return lower;
}

function articlePiece(nom: string): string {
  const lower = nom.toLowerCase();
  if (['a', 'e', 'i', 'o', 'u', 'é'].some((v) => lower.startsWith(v))) return "à l'";
  return 'à la ';
}

function articleMeuble(nom: string): string {
  const lower = nom.toLowerCase();
  if (['a', 'e', 'i', 'o', 'u', 'é'].some((v) => lower.startsWith(v))) return "à l'";
  return 'au ';
}

/** Normalise un texte pour comparaison fuzzy */
export function normaliserTexte(texte: string): string {
  return texte
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['']/g, "'")
    .replace(/[^a-z0-9' ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Compare deux blasonnements avec tolérance */
export function comparerBlasonnements(reponse: string, attendu: string): { score: number; correct: boolean } {
  const r = normaliserTexte(reponse);
  const a = normaliserTexte(attendu);

  if (r === a) return { score: 1, correct: true };

  // Découper en mots et comparer
  const motsReponse = r.split(' ');
  const motsAttendu = a.split(' ');
  let communs = 0;
  for (const mot of motsReponse) {
    if (motsAttendu.includes(mot)) communs++;
  }
  const score = communs / Math.max(motsReponse.length, motsAttendu.length);
  return { score, correct: score >= 0.75 };
}
