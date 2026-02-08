/** Types héraldiques français */

export type TypeEmail = 'metal' | 'couleur';

export interface Email {
  id: string;
  nom: string;
  hex: string;
  type: TypeEmail;
  hachures: 'points' | 'horizontal' | 'vertical' | 'diagonale-gauche' | 'diagonale-droite' | 'croise' | 'aucune';
}

export type IdPartition =
  | 'plein'
  | 'parti'
  | 'coupe'
  | 'tranche'
  | 'taille'
  | 'ecartele'
  | 'ecartele-en-sautoir'
  | 'tierce-en-fasce'
  | 'tierce-en-pal';

export interface Partition {
  id: IdPartition;
  nom: string;
  description: string;
  zones: number; // nombre de zones (2 ou 4)
}

export type IdPiece =
  | 'fasce'
  | 'pal'
  | 'bande'
  | 'barre'
  | 'chevron'
  | 'croix'
  | 'sautoir'
  | 'chef'
  | 'champagne'
  | 'bordure';

export interface Piece {
  id: IdPiece;
  nom: string;
  description: string;
}

export type IdMeuble =
  | 'lion'
  | 'leopard'
  | 'aigle'
  | 'fleur-de-lys'
  | 'etoile'
  | 'croissant'
  | 'tour'
  | 'epee'
  | 'arbre'
  | 'cerf'
  | 'coquille';

export type PositionMeuble =
  | 'en-coeur'
  | 'en-chef'
  | 'en-pointe'
  | 'en-canton-dextre-du-chef'
  | 'en-canton-senestre-du-chef';

export interface Meuble {
  id: IdMeuble;
  nom: string;
  description: string;
}

export interface MeublePose {
  meuble: IdMeuble;
  email: string;
  position: PositionMeuble;
}

export interface Blason {
  partition: IdPartition;
  emaux: string[]; // IDs des émaux pour chaque zone de la partition
  piece?: {
    id: IdPiece;
    email: string;
  };
  meubles: MeublePose[];
}
