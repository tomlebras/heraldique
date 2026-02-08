import { useGame } from '../../context/GameContext';

interface Props {
  vue: string;
  onNaviguer: (vue: string) => void;
}

export default function Header({ vue, onNaviguer }: Props) {
  const { etat } = useGame();

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="header-title" onClick={() => onNaviguer('accueil')}>
          Héraldique
        </h1>
      </div>
      <nav className="header-nav">
        <button
          className={`nav-btn ${vue === 'accueil' ? 'nav-active' : ''}`}
          onClick={() => onNaviguer('accueil')}
        >
          Jouer
        </button>
        <button
          className={`nav-btn ${vue === 'reference' ? 'nav-active' : ''}`}
          onClick={() => onNaviguer('reference')}
        >
          Référence
        </button>
        <button
          className={`nav-btn ${vue === 'parametres' ? 'nav-active' : ''}`}
          onClick={() => onNaviguer('parametres')}
        >
          Paramètres
        </button>
      </nav>
      <div className="header-xp">
        {etat.xp} XP
      </div>
    </header>
  );
}
