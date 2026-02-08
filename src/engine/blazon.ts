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
  if (blason.partition === 'plein' && blason.emaux[0] === 'hermine' && !blason.piece && blason.meubles.length === 0) {
    return 'D\'hermine plain.';
  }
  if (blason.partition === 'plein') {
    const email = getEmail(blason.emaux[0]);
    const nom = blason.emaux[0] === 'hermine' ? 'hermine' : email?.nom ?? '';
    const de = deEmail(nom);
    parts.push(de.charAt(0).toUpperCase() + de.slice(1));
  } else if (partition) {
    const nomsEmaux = blason.emaux.map((id) => getEmail(id)?.nom ?? id);
    if (blason.partition === 'parti' || blason.partition === 'coupe' ||
        blason.partition === 'tranche' || blason.partition === 'taille') {
      parts.push(`${partition.nom}, ${deEmail(nomsEmaux[0])} et ${deEmail(nomsEmaux[1])}`);
    } else if (blason.partition === 'ecartele') {
      // Forme simple si seulement 2 émaux (1&4 identiques, 2&3 identiques)
      if (nomsEmaux[0] === nomsEmaux[3] && nomsEmaux[1] === nomsEmaux[2]) {
        parts.push(`Écartelé ${deEmail(nomsEmaux[0])} et ${deEmail(nomsEmaux[1])}`);
      } else {
        parts.push(`Écartelé, au 1 ${deEmail(nomsEmaux[0])}, au 2 ${deEmail(nomsEmaux[1])}, au 3 ${deEmail(nomsEmaux[2])}, au 4 ${deEmail(nomsEmaux[3])}`);
      }
    } else {
      parts.push(`${partition.nom}, ${nomsEmaux.map((n, i) => `${i + 1}) ${deEmail(n)}`).join(', ')}`);
    }
  }

  // 2. Pièce
  if (blason.piece) {
    const piece = getPiece(blason.piece.id);
    const emailPiece = getEmail(blason.piece.email);
    if (piece && emailPiece) {
      const article = articlePiece(piece.nom);
      parts.push(`${article}${piece.nom.toLowerCase()} ${deEmail(emailPiece.nom)}`);
    }
  }

  // 3. Meubles (grouper les identiques)
  const groupes = new Map<string, { meuble: string; nom: string; email: string; count: number }>();
  for (const mp of blason.meubles) {
    const key = `${mp.meuble}|${mp.email}`;
    const existing = groupes.get(key);
    if (existing) {
      existing.count++;
    } else {
      const meuble = getMeuble(mp.meuble);
      const emailMeuble = getEmail(mp.email);
      if (meuble && emailMeuble) {
        groupes.set(key, { meuble: mp.meuble, nom: meuble.nom, email: emailMeuble.nom, count: 1 });
      }
    }
  }
  for (const g of groupes.values()) {
    if (g.count === 1) {
      const article = articleMeuble(g.nom);
      parts.push(`${article}${g.nom.toLowerCase()} ${deEmail(g.email)}`);
    } else {
      const nombres = ['', '', 'deux', 'trois', 'quatre', 'cinq', 'six'];
      const nb = nombres[g.count] ?? `${g.count}`;
      const pluriel = plurielMeuble(g.nom);
      parts.push(`à ${nb} ${pluriel} ${deEmail(g.email)}`);
    }
  }

  return parts.join(', ') + '.';
}

/** Retourne "d'or", "d'azur", "d'argent" ou "de gueules", "de sinople", etc. */
function deEmail(nom: string): string {
  const lower = nom.toLowerCase();
  if (['a', 'e', 'i', 'o', 'u', 'é'].some((v) => lower.startsWith(v))) {
    return `d'${lower}`;
  }
  return `de ${lower}`;
}

function articlePiece(nom: string): string {
  const lower = nom.toLowerCase();
  if (['a', 'e', 'i', 'o', 'u', 'é'].some((v) => lower.startsWith(v))) return "à l'";
  const feminins = ['fasce', 'bande', 'barre', 'croix', 'bordure', 'champagne'];
  if (feminins.includes(lower)) return 'à la ';
  return 'au ';
}

function articleMeuble(nom: string): string {
  const lower = nom.toLowerCase();
  if (['a', 'e', 'i', 'o', 'u', 'é'].some((v) => lower.startsWith(v))) return "à l'";
  const feminins = ['fleur de lys', 'étoile', 'tour', 'épée', 'coquille'];
  if (feminins.some((f) => lower === f)) return 'à la ';
  return 'au ';
}

function plurielMeuble(nom: string): string {
  const lower = nom.toLowerCase();
  if (lower === 'fleur de lys') return 'fleurs de lys';
  if (lower.endsWith('s') || lower.endsWith('x')) return lower;
  return lower + 's';
}

// ========== FUZZY MATCHING ==========

