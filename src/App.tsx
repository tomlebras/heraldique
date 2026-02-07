import { useState } from 'react';
import { GameProvider } from './context/GameContext';
import Header from './components/ui/Header';
import LevelSelector from './components/game/LevelSelector';
import ExerciseView from './components/game/ExerciseView';
import ReferenceCards from './components/ui/ReferenceCards';
import './styles/global.css';
import './styles/shield.css';
import './styles/game.css';

type Vue = 'accueil' | 'jeu' | 'reference';

function AppContent() {
  const [vue, setVue] = useState<Vue>('accueil');

  return (
    <div className="app">
      <Header vue={vue} onNaviguer={(v) => setVue(v as Vue)} />
      <main className="app-main">
        {vue === 'accueil' && (
          <LevelSelector onCommencer={() => setVue('jeu')} />
        )}
        {vue === 'jeu' && (
          <ExerciseView onRetour={() => setVue('accueil')} />
        )}
        {vue === 'reference' && (
          <ReferenceCards />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
