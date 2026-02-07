import { useGame } from '../../context/GameContext';

const NOMS_NIVEAUX = [
  '',
  'Les Émaux',
  'Les Partitions',
  'Les Pièces honorables',
  'Les Meubles',
  'Avancé',
];

const DESCRIPTIONS_NIVEAUX = [
  '',
  'Apprenez les 7 émaux et la règle métal/couleur',
  'Maîtrisez les divisions de l\'écu',
  'Identifiez fasce, pal, bande, chevron…',
  'Lion, aigle, fleur de lys et autres meubles',
  'Blasons historiques et compositions complexes',
];

interface Props {
  onCommencer: () => void;
}

export default function LevelSelector({ onCommencer }: Props) {
  const { etat, choisirNiveau } = useGame();

  return (
    <div className="level-selector">
      <h2>Choisissez votre niveau</h2>
      <div className="levels-grid">
        {etat.niveaux.map((n) => {
          const actif = n.niveau === etat.niveauActuel;
          return (
            <button
              key={n.niveau}
              className={`level-card ${actif ? 'level-active' : ''} ${!n.debloque ? 'level-locked' : ''}`}
              onClick={() => {
                if (n.debloque) {
                  choisirNiveau(n.niveau);
                  onCommencer();
                }
              }}
              disabled={!n.debloque}
            >
              <div className="level-number">{n.debloque ? n.niveau : '🔒'}</div>
              <div className="level-name">{NOMS_NIVEAUX[n.niveau]}</div>
              <div className="level-desc">{DESCRIPTIONS_NIVEAUX[n.niveau]}</div>
              {n.exercicesFaits > 0 && (
                <div className="level-progress">
                  {n.exercicesReussis}/{n.exercicesFaits} réussis
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
