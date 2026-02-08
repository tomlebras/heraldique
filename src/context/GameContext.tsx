import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { EtatJeu, ProgressionNiveau, ResultatExercice } from '../types/game';
import { XP_BONNE_REPONSE, XP_BONUS_STREAK, SEUIL_DEBLOCAGE } from '../types/game';

const CLE_STORAGE = 'heraldique-progression';

const NIVEAUX_INITIAUX: ProgressionNiveau[] = [
  { niveau: 1, debloque: true, exercicesFaits: 0, exercicesReussis: 0, meilleurStreak: 0 },
  { niveau: 2, debloque: true, exercicesFaits: 0, exercicesReussis: 0, meilleurStreak: 0 },
  { niveau: 3, debloque: true, exercicesFaits: 0, exercicesReussis: 0, meilleurStreak: 0 },
  { niveau: 4, debloque: true, exercicesFaits: 0, exercicesReussis: 0, meilleurStreak: 0 },
  { niveau: 5, debloque: true, exercicesFaits: 0, exercicesReussis: 0, meilleurStreak: 0 },
];

const ETAT_INITIAL: EtatJeu = {
  xp: 0,
  streakActuel: 0,
  meilleurStreak: 0,
  niveaux: NIVEAUX_INITIAUX,
  niveauActuel: 1,
  historique: [],
};

type Action =
  | { type: 'REPONDRE'; resultat: ResultatExercice }
  | { type: 'CHOISIR_NIVEAU'; niveau: number }
  | { type: 'REINITIALISER' }
  | { type: 'IMPORTER'; etat: EtatJeu };

function reducer(state: EtatJeu, action: Action): EtatJeu {
  switch (action.type) {
    case 'REPONDRE': {
      const { resultat } = action;
      const nouveauStreak = resultat.correct ? state.streakActuel + 1 : 0;
      const xpGagne = resultat.correct
        ? XP_BONNE_REPONSE + (state.streakActuel * XP_BONUS_STREAK)
        : 0;

      const niveaux = state.niveaux.map((n) => {
        if (n.niveau !== state.niveauActuel) return n;
        const updated = {
          ...n,
          exercicesFaits: n.exercicesFaits + 1,
          exercicesReussis: n.exercicesReussis + (resultat.correct ? 1 : 0),
          meilleurStreak: Math.max(n.meilleurStreak, nouveauStreak),
        };
        return updated;
      });

      // Débloquer le niveau suivant si seuil atteint
      const niveauActuelData = niveaux.find((n) => n.niveau === state.niveauActuel);
      if (niveauActuelData && niveauActuelData.exercicesReussis >= SEUIL_DEBLOCAGE) {
        const suivant = niveaux.find((n) => n.niveau === state.niveauActuel + 1);
        if (suivant) suivant.debloque = true;
      }

      return {
        ...state,
        xp: state.xp + xpGagne,
        streakActuel: nouveauStreak,
        meilleurStreak: Math.max(state.meilleurStreak, nouveauStreak),
        niveaux,
        historique: [...state.historique.slice(-99), resultat],
      };
    }

    case 'CHOISIR_NIVEAU': {
      const niv = state.niveaux.find((n) => n.niveau === action.niveau);
      if (!niv?.debloque) return state;
      return { ...state, niveauActuel: action.niveau, streakActuel: 0 };
    }

    case 'REINITIALISER':
      return ETAT_INITIAL;

    case 'IMPORTER':
      return action.etat;

    default:
      return state;
  }
}

function chargerEtat(): EtatJeu {
  try {
    const data = localStorage.getItem(CLE_STORAGE);
    if (data) return JSON.parse(data);
  } catch { /* ignore */ }
  return ETAT_INITIAL;
}

interface ContexteJeu {
  etat: EtatJeu;
  repondre: (resultat: ResultatExercice) => void;
  choisirNiveau: (niveau: number) => void;
  reinitialiser: () => void;
  exporterDonnees: () => void;
  importerDonnees: (json: string) => string | null;
}

const GameCtx = createContext<ContexteJeu | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [etat, dispatch] = useReducer(reducer, null, chargerEtat);

  useEffect(() => {
    localStorage.setItem(CLE_STORAGE, JSON.stringify(etat));
  }, [etat]);

  const exporterDonnees = () => {
    const data = {
      ...etat,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const date = new Date().toISOString().slice(0, 10);
    a.download = `heraldique-backup-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importerDonnees = (json: string): string | null => {
    try {
      const data = JSON.parse(json);
      if (!data.xp && data.xp !== 0) return 'Fichier invalide : champ "xp" manquant';
      if (!Array.isArray(data.niveaux)) return 'Fichier invalide : champ "niveaux" manquant';
      if (!Array.isArray(data.historique)) return 'Fichier invalide : champ "historique" manquant';
      const etatImporte: EtatJeu = {
        xp: data.xp,
        streakActuel: data.streakActuel ?? 0,
        meilleurStreak: data.meilleurStreak ?? 0,
        niveaux: data.niveaux,
        niveauActuel: data.niveauActuel ?? 1,
        historique: data.historique,
      };
      dispatch({ type: 'IMPORTER', etat: etatImporte });
      return null;
    } catch {
      return 'Fichier JSON invalide';
    }
  };

  const value: ContexteJeu = {
    etat,
    repondre: (resultat) => dispatch({ type: 'REPONDRE', resultat }),
    choisirNiveau: (niveau) => dispatch({ type: 'CHOISIR_NIVEAU', niveau }),
    reinitialiser: () => dispatch({ type: 'REINITIALISER' }),
    exporterDonnees,
    importerDonnees,
  };

  return <GameCtx.Provider value={value}>{children}</GameCtx.Provider>;
}

export function useGame(): ContexteJeu {
  const ctx = useContext(GameCtx);
  if (!ctx) throw new Error('useGame doit être utilisé dans un GameProvider');
  return ctx;
}
