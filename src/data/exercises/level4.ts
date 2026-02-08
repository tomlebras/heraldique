import type { Exercice } from '../../types/game';
import type { MeublePose, IdMeuble } from '../../types/heraldry';
import { EMAUX } from '../tinctures';
import { MEUBLES } from '../charges';
import { melanger } from '../../engine/generator';
import { blasonner } from '../../engine/blazon';

/** Génère les exercices du niveau 4 : meubles */
export function genererExercicesNiveau4(): Exercice[] {
  const exercices: Exercice[] = [];

  // Type 1 : Identifier le meuble (texte libre)
  for (const meuble of MEUBLES) {
    const couleur = melanger(EMAUX.filter((e) => e.type === 'couleur'))[0];
    const metal = melanger(EMAUX.filter((e) => e.type === 'metal'))[0];

    const meublePose: MeublePose = {
      meuble: meuble.id as IdMeuble,
      email: metal.id,
      position: 'en-coeur',
    };

    exercices.push({
      id: `n4-identifier-${meuble.id}`,
      niveau: 4,
      mode: 'identification',
      question: 'Quel est ce meuble héraldique ?',
      reponse: meuble.nom,
      blason: {
        partition: 'plein',
        emaux: [couleur.id],
        meubles: [meublePose],
      },
      indice: 'Ex : Lion, Aigle, Fleur de lys, Étoile…',
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

  // Type 4 : Mode construction — assembler le blason décrit
  const constructions = [
    {
      description: 'Construisez : « Parti, d\'or et de gueules »',
      blason: { partition: 'parti' as const, emaux: ['or', 'gueules'], meubles: [] },
    },
    {
      description: 'Construisez : « Coupé, d\'azur et d\'argent »',
      blason: { partition: 'coupe' as const, emaux: ['azur', 'argent'], meubles: [] },
    },
    {
      description: 'Construisez : « Tranché, d\'argent et de sinople »',
      blason: { partition: 'tranche' as const, emaux: ['argent', 'sinople'], meubles: [] },
    },
    {
      description: 'Construisez : « Écartelé, d\'or et d\'azur »',
      blason: { partition: 'ecartele' as const, emaux: ['or', 'azur', 'azur', 'or'], meubles: [] },
    },
  ];

  for (const c of constructions) {
    exercices.push({
      id: `n4-construction-${c.blason.partition}`,
      niveau: 4,
      mode: 'construction',
      question: c.description,
      reponse: blasonner(c.blason),
      blason: c.blason,
    });
  }

  return melanger(exercices);
}