/** Normalise un texte : minuscules, sans accents, sans ponctuation */
export function normaliserTexte(texte: string): string {
  return texte
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // retire les accents
    .replace(/[''´`]/g, "'")
    .replace(/[^a-z0-9' ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Distance de Levenshtein entre deux chaînes */
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,     // suppression
        dp[i][j - 1] + 1,     // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return dp[m][n];
}

/** Ratio de similarité entre deux chaînes (0-1) */
function similarite(a: string, b: string): number {
  if (a === b) return 1;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

/**
 * Variantes acceptables pour les termes héraldiques.
 * Permet de reconnaître des écritures alternatives.
 */
const VARIANTES: Record<string, string[]> = {
  'or': ['or', 'dore', 'jaune'],
  'argent': ['argent', 'blanc', 'arg'],
  'gueules': ['gueules', 'gueule', 'rouge'],
  'azur': ['azur', 'bleu'],
  'sinople': ['sinople', 'vert'],
  'sable': ['sable', 'noir'],
  'pourpre': ['pourpre', 'violet', 'mauve'],
  'parti': ['parti', 'partis'],
  'coupe': ['coupe', 'coupé'],
  'tranche': ['tranche', 'tranché'],
  'taille': ['taille', 'taillé'],
  'ecartele': ['ecartele', 'ecartelé', 'ecarteler'],
  'fasce': ['fasce', 'face'],
  'pal': ['pal', 'pale'],
  'bande': ['bande'],
  'barre': ['barre'],
  'chevron': ['chevron'],
  'croix': ['croix'],
  'sautoir': ['sautoir'],
  'chef': ['chef'],
  'champagne': ['champagne'],
  'bordure': ['bordure'],
  'lion': ['lion', 'lions'],
  'lionceau': ['lionceau', 'lionceaux'],
  'aigle': ['aigle', 'aigles'],
  'fleur de lys': ['fleur de lys', 'fleur de lis', 'fleurs de lys', 'fleurs de lis', 'fleur de ly'],
  'etoile': ['etoile', 'étoile', 'etoiles'],
  'croissant': ['croissant'],
  'tour': ['tour', 'tours'],
  'epee': ['epee', 'épée', 'epees'],
  'arbre': ['arbre', 'arbres'],
  'cerf': ['cerf', 'cerfs'],
  'coquille': ['coquille', 'coquilles', 'coquille saint jacques'],
  'metal': ['metal', 'métal', 'metaux', 'métaux'],
  'couleur': ['couleur', 'couleurs'],
};

/**
 * Fuzzy match tolérant pour les réponses héraldiques.
 * Accepte :
 * - Fautes d'accent (gueules = gueules)
 * - Fautes d'orthographe mineures (distance de Levenshtein ≤ 2 pour mots courts, ≤ 3 pour mots longs)
 * - Variantes (fleur de lis = fleur de lys)
 * - Articles/prépositions manquants (d', de, le, la, l', au, à)
 */
export function fuzzyMatch(reponse: string, attendu: string): boolean {
  const r = normaliserTexte(reponse);
  const a = normaliserTexte(attendu);

  // Match exact après normalisation
  if (r === a) return true;

  // Vérifier si c'est la même chose via les variantes
  const rVariante = trouverTermeCanonique(r);
  const aVariante = trouverTermeCanonique(a);
  if (rVariante && aVariante && rVariante === aVariante) return true;

  // Retirer articles et prépositions pour comparer le contenu essentiel
  const motsFiltres = ['d', 'de', 'le', 'la', 'l', 'au', 'a', 'et', 'du', 'des', 'les', 'un', 'une'];
  const rEssentiel = r.split(' ').filter((m) => !motsFiltres.includes(m)).join(' ');
  const aEssentiel = a.split(' ').filter((m) => !motsFiltres.includes(m)).join(' ');

  if (rEssentiel === aEssentiel) return true;

  // Similarité globale
  if (similarite(rEssentiel, aEssentiel) >= 0.8) return true;

  // Comparer mot par mot avec tolérance
  const motsR = rEssentiel.split(' ');
  const motsA = aEssentiel.split(' ');

  if (motsR.length === 1 && motsA.length === 1) {
    // Un seul mot de chaque côté : tolérance Levenshtein
    const dist = levenshtein(motsR[0], motsA[0]);
    const seuil = motsA[0].length <= 4 ? 1 : motsA[0].length <= 7 ? 2 : 3;
    return dist <= seuil;
  }

  // Multi-mots : chaque mot attendu doit avoir un match proche
  let matched = 0;
  for (const motA of motsA) {
    const bestMatch = motsR.reduce((best, motR) => {
      const sim = similarite(motR, motA);
      return sim > best ? sim : best;
    }, 0);
    if (bestMatch >= 0.7) matched++;
  }
  return matched / motsA.length >= 0.7;
}

/** Trouve le terme canonique pour une entrée via les variantes */
function trouverTermeCanonique(texte: string): string | null {
  const norm = normaliserTexte(texte);
  for (const [canonique, variantes] of Object.entries(VARIANTES)) {
    if (variantes.some((v) => normaliserTexte(v) === norm)) return canonique;
  }
  return null;
}

/** Compare deux blasonnements avec tolérance (pour le mode blasonnement long) */
export function comparerBlasonnements(reponse: string, attendu: string): { score: number; correct: boolean } {
  const r = normaliserTexte(reponse);
  const a = normaliserTexte(attendu);

  if (r === a) return { score: 1, correct: true };

  // Retirer articles
  const motsFiltres = ['d', 'de', 'le', 'la', 'l', 'au', 'a', 'et', 'du', 'des', 'les', 'un', 'une'];
  const motsReponse = r.split(' ').filter((m) => !motsFiltres.includes(m));
  const motsAttendu = a.split(' ').filter((m) => !motsFiltres.includes(m));

  let communs = 0;
  for (const mot of motsReponse) {
    // Chercher un match proche dans les mots attendus
    const match = motsAttendu.some((ma) => similarite(mot, ma) >= 0.7);
    if (match) communs++;
  }
  const score = communs / Math.max(motsReponse.length, motsAttendu.length);
  return { score, correct: score >= 0.75 };
}
