import { useState } from 'react';
import type { Exercice } from '../../types/game';
import CoatOfArmsRenderer from '../svg/CoatOfArmsRenderer';
import AnswerFeedback from './AnswerFeedback';

interface Props {
  exercice: Exercice;
  onReponse: (reponse: string, correct: boolean) => void;
}

/** Mode QCM : identifier l'émail, la partition, etc. */
export default function IdentifyMode({ exercice, onReponse }: Props) {
  const [selection, setSelection] = useState<string | null>(null);
  const [resultat, setResultat] = useState<boolean | null>(null);

  const handleChoix = (choix: string) => {
    if (selection !== null) return; // déjà répondu
    const correct = choix === exercice.reponse;
    setSelection(choix);
    setResultat(correct);
  };

  const handleSuivant = () => {
    if (selection !== null && resultat !== null) {
      onReponse(selection, resultat);
    }
    setSelection(null);
    setResultat(null);
  };

  return (
    <div className="exercise-container">
      <h3 className="exercise-question">{exercice.question}</h3>

      {exercice.blason && (
        <div className="exercise-shield">
          <CoatOfArmsRenderer blason={exercice.blason} />
        </div>
      )}

      <div className="qcm-choices">
        {exercice.choix?.map((choix) => {
          let classe = 'btn-choice';
          if (selection !== null) {
            if (choix === exercice.reponse) classe += ' choice-correct';
            else if (choix === selection) classe += ' choice-incorrect';
            else classe += ' choice-disabled';
          }
          return (
            <button
              key={choix}
              className={classe}
              onClick={() => handleChoix(choix)}
              disabled={selection !== null}
            >
              {choix}
            </button>
          );
        })}
      </div>

      <AnswerFeedback
        correct={resultat}
        bonneReponse={exercice.reponse}
        reponseUtilisateur={selection ?? undefined}
        onSuivant={handleSuivant}
      />
    </div>
  );
}
