import { useState } from 'react';
import type { Exercice } from '../../types/game';
import CoatOfArmsRenderer from '../svg/CoatOfArmsRenderer';
import AnswerFeedback from './AnswerFeedback';
import { comparerBlasonnements } from '../../engine/blazon';

interface Props {
  exercice: Exercice;
  onReponse: (reponse: string, correct: boolean) => void;
}

/** Mode blasonnement : décrire un écu en texte libre */
export default function DescribeMode({ exercice, onReponse }: Props) {
  const [texte, setTexte] = useState('');
  const [resultat, setResultat] = useState<boolean | null>(null);
  const [montrerIndice, setMontrerIndice] = useState(false);

  const handleValider = () => {
    if (!texte.trim()) return;
    const { correct } = comparerBlasonnements(texte, exercice.reponse);
    setResultat(correct);
  };

  const handleSuivant = () => {
    onReponse(texte, resultat ?? false);
    setTexte('');
    setResultat(null);
    setMontrerIndice(false);
  };

  return (
    <div className="exercise-container">
      <h3 className="exercise-question">{exercice.question}</h3>

      {exercice.blason && (
        <div className="exercise-shield">
          <CoatOfArmsRenderer blason={exercice.blason} />
        </div>
      )}

      {resultat === null && (
        <>
          <div className="describe-input">
            <textarea
              value={texte}
              onChange={(e) => setTexte(e.target.value)}
              placeholder="Ex: D'azur, à la fasce d'or…"
              rows={3}
            />
            <div className="describe-actions">
              {exercice.indice && (
                <button
                  className="btn btn-secondary"
                  onClick={() => setMontrerIndice(true)}
                >
                  Indice
                </button>
              )}
              <button
                className="btn btn-primary"
                onClick={handleValider}
                disabled={!texte.trim()}
              >
                Valider
              </button>
            </div>
          </div>

          {montrerIndice && exercice.indice && (
            <div className="indice-box">{exercice.indice}</div>
          )}
        </>
      )}

      <AnswerFeedback
        correct={resultat}
        bonneReponse={exercice.reponse}
        onSuivant={handleSuivant}
      />
    </div>
  );
}
