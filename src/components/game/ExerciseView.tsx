import { useState, useEffect, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { genererExercices } from '../../engine/exerciseEngine';
import type { Exercice } from '../../types/game';
import IdentifyMode from './IdentifyMode';
import FreeTextMode from './FreeTextMode';
import DescribeMode from './DescribeMode';
import BuildMode from './BuildMode';
import ScoreBar from './ScoreBar';

interface Props {
  onRetour: () => void;
}

export default function ExerciseView({ onRetour }: Props) {
  const { etat, repondre } = useGame();
  const [exercices, setExercices] = useState<Exercice[]>([]);
  const [index, setIndex] = useState(0);
  const [termine, setTermine] = useState(false);
  const [debut] = useState(Date.now());

  useEffect(() => {
    setExercices(genererExercices(etat.niveauActuel));
    setIndex(0);
    setTermine(false);
  }, [etat.niveauActuel]);

  const handleReponse = useCallback((reponseDonnee: string, correct: boolean) => {
    const exercice = exercices[index];
    if (!exercice) return;

    repondre({
      exerciceId: exercice.id,
      correct,
      reponseDonnee,
      tempsMs: Date.now() - debut,
    });

    if (index + 1 >= exercices.length) {
      setTermine(true);
    } else {
      setIndex((i) => i + 1);
    }
  }, [exercices, index, repondre, debut]);

  if (exercices.length === 0) return <div>Chargement…</div>;

  if (termine) {
    const niveauData = etat.niveaux.find((n) => n.niveau === etat.niveauActuel);
    return (
      <div className="exercise-complete">
        <h2>Série terminée !</h2>
        <div className="complete-stats">
          <p>XP total : <strong>{etat.xp}</strong></p>
          <p>Meilleure série : <strong>{etat.meilleurStreak}</strong></p>
          {niveauData && (
            <p>Réussis ce niveau : <strong>{niveauData.exercicesReussis}/{niveauData.exercicesFaits}</strong></p>
          )}
        </div>
        <div className="complete-actions">
          <button className="btn btn-primary" onClick={() => {
            setExercices(genererExercices(etat.niveauActuel));
            setIndex(0);
            setTermine(false);
          }}>
            Rejouer ce niveau
          </button>
          <button className="btn btn-secondary" onClick={onRetour}>
            Choisir un niveau
          </button>
        </div>
      </div>
    );
  }

  const exercice = exercices[index];
  const progression = `${index + 1}/${exercices.length}`;

  return (
    <div className="exercise-view">
      <div className="exercise-header">
        <button className="btn btn-back" onClick={onRetour}>← Retour</button>
        <span className="exercise-progress">{progression}</span>
        <div className="exercise-progress-bar">
          <div
            className="exercise-progress-fill"
            style={{ width: `${((index + 1) / exercices.length) * 100}%` }}
          />
        </div>
      </div>

      <ScoreBar />

      {exercice.mode === 'qcm' && (
        <IdentifyMode
          key={exercice.id}
          exercice={exercice}
          onReponse={handleReponse}
        />
      )}

      {exercice.mode === 'identification' && (
        <FreeTextMode
          key={exercice.id}
          exercice={exercice}
          onReponse={handleReponse}
        />
      )}

      {exercice.mode === 'blasonnement' && (
        <DescribeMode
          key={exercice.id}
          exercice={exercice}
          onReponse={handleReponse}
        />
      )}

      {exercice.mode === 'construction' && (
        <BuildMode
          key={exercice.id}
          exercice={exercice}
          onReponse={handleReponse}
        />
      )}
    </div>
  );
}
