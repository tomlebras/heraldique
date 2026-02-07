import { useGame } from '../../context/GameContext';

export default function ScoreBar() {
  const { etat } = useGame();
  const niveauData = etat.niveaux.find((n) => n.niveau === etat.niveauActuel);

  return (
    <div className="score-bar">
      <div className="score-item">
        <span className="score-label">XP</span>
        <span className="score-value">{etat.xp}</span>
      </div>
      <div className="score-item">
        <span className="score-label">Série</span>
        <span className="score-value streak">{etat.streakActuel > 0 ? `${etat.streakActuel} 🔥` : '0'}</span>
      </div>
      {niveauData && (
        <div className="score-item">
          <span className="score-label">Réussis</span>
          <span className="score-value">{niveauData.exercicesReussis}/{niveauData.exercicesFaits}</span>
        </div>
      )}
    </div>
  );
}
