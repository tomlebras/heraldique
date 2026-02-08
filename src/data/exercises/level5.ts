import type { Exercice } from '../../types/game';
import type { Blason, IdMeuble, IdPiece } from '../../types/heraldry';
import { melanger } from '../../engine/generator';
import { blasonner } from '../../engine/blazon';

/** Blasons historiques français */
export const BLASONS_HISTORIQUES: { nom: string; blason: Blason; description: string; dates: string }[] = [
  {
    nom: 'Royaume de France',
    description: 'France moderne : d\'azur, à trois fleurs de lys d\'or',
    dates: '1376–1792',
    blason: {
      partition: 'plein',
      emaux: ['azur'],
      meubles: [
        { meuble: 'fleur-de-lys' as IdMeuble, email: 'or', position: 'en-canton-dextre-du-chef' },
        { meuble: 'fleur-de-lys' as IdMeuble, email: 'or', position: 'en-canton-senestre-du-chef' },
        { meuble: 'fleur-de-lys' as IdMeuble, email: 'or', position: 'en-pointe' },
      ],
    },
  },
  {
    nom: 'Normandie',
    description: 'De gueules, à deux léopards d\'or',
    dates: 'XIIe siècle',
    blason: {
      partition: 'plein',
      emaux: ['gueules'],
      meubles: [
        { meuble: 'leopard' as IdMeuble, email: 'or', position: 'en-coeur-chef' },
        { meuble: 'leopard' as IdMeuble, email: 'or', position: 'en-coeur-pointe' },
      ],
    },
  },
  {
    nom: 'Bretagne',
    description: 'D\'hermine plain',
    dates: '1316–1532',
    blason: {
      partition: 'plein',
      emaux: ['hermine'],
      meubles: [],
    },
  },
  {
    nom: 'Bourgogne',
    description: 'Ancien : d\'azur, semé de fleurs de lys d\'or, à la bordure componée d\'argent et de gueules (simplifié)',
    dates: 'XIVe siècle',
    blason: {
      partition: 'plein',
      emaux: ['azur'],
      piece: { id: 'bordure' as IdPiece, email: 'gueules' },
      meubles: [
        { meuble: 'fleur-de-lys' as IdMeuble, email: 'or', position: 'en-coeur' },
      ],
    },
  },
  {
    nom: 'Aquitaine',
    description: 'De gueules, au léopard d\'or',
    dates: 'XIIe siècle',
    blason: {
      partition: 'plein',
      emaux: ['gueules'],
      meubles: [
        { meuble: 'leopard' as IdMeuble, email: 'or', position: 'en-coeur' },
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
      indice: 'Ex : Royaume de France, Normandie, Bretagne, Aquitaine…',
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
      emaux: ['azur', 'gueules', 'gueules', 'azur'],
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
