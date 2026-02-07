import type { Blason, IdPartition } from '../types/heraldry';
import { EMAUX } from '../data/tinctures';

/** Choisit un élément au hasard */
function choixAleatoire<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Retourne un émail compatible (respect de la règle des émaux) */
function emailCompatible(autreEmailId: string): string {
  const autre = EMAUX.find((e) => e.id === autreEmailId);
  if (!autre) return choixAleatoire(EMAUX).id;
  const compatibles = EMAUX.filter((e) => e.type !== autre.type);
  return choixAleatoire(compatibles).id;
}

/** Génère un blason simple aléatoire */
export function genererBlasonSimple(): Blason {
  const email = choixAleatoire(EMAUX);
  return {
    partition: 'plein',
    emaux: [email.id],
    meubles: [],
  };
}

/** Génère un blason avec partition aléatoire */
export function genererBlasonPartition(): Blason {
  const partitions: IdPartition[] = ['parti', 'coupe', 'tranche', 'taille', 'ecartele'];
  const partition = choixAleatoire(partitions);
  const email1 = choixAleatoire(EMAUX);
  const email2Id = emailCompatible(email1.id);
  const nbZones = partition === 'ecartele' ? 4 : 2;
  const emaux = Array.from({ length: nbZones }, (_, i) =>
    i % 2 === 0 ? email1.id : email2Id
  );

  return {
    partition,
    emaux,
    meubles: [],
  };
}

/** Mélange un tableau (Fisher-Yates) */
export function melanger<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
