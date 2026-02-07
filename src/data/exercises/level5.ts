import type { Exercice } from '../../types/game';
import type { Blason, IdMeuble, IdPiece } from '../../types/heraldry';
import { melanger } from '../../engine/generator';
import { blasonner } from '../../engine/blazon';

/** Blasons historiques français */
const BLASONS_HISTORIQUES: { nom: string; blason: Blason; description: string }[] = [
  {
    nom: 'Royaume de France',
    description: 'Les armes du Royaume de France (France moderne)',
    blason: {
      partition: 'plein',
      emaux: ['azur'],
      meubles: [
        { meuble: 'fleur-de-lys' as IdMeuble, email: 'or', position: 'en-chef' },
        { meuble: 'fleur-de-lys' as IdMeuble, email: 'or', position: 'en-canton-dextre-du-chef' },
        { meuble: 'fleur-de-lys' as IdMeuble, email: 'or', position: 'en-pointe' },
      ],
    },
  },
  {
    nom: 'Ville de Paris',
    description: 'Armes de la ville de Paris (simplifié)',
    blason: {
      partition: 'coupe',
      emaux: ['azur', 'gueules'],
      meubles: [
        { meuble: 'fleur-de-lys' as IdMeuble, email: 'or', position: 'en-chef' },
      ],
    },
  },
  {
    nom: 'Normandie',
    description: 'Armes du duché de Normandie (simplifié)',
    blason: {
      partition: 'plein',
      emaux: ['gueules'],
      meubles: [
        { meuble: 'lion' as IdMeuble, email: 'or', position: 'en-coeur' },
      ],
    },
  },
  {
    nom: 'Bretagne',
    description: 'Armes du duché de Bretagne (simplifié)',
    blason: {
      partition: 'plein',
      emaux: ['argent'],
      piece: { id: 'croix' as IdPiece, email: 'sable' },
      meubles: [],
    },
  },
  {
    nom: 'Bourgogne',
    description: 'Armes anciennes du duché de Bourgogne',
    blason: {
      partition: 'plein',
      emaux: ['azur'],
      piece: { id: 'bordure' as IdPiece, email: 'gueules' },
      meubles: [
        { meuble: 'fleur-de-lys' as IdMeuble, email: 'or', position: 'en-coeur' },
      ],
    },
  },
];

/** Génère les exercices du niveau 5 : blasons historiques et compositions complexes */
export function genererExercicesNiveau5(): Exercice[] {
  const exercices: Exercice[] = [];

  // Type 1 : Identifier le blason historique (texte libre)
  for (const bh of BLASONS_HISTORIQUES) {
    exercices.push({
      id: `n5-historique-${bh.nom.replace(/\s/g, '-').toLowerCase()}`,
      niveau: 5,
      mode: 'identification',
      question: 'À qui appartiennent ces armoiries ?',
      reponse: bh.nom,
      blason: bh.blason,
      indice: 'Ex : Royaume de France, Normandie, Bretagne…',
    });
  }

  // Type 2 : Blasonnement de blasons historiques
  for (const bh of BLASONS_HISTORIQUES) {
    exercices.push({
      id: `n5-blasonner-${bh.nom.replace(/\s/g, '-').toLowerCase()}`,
      niveau: 5,
      mode: 'blasonnement',
      question: `Blasonnez les armes « ${bh.nom} ».`,
      reponse: blasonner(bh.blason),
      blason: bh.blason,
    });
  }

  // Type 3 : Compositions complexes
  const complexes: Blason[] = [
    {
      partition: 'ecartele',
      emaux: ['azur', 'gueules', 'azur', 'gueules'],
      piece: { id: 'croix' as IdPiece, email: 'or' },
      meubles: [],
    },
    {
      partition: 'parti',
      emaux: ['or', 'azur'],
      piece: { id: 'chef' as IdPiece, email: 'gueules' },
      meubles: [
        { meuble: 'etoile' as IdMeuble, email: 'argent', position: 'en-coeur' },
      ],
    },
  ];

  for (let i = 0; i < complexes.length; i++) {
    exercices.push({
      id: `n5-complexe-${i}`,
      niveau: 5,
      mode: 'blasonnement',
      question: 'Blasonnez cette composition complexe.',
      reponse: blasonner(complexes[i]),
      blason: complexes[i],
    });
  }

  return melanger(exercices);
}
