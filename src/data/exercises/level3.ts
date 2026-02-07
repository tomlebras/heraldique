import type { Exercice } from '../../types/game';
import { EMAUX } from '../tinctures';
import { PIECES } from '../ordinaries';
import { melanger } from '../../engine/generator';
import { blasonner } from '../../engine/blazon';

/** Génère les exercices du niveau 3 : pièces honorables */
export function genererExercicesNiveau3(): Exercice[] {
  const exercices: Exercice[] = [];

  // Type 1 : Identifier la pièce (texte libre)
  for (const piece of PIECES) {
    const metal = melanger(EMAUX.filter((e) => e.type === 'metal'))[0];
    const couleur = melanger(EMAUX.filter((e) => e.type === 'couleur'))[0];

    exercices.push({
      id: `n3-identifier-${piece.id}`,
      niveau: 3,
      mode: 'identification',
      question: 'Quelle est cette pièce honorable ?',
      reponse: piece.nom,
      blason: {
        partition: 'plein',
        emaux: [couleur.id],
        piece: { id: piece.id, email: metal.id },
        meubles: [],
      },
      indice: 'Ex : Fasce, Pal, Bande, Chevron, Croix…',
    });
  }

  // Type 2 : Blasonnement texte libre
  const combinaisons = [
    { champ: 'azur', piece: 'fasce', emailPiece: 'or' },
    { champ: 'gueules', piece: 'pal', emailPiece: 'argent' },
    { champ: 'sinople', piece: 'bande', emailPiece: 'or' },
    { champ: 'sable', piece: 'chevron', emailPiece: 'argent' },
    { champ: 'or', piece: 'chef', emailPiece: 'azur' },
    { champ: 'argent', piece: 'croix', emailPiece: 'gueules' },
    { champ: 'or', piece: 'bordure', emailPiece: 'sinople' },
    { champ: 'azur', piece: 'sautoir', emailPiece: 'or' },
  ] as const;

  for (const combo of combinaisons) {
    const blason = {
      partition: 'plein' as const,
      emaux: [combo.champ],
      piece: { id: combo.piece, email: combo.emailPiece },
      meubles: [],
    };

    exercices.push({
      id: `n3-blasonner-${combo.piece}-${combo.champ}`,
      niveau: 3,
      mode: 'blasonnement',
      question: 'Blasonnez cet écu (décrivez-le en termes héraldiques).',
      reponse: blasonner(blason),
      blason,
      indice: `L'écu contient une pièce honorable appelée « ${PIECES.find((p) => p.id === combo.piece)?.nom} ».`,
    });
  }

  // Type 3 : Description → identifier la pièce (texte libre)
  for (const piece of PIECES) {
    exercices.push({
      id: `n3-description-${piece.id}`,
      niveau: 3,
      mode: 'identification',
      question: `Quelle pièce correspond à cette description : « ${piece.description} » ?`,
      reponse: piece.nom,
      indice: 'Ex : Fasce, Pal, Bande, Chevron…',
    });
  }

  return melanger(exercices);
}
