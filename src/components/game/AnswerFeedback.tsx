interface Props {
  correct: boolean | null;
  bonneReponse?: string;
  onSuivant: () => void;
}

export default function AnswerFeedback({ correct, bonneReponse, onSuivant }: Props) {
  if (correct === null) return null;

  return (
    <div className={`feedback ${correct ? 'feedback-correct' : 'feedback-incorrect'}`}>
      <div className="feedback-icon">{correct ? '✓' : '✗'}</div>
      <div className="feedback-text">
        {correct ? 'Bonne réponse !' : 'Incorrect'}
        {!correct && bonneReponse && (
          <div className="feedback-reponse">
            Réponse attendue : <strong>{bonneReponse}</strong>
          </div>
        )}
      </div>
      <button className="btn btn-primary" onClick={onSuivant}>
        Suivant →
      </button>
    </div>
  );
}
