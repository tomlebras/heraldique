import { useState, useRef, useEffect } from 'react';
import type { Exercice } from '../../types/game';
import CoatOfArmsRenderer from '../svg/CoatOfArmsRenderer';
import AnswerFeedback from './AnswerFeedback';
import { fuzzyMatch } from '../../engine/blazon';

interface Props {
  exercice: Exercice;
  onReponse: (reponse: string, correct: boolean) => void;
}

/** Mode texte libre : taper la réponse au clavier avec fuzzy matching tolérant */
export default function FreeTextMode({ exercice, onReponse }: Props) {
  const [texte, setTexte] = useState('');
  const [resultat, setResultat] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [exercice.id]);

  const handleValider = () => {
    if (!texte.trim()) return;
    const correct = fuzzyMatch(texte, exercice.reponse);
    setResultat(correct);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && texte.trim()) {
      handleValider();
    }
  };

  const handleSuivant = () => {
    onReponse(texte, resultat ?? false);
    setTexte('');
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

      {resultat === null && (
        <div className="free-text-input">
          <input
            ref={inputRef}
            type="text"
            value={texte}
            onChange={(e) => setTexte(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Votre réponse…"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <div className="free-text-actions">
            <button
              className="btn btn-primary"
              onClick={handleValider}
              disabled={!texte.trim()}
            >
              Valider
            </button>
          </div>
        </div>
      )}

      <AnswerFeedback
        correct={resultat}
        bonneReponse={exercice.reponse}
        reponseUtilisateur={texte}
        onSuivant={handleSuivant}
      />
    </div>
  );
}
