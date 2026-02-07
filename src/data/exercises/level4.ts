import type { Exercice } from '../../types/game';
import type { MeublePose, IdMeuble } from '../../types/heraldry';
import { EMAUX } from '../tinctures';
import { MEUBLES } from '../charges';
import { melanger } from '../../engine/generator';
import { blasonner } from '../../engine/blazon';

/** Génère les exercices du niveau 4 : meubles */
export function genererExercicesNiveau4(): Exercice[] {
  const exercices: Exercice[] = [];

  // Type 1 : Identifier le meuble (QCM)
  for (const meuble of MEUBLES) {
    const couleur = melanger(EMAUX.filter((e) => e.type === 'couleur'))[0];
    const metal = melanger(EMAUX.filter((e) => e.type === 'metal'))[0];

    const autresMeubles = melanger(MEUBLES.filter((m) => m.id !== meuble.id)).slice(0, 3);
    const choix = melanger([meuble, ...autresMeubles].map((m) => m.nom));

    const meublePose: MeublePose = {
      meuble: meuble.id as IdMeuble,
      email: metal.id,
      position: 'en-coeur',
    };

    exercices.push({
      id: `n4-identifier-${meuble.id}`,
      niveau: 4,
      mode: 'qcm',
      question: 'Quel est ce meuble héraldique ?',
      choix,
      reponse: meuble.nom,
      blason: {
        partition: 'plein',
        emaux: [couleur.id],
        meubles: [meublePose],
      },
    });
  }

  // Type 2 : Blasonnement de blasons avec meubles
  const combinaisons = [
    { champ: 'azur', meuble: 'fleur-de-lys' as IdMeuble, emailMeuble: 'or' },
    { champ: 'gueules', meuble: 'lion' as IdMeuble, emailMeuble: 'or' },
    { champ: 'sinople', meuble: 'etoile' as IdMeuble, emailMeuble: 'argent' },
    { champ: 'sable', meuble: 'tour' as IdMeuble, emailMeuble: 'argent' },
    { champ: 'azur', meuble: 'aigle' as IdMeuble, emailMeuble: 'or' },
    { champ: 'or', meuble: 'croissant' as IdMeuble, emailMeuble: 'azur' },
  ];

  for (const combo of combinaisons) {
    const blason = {
      partition: 'plein' as const,
      emaux: [combo.champ],
      meubles: [{
        meuble: combo.meuble,
        email: combo.emailMeuble,
        position: 'en-coeur' as const,
      }],
    };

    exercices.push({
      id: `n4-blasonner-${combo.meuble}`,
      niveau: 4,
      mode: 'blasonnement',
      question: 'Blasonnez cet écu.',
      reponse: blasonner(blason),
      blason,
      indice: `Le meuble représenté est un(e) ${MEUBLES.find((m) => m.id === combo.meuble)?.nom?.toLowerCase()}.`,
    });
  }

  // Type 3 : Blasons composés (partition + meuble)
  const composes = [
    {
      partition: 'parti' as const,
      emaux: ['or', 'azur'],
      meuble: 'fleur-de-lys' as IdMeuble,
      emailMeuble: 'azur',
    },
    {
      partition: 'coupe' as const,
      emaux: ['gueules', 'argent'],
      meuble: 'lion' as IdMeuble,
      emailMeuble: 'or',
    },
  ];

  for (const combo of composes) {
    const blason = {
      partition: combo.partition,
      emaux: combo.emaux,
      meubles: [{
        meuble: combo.meuble,
        email: combo.emailMeuble,
        position: 'en-coeur' as const,
      }],
    };

    exercices.push({
      id: `n4-compose-${combo.partition}-${combo.meuble}`,
      niveau: 4,
      mode: 'blasonnement',
      question: 'Blasonnez cet écu composé.',
      reponse: blasonner(blason),
      blason,
    });
  }

  return melanger(exercices);
}
