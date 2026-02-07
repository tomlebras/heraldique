import type { Exercice } from '../../types/game';
import type { IdPartition } from '../../types/heraldry';
import { EMAUX } from '../tinctures';
import { PARTITIONS } from '../partitions';
import { melanger } from '../../engine/generator';

/** Génère les exercices du niveau 2 : partitions */
export function genererExercicesNiveau2(): Exercice[] {
  const exercices: Exercice[] = [];
  const partitionsJouables = PARTITIONS.filter((p) => p.id !== 'plein');

  // Type 1 : Identifier la partition (texte libre)
  for (const partition of partitionsJouables) {
    const metal = melanger(EMAUX.filter((e) => e.type === 'metal'))[0];
    const couleur = melanger(EMAUX.filter((e) => e.type === 'couleur'))[0];
    const nbZones = partition.zones;
    const emaux = Array.from({ length: nbZones }, (_, i) =>
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
    { partition: 'ecartele' as IdPartition, emaux: ['gueules', 'or', 'gueules', 'or'] },
  ];

  for (const combo of combinaisons) {
    const p = PARTITIONS.find((p) => p.id === combo.partition)!;
    const e1 = EMAUX.find((e) => e.id === combo.emaux[0])!;
    const e2 = EMAUX.find((e) => e.id === combo.emaux[1])!;

    let bonneReponse: string;
    if (combo.partition === 'ecartele') {
      bonneReponse = `Écartelé, au 1 et 4 d'${e1.nom.toLowerCase()}, au 2 et 3 d'${e2.nom.toLowerCase()}`;
    } else {
      bonneReponse = `${p.nom}, d'${e1.nom.toLowerCase()} et d'${e2.nom.toLowerCase()}`;
    }

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
