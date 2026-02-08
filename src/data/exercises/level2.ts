import type { Exercice } from '../../types/game';
import type { IdPartition } from '../../types/heraldry';
import { EMAUX } from '../tinctures';
import { PARTITIONS } from '../partitions';
import { melanger } from '../../engine/generator';
import { blasonner } from '../../engine/blazon';

/** Génère les exercices du niveau 2 : partitions */
export function genererExercicesNiveau2(): Exercice[] {
  const exercices: Exercice[] = [];
  const partitionsJouables = PARTITIONS.filter((p) => p.id !== 'plein');

  // Type 1 : Identifier la partition (texte libre)
  for (const partition of partitionsJouables) {
    const metal = melanger(EMAUX.filter((e) => e.type === 'metal'))[0];
    const couleur = melanger(EMAUX.filter((e) => e.type === 'couleur'))[0];
    const nbZones = partition.zones;
    // Écartelé / écartelé en sautoir : 1&4 même, 2&3 même (évite parti/taillé visuels)
    const emaux = (partition.id === 'ecartele' || partition.id === 'ecartele-en-sautoir')
      ? [metal.id, couleur.id, couleur.id, metal.id]
      : Array.from({ length: nbZones }, (_, i) =>
          i % 2 === 0 ? metal.id : couleur.id
        );

    exercices.push({
      id: `n2-identifier-${partition.id}`,
      niveau: 2,
      mode: 'identification',
      question: 'Comment s\'appelle cette partition ?',
      reponse: partition.nom,
      blason: { partition: partition.id as IdPartition, emaux, meubles: [] },
      indice: 'Ex : Parti, Coupé, Tranché, Écartelé…',
    });
  }

  // Type 2 : Blasonner une partition simple (texte libre)
  const combinaisons = [
    { partition: 'parti' as IdPartition, emaux: ['or', 'gueules'] },
    { partition: 'coupe' as IdPartition, emaux: ['azur', 'argent'] },
    { partition: 'tranche' as IdPartition, emaux: ['argent', 'sinople'] },
    { partition: 'taille' as IdPartition, emaux: ['or', 'sable'] },
    { partition: 'ecartele' as IdPartition, emaux: ['gueules', 'or', 'or', 'gueules'] },
  ];

  for (const combo of combinaisons) {
    const p = PARTITIONS.find((p) => p.id === combo.partition)!;
    // Utilise blasonner() pour un blasonnement correct (élision, forme simple écartelé)
    const bonneReponse = blasonner({ partition: combo.partition, emaux: combo.emaux, meubles: [] });

    exercices.push({
      id: `n2-blasonner-${combo.partition}-${combo.emaux.join('-')}`,
      niveau: 2,
      mode: 'blasonnement',
      question: 'Blasonnez cet écu (décrivez sa partition et ses émaux).',
      reponse: bonneReponse,
      blason: { partition: combo.partition, emaux: combo.emaux, meubles: [] },
      indice: `L'écu est ${p.nom.toLowerCase()}.`,
    });
  }

  // Type 3 : Description → partition (texte libre)
  for (const partition of partitionsJouables.slice(0, 5)) {
    exercices.push({
      id: `n2-description-${partition.id}`,
      niveau: 2,
      mode: 'identification',
      question: `Quelle partition divise l'écu ainsi : « ${partition.description} » ?`,
      reponse: partition.nom,
      indice: 'Ex : Parti, Coupé, Tranché…',
    });
  }

  return melanger(exercices);
}
