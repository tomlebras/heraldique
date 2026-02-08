import { useEffect } from 'react';

interface Props {
  correct: boolean | null;
  bonneReponse?: string;
  reponseUtilisateur?: string;
  onSuivant: () => void;
}

export default function AnswerFeedback({ correct, bonneReponse, reponseUtilisateur, onSuivant }: Props) {
  useEffect(() => {
    if (correct === null) return;
    // Délai pour éviter que l'Enter de validation déclenche immédiatement "suivant"
    let active = false;
    const timer = setTimeout(() => { active = true; }, 150);
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && active) {
        e.preventDefault();
        onSuivant();
      }
    };
    window.addEventListener('keydown', handler);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handler);
    };
  }, [correct, onSuivant]);

  if (correct === null) return null;

  return (
    <div className={`feedback ${correct ? 'feedback-correct' : 'feedback-incorrect'}`}>
      <div className="feedback-icon">{correct ? '✓' : '✗'}</div>
      <div className="feedback-text">
        {correct ? 'Bonne réponse !' : 'Incorrect'}
        {reponseUtilisateur && (
          <div className={`feedback-user-answer ${correct ? 'feedback-answer-correct' : 'feedback-answer-wrong'}`}>
            Votre réponse : <strong>{reponseUtilisateur}</strong>
          </div>
        )}
        {!correct && bonneReponse && (
          <div className="feedback-reponse">
            Bonne réponse : <strong>{bonneReponse}</strong>
          </div>
        )}
      </div>
      <button className="btn btn-primary" onClick={onSuivant}>
        Suivant →
      </button>
    </div>
  );
}
