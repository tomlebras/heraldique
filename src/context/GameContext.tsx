import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { EtatJeu, ProgressionNiveau, ResultatExercice } from '../types/game';
import { XP_BONNE_REPONSE, XP_BONUS_STREAK, SEUIL_DEBLOCAGE } from '../types/game';

const CLE_STORAGE = 'heraldique-progression';

const NIVEAUX_INITIAUX: ProgressionNiveau[] = [
  { niveau: 1, debloque: true, exercicesFaits: 0, exercicesReussis: 0, meilleurStreak: 0 },
  { niveau: 2, debloque: false, exercicesFaits: 0, exercicesReussis: 0, meilleurStreak: 0 },
  { niveau: 3, debloque: false, exercicesFaits: 0, exercicesReussis: 0, meilleurStreak: 0 },
  { niveau: 4, debloque: false, exercicesFaits: 0, exercicesReussis: 0, meilleurStreak: 0 },
  { niveau: 5, debloque: false, exercicesFaits: 0, exercicesReussis: 0, meilleurStreak: 0 },
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
  | { type: 'REINITIALISER' };

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
}

const GameCtx = createContext<ContexteJeu | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [etat, dispatch] = useReducer(reducer, null, chargerEtat);

  useEffect(() => {
    localStorage.setItem(CLE_STORAGE, JSON.stringify(etat));
  }, [etat]);

  const value: ContexteJeu = {
    etat,
    repondre: (resultat) => dispatch({ type: 'REPONDRE', resultat }),
    choisirNiveau: (niveau) => dispatch({ type: 'CHOISIR_NIVEAU', niveau }),
    reinitialiser: () => dispatch({ type: 'REINITIALISER' }),
  };

  return <GameCtx.Provider value={value}>{children}</GameCtx.Provider>;
}

export function useGame(): ContexteJeu {
  const ctx = useContext(GameCtx);
  if (!ctx) throw new Error('useGame doit être utilisé dans un GameProvider');
  return ctx;
}
