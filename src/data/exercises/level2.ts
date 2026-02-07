import type { Exercice } from '../../types/game';
import type { IdPartition } from '../../types/heraldry';
import { EMAUX } from '../tinctures';
import { PARTITIONS } from '../partitions';
import { melanger } from '../../engine/generator';

/** Génère les exercices du niveau 2 : partitions */
export function genererExercicesNiveau2(): Exercice[] {
  const exercices: Exercice[] = [];
  const partitionsJouables = PARTITIONS.filter((p) => p.id !== 'plein');

  // Type 1 : Identifier la partition (QCM)
  for (const partition of partitionsJouables) {
    const metal = melanger(EMAUX.filter((e) => e.type === 'metal'))[0];
    const couleur = melanger(EMAUX.filter((e) => e.type === 'couleur'))[0];
    const nbZones = partition.zones;
    const emaux = Array.from({ length: nbZones }, (_, i) =>
      i % 2 === 0 ? metal.id : couleur.id
    );

    const autresPartitions = melanger(partitionsJouables.filter((p) => p.id !== partition.id)).slice(0, 3);
    const choix = melanger([partition, ...autresPartitions].map((p) => p.nom));

    exercices.push({
      id: `n2-identifier-${partition.id}`,
      niveau: 2,
      mode: 'qcm',
      question: 'Comment s\'appelle cette partition ?',
      choix,
      reponse: partition.nom,
      blason: { partition: partition.id as IdPartition, emaux, meubles: [] },
    });
  }

  // Type 2 : Blasonner une partition simple (QCM avec textes)
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

    // Générer des mauvaises réponses
    const faux1 = `${p.nom}, d'${e2.nom.toLowerCase()} et d'${e1.nom.toLowerCase()}`; // émaux inversés
    const autreP = melanger(PARTITIONS.filter((pp) => pp.id !== combo.partition && pp.id !== 'plein'))[0];
    const faux2 = `${autreP.nom}, d'${e1.nom.toLowerCase()} et d'${e2.nom.toLowerCase()}`; // mauvaise partition
    const autreE = melanger(EMAUX.filter((e) => e.id !== combo.emaux[0] && e.id !== combo.emaux[1]))[0];
    const faux3 = `${p.nom}, d'${e1.nom.toLowerCase()} et d'${autreE.nom.toLowerCase()}`; // mauvais émail

    exercices.push({
      id: `n2-blasonner-${combo.partition}-${combo.emaux.join('-')}`,
      niveau: 2,
      mode: 'qcm',
      question: 'Quel est le blasonnement correct de cet écu ?',
      choix: melanger([bonneReponse, faux1, faux2, faux3]),
      reponse: bonneReponse,
      blason: { partition: combo.partition, emaux: combo.emaux, meubles: [] },
    });
  }

  // Type 3 : Description → blason correct
  for (const partition of partitionsJouables.slice(0, 5)) {
    exercices.push({
      id: `n2-description-${partition.id}`,
      niveau: 2,
      mode: 'qcm',
      question: `Quelle partition divise l'écu ainsi : « ${partition.description} » ?`,
      choix: melanger(partitionsJouables.slice(0, 5).map((p) => p.nom)),
      reponse: partition.nom,
    });
  }

  return melanger(exercices);
}
