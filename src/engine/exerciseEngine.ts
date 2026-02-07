import type { Exercice } from '../types/game';
import { genererExercicesNiveau1 } from '../data/exercises/level1';
import { genererExercicesNiveau2 } from '../data/exercises/level2';
import { genererExercicesNiveau3 } from '../data/exercises/level3';
import { genererExercicesNiveau4 } from '../data/exercises/level4';
import { genererExercicesNiveau5 } from '../data/exercises/level5';

const EXERCICES_PAR_NIVEAU = 20;

/** Génère un lot d'exercices pour un niveau donné */
export function genererExercices(niveau: number): Exercice[] {
  let tous: Exercice[];

  switch (niveau) {
    case 1: tous = genererExercicesNiveau1(); break;
    case 2: tous = genererExercicesNiveau2(); break;
    case 3: tous = genererExercicesNiveau3(); break;
    case 4: tous = genererExercicesNiveau4(); break;
    case 5: tous = genererExercicesNiveau5(); break;
    default: tous = genererExercicesNiveau1(); break;
  }

  return tous.slice(0, EXERCICES_PAR_NIVEAU);
}

/** Sélectionne l'exercice suivant dans la liste */
export function exerciceSuivant(
  exercices: Exercice[],
  indexActuel: number
): { exercice: Exercice; index: number; termine: boolean } | null {
  const nextIndex = indexActuel + 1;
  if (nextIndex >= exercices.length) {
    return null;
  }
  return {
    exercice: exercices[nextIndex],
    index: nextIndex,
    termine: nextIndex >= exercices.length - 1,
  };
}
