import { useRef, useState } from 'react';
import { useGame } from '../../context/GameContext';

export default function SettingsView() {
  const { etat, exporterDonnees, importerDonnees, reinitialiser } = useGame();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const erreur = importerDonnees(reader.result as string);
      if (erreur) {
        setMessage({ type: 'error', text: erreur });
      } else {
        setMessage({ type: 'success', text: 'Progression importée avec succès' });
      }
      setTimeout(() => setMessage(null), 4000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    reinitialiser();
    setConfirmReset(false);
    setMessage({ type: 'success', text: 'Progression réinitialisée' });
    setTimeout(() => setMessage(null), 4000);
  };

  const totalExercices = etat.niveaux.reduce((s, n) => s + n.exercicesFaits, 0);
  const totalReussis = etat.niveaux.reduce((s, n) => s + n.exercicesReussis, 0);
  const tauxReussite = totalExercices > 0 ? Math.round((totalReussis / totalExercices) * 100) : 0;

  return (
    <div className="settings-view">
      <h2>Paramètres</h2>

      {message && (
        <div className={`settings-message settings-message-${message.type}`}>
          {message.text}
        </div>
      )}

      <section className="settings-section">
        <div className="settings-section-header">
          <span className="settings-icon">&#x1f4ca;</span>
          <h3>Progression</h3>
        </div>
        <div className="settings-stats">
          <div className="settings-stat">
            <span className="settings-stat-value settings-stat-xp">{etat.xp}</span>
            <span className="settings-stat-label">XP</span>
          </div>
          <div className="settings-stat">
            <span className="settings-stat-value">{totalExercices}</span>
            <span className="settings-stat-label">Exercices</span>
          </div>
          <div className="settings-stat">
            <span className="settings-stat-value settings-stat-success">{totalReussis}</span>
            <span className="settings-stat-label">Réussis</span>
          </div>
          <div className="settings-stat">
            <span className="settings-stat-value settings-stat-streak">{etat.meilleurStreak}</span>
            <span className="settings-stat-label">Meilleure série</span>
          </div>
          <div className="settings-stat">
            <span className="settings-stat-value">{tauxReussite}%</span>
            <span className="settings-stat-label">Taux</span>
          </div>
        </div>
        <div className="settings-levels">
          {etat.niveaux.map((n) => (
            <div key={n.niveau} className="settings-level-row">
              <span className="settings-level-name">Niveau {n.niveau}</span>
              <div className="settings-level-bar">
                <div
                  className="settings-level-fill"
                  style={{ width: `${n.exercicesFaits > 0 ? Math.min((n.exercicesReussis / Math.max(n.exercicesFaits, 1)) * 100, 100) : 0}%` }}
                />
              </div>
              <span className="settings-level-count">{n.exercicesReussis}/{n.exercicesFaits}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="settings-section">
        <div className="settings-section-header">
          <span className="settings-icon">&#x1f4be;</span>
          <h3>Sauvegarde</h3>
        </div>
        <p className="settings-desc">
          Exportez votre progression en fichier JSON pour la sauvegarder ou la transférer sur un autre appareil.
        </p>
        <div className="settings-actions">
          <button className="btn btn-primary settings-btn-icon" onClick={exporterDonnees}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1v9m0 0L5 7m3 3l3-3M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Exporter
          </button>
          <button className="btn btn-secondary settings-btn-icon" onClick={() => fileInputRef.current?.click()}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 14V5m0 0L5 8m3-3l3 3M2 4V2a1 1 0 011-1h10a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Importer
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
        </div>
      </section>

      <section className="settings-section settings-danger">
        <div className="settings-section-header">
          <span className="settings-icon">&#x26a0;</span>
          <h3>Zone dangereuse</h3>
        </div>
        <p className="settings-desc">
          Supprimer toute la progression et repartir de zéro. Cette action est irréversible.
        </p>
        <div className="settings-actions">
          {confirmReset ? (
            <>
              <span className="settings-confirm-text">Confirmer la réinitialisation ?</span>
              <button className="btn btn-danger" onClick={handleReset}>
                Oui, tout supprimer
              </button>
              <button className="btn btn-secondary" onClick={() => setConfirmReset(false)}>
                Annuler
              </button>
            </>
          ) : (
            <button className="btn btn-danger-outline" onClick={handleReset}>
              Réinitialiser la progression
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
