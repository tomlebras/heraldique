import type { Exercice } from '../../types/game';
import { EMAUX } from '../tinctures';
import { melanger } from '../../engine/generator';

/** Génère les exercices du niveau 1 : identification des émaux */
export function genererExercicesNiveau1(): Exercice[] {
  const exercices: Exercice[] = [];

  // Type 1 : Identifier l'émail par sa couleur (QCM)
  for (const email of EMAUX) {
    const autresEmaux = melanger(EMAUX.filter((e) => e.id !== email.id)).slice(0, 3);
    const choix = melanger([email, ...autresEmaux].map((e) => e.nom));

    exercices.push({
      id: `n1-identifier-${email.id}`,
      niveau: 1,
      mode: 'qcm',
      question: `Quel est le nom de cet émail ?`,
      choix,
      reponse: email.nom,
      blason: { partition: 'plein', emaux: [email.id], meubles: [] },
    });
  }

  // Type 2 : Identifier le type (métal ou couleur)
  for (const email of EMAUX) {
    exercices.push({
      id: `n1-type-${email.id}`,
      niveau: 1,
      mode: 'qcm',
      question: `L'émail « ${email.nom} » est-il un métal ou une couleur ?`,
      choix: ['Métal', 'Couleur'],
      reponse: email.type === 'metal' ? 'Métal' : 'Couleur',
      blason: { partition: 'plein', emaux: [email.id], meubles: [] },
    });
  }

  // Type 3 : Règle des émaux
  const pairesValides = [
    ['or', 'gueules'], ['or', 'azur'], ['argent', 'sinople'], ['argent', 'sable'],
  ];
  const pairesInvalides = [
    ['or', 'argent'], ['gueules', 'azur'], ['sinople', 'sable'],
  ];

  for (const [a, b] of pairesValides) {
    const emailA = EMAUX.find((e) => e.id === a)!;
    const emailB = EMAUX.find((e) => e.id === b)!;
    exercices.push({
      id: `n1-regle-valide-${a}-${b}`,
      niveau: 1,
      mode: 'qcm',
      question: `Peut-on poser du ${emailB.nom} sur du ${emailA.nom} ?`,
      choix: ['Oui, c\'est correct', 'Non, ça viole la règle des émaux'],
      reponse: 'Oui, c\'est correct',
      blason: { partition: 'parti', emaux: [a, b], meubles: [] },
      indice: 'La règle des émaux interdit métal sur métal et couleur sur couleur.',
    });
  }

  for (const [a, b] of pairesInvalides) {
    const emailA = EMAUX.find((e) => e.id === a)!;
    const emailB = EMAUX.find((e) => e.id === b)!;
    exercices.push({
      id: `n1-regle-invalide-${a}-${b}`,
      niveau: 1,
      mode: 'qcm',
      question: `Peut-on poser du ${emailB.nom} sur du ${emailA.nom} ?`,
      choix: ['Oui, c\'est correct', 'Non, ça viole la règle des émaux'],
      reponse: 'Non, ça viole la règle des émaux',
      blason: { partition: 'parti', emaux: [a, b], meubles: [] },
      indice: 'La règle des émaux interdit métal sur métal et couleur sur couleur.',
    });
  }

  return melanger(exercices);
}
