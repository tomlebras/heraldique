/** Types du système de jeu */

export type ModeExercice = 'qcm' | 'identification' | 'blasonnement' | 'construction';

export interface Exercice {
  id: string;
  niveau: number;
  mode: ModeExercice;
  question: string;
  /** Pour QCM : les choix proposés */
  choix?: string[];
  /** La bonne réponse (texte ou ID) */
  reponse: string;
  /** Données du blason à afficher/construire */
  blason?: import('./heraldry').Blason;
  /** Indice optionnel */
  indice?: string;
}

export interface ResultatExercice {
  exerciceId: string;
  correct: boolean;
  reponseDonnee: string;
  tempsMs: number;
}

export interface ProgressionNiveau {
  niveau: number;
  debloque: boolean;
  exercicesFaits: number;
  exercicesReussis: number;
  meilleurStreak: number;
}

export interface EtatJeu {
  xp: number;
  streakActuel: number;
  meilleurStreak: number;
  niveaux: ProgressionNiveau[];
  niveauActuel: number;
  historique: ResultatExercice[];
}

export const SEUIL_DEBLOCAGE = 15; // sur 20 pour passer au niveau suivant
export const XP_BONNE_REPONSE = 10;
export const XP_BONUS_STREAK = 2;
