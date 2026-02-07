import { useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import type { Exercice } from '../../types/game';
import type { Blason, IdPartition } from '../../types/heraldry';
import { EMAUX } from '../../data/tinctures';
import { PARTITIONS } from '../../data/partitions';
import CoatOfArmsRenderer from '../svg/CoatOfArmsRenderer';
import AnswerFeedback from './AnswerFeedback';
import DraggableItem from './DraggableItem';
import DroppableZone from './DroppableZone';

interface Props {
  exercice: Exercice;
  onReponse: (reponse: string, correct: boolean) => void;
}

/** Mode construction : assembler un blason par drag & drop */
export default function BuildMode({ exercice, onReponse }: Props) {
  const [blasonConstruit, setBlasonConstruit] = useState<Blason>({
    partition: 'plein',
    emaux: ['argent'],
    meubles: [],
  });
  const [resultat, setResultat] = useState<boolean | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null);
    const { active, over } = event;
    if (!over) return;

    const itemId = active.id as string;
    const zone = over.id as string;

    // Déterminer le type d'élément déposé
    if (itemId.startsWith('email-') && zone.startsWith('zone-')) {
      const emailId = itemId.replace('email-', '');
      const zoneIndex = parseInt(zone.replace('zone-', ''));
      setBlasonConstruit((prev) => {
        const emaux = [...prev.emaux];
        emaux[zoneIndex] = emailId;
        return { ...prev, emaux };
      });
    } else if (itemId.startsWith('partition-')) {
      const partitionId = itemId.replace('partition-', '') as IdPartition;
      const partition = PARTITIONS.find((p) => p.id === partitionId);
      if (partition) {
        setBlasonConstruit((prev) => ({
          ...prev,
          partition: partitionId,
          emaux: Array.from({ length: partition.zones }, (_, i) => prev.emaux[i] || 'argent'),
        }));
      }
    }
  };

  const handleValider = () => {
    if (!exercice.blason) return;
    const attendu = exercice.blason;
    const correct =
      blasonConstruit.partition === attendu.partition &&
      blasonConstruit.emaux.every((e, i) => e === attendu.emaux[i]);
    setResultat(correct);
  };

  const handleSuivant = () => {
    onReponse(JSON.stringify(blasonConstruit), resultat ?? false);
    setBlasonConstruit({ partition: 'plein', emaux: ['argent'], meubles: [] });
    setResultat(null);
  };

  const partition = PARTITIONS.find((p) => p.id === blasonConstruit.partition);
  const nbZones = partition?.zones ?? 1;

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="exercise-container build-mode">
        <h3 className="exercise-question">{exercice.question}</h3>

        <div className="build-layout">
          {/* Palette d'éléments */}
          <div className="build-palette">
            <h4>Partitions</h4>
            <div className="palette-grid">
              {PARTITIONS.filter((p) => p.id !== 'plein').slice(0, 5).map((p) => (
                <DraggableItem key={`partition-${p.id}`} id={`partition-${p.id}`}>
                  <div className="palette-item">{p.nom}</div>
                </DraggableItem>
              ))}
            </div>

            <h4>Émaux</h4>
            <div className="palette-grid">
              {EMAUX.map((e) => (
                <DraggableItem key={`email-${e.id}`} id={`email-${e.id}`}>
                  <div className="palette-item palette-email" style={{ borderColor: e.hex }}>
                    <div className="palette-swatch" style={{ backgroundColor: e.hex }} />
                    {e.nom}
                  </div>
                </DraggableItem>
              ))}
            </div>
          </div>

          {/* Zone de construction */}
          <div className="build-canvas">
            <div className="build-shield-preview">
              <CoatOfArmsRenderer blason={blasonConstruit} />
            </div>

            <div className="build-zones">
              {Array.from({ length: nbZones }, (_, i) => (
                <DroppableZone key={`zone-${i}`} id={`zone-${i}`}>
                  <div className="drop-zone">
                    Zone {i + 1} : <strong>{EMAUX.find((e) => e.id === blasonConstruit.emaux[i])?.nom ?? '—'}</strong>
                  </div>
                </DroppableZone>
              ))}
            </div>

            {resultat === null && (
              <button className="btn btn-primary" onClick={handleValider} style={{ marginTop: 16 }}>
                Valider
              </button>
            )}
          </div>
        </div>

        <DragOverlay>
          {activeDragId && (
            <div className="palette-item drag-overlay">
              {activeDragId.startsWith('email-')
                ? EMAUX.find((e) => e.id === activeDragId.replace('email-', ''))?.nom
                : PARTITIONS.find((p) => p.id === activeDragId.replace('partition-', ''))?.nom}
            </div>
          )}
        </DragOverlay>

        <AnswerFeedback
          correct={resultat}
          bonneReponse={exercice.reponse}
          onSuivant={handleSuivant}
        />
      </div>
    </DndContext>
  );
}
