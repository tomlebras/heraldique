/** Glossaire héraldique — termes techniques avec définitions pour tooltips */

export interface HeraldryTerm {
  term: string;
  definition: string;
  category: 'posture' | 'attribut' | 'position' | 'general';
}

export const GLOSSARY: HeraldryTerm[] = [
  // Postures des animaux
  { term: 'rampant', definition: 'Dressé sur ses pattes arrière, de profil. Posture par défaut du lion.', category: 'posture' },
  { term: 'passant', definition: 'Marchant, trois pattes au sol, une patte avant levée. Posture du léopard.', category: 'posture' },
  { term: 'éployé', definition: 'Ailes étendues et ouvertes. Se dit principalement de l\'aigle (féminin en héraldique : « éployée »).', category: 'posture' },
  { term: 'issant', definition: 'Qui semble sortir d\'une pièce ou du bord de l\'écu (seule la moitié supérieure est visible).', category: 'posture' },
  { term: 'naissant', definition: 'Comme issant, mais coupé au niveau de la ceinture.', category: 'posture' },
  { term: 'couché', definition: 'Animal allongé, au repos, les pattes repliées sous lui.', category: 'posture' },
  { term: 'courant', definition: 'Animal en pleine course, les quatre pattes étendues.', category: 'posture' },
  { term: 'arrêté', definition: 'Animal immobile, debout sur ses quatre pattes (cerf, cheval).', category: 'posture' },
  { term: 'contourné', definition: 'Tourné vers senestre (la gauche du porteur, droite du spectateur). Inverse de la position normale.', category: 'posture' },
  { term: 'affronté', definition: 'Deux figures tournées face à face.', category: 'posture' },
  { term: 'adossé', definition: 'Deux figures dos à dos.', category: 'posture' },

  // Attributs spécifiques
  { term: 'armé', definition: 'Dont les griffes sont d\'un émail différent du corps.', category: 'attribut' },
  { term: 'lampassé', definition: 'Dont la langue est d\'un émail différent du corps.', category: 'attribut' },
  { term: 'couronné', definition: 'Portant une couronne. On précise l\'émail si différent du corps.', category: 'attribut' },
  { term: 'vilené', definition: 'Dont le sexe est d\'un émail différent (pour le lion).', category: 'attribut' },
  { term: 'allumé', definition: 'Dont les yeux sont d\'un émail différent du corps.', category: 'attribut' },
  { term: 'becqué', definition: 'Dont le bec est d\'un émail différent (oiseaux).', category: 'attribut' },
  { term: 'membré', definition: 'Dont les pattes sont d\'un émail différent (oiseaux).', category: 'attribut' },
  { term: 'onglé', definition: 'Dont les ongles ou sabots sont d\'un émail différent.', category: 'attribut' },
  { term: 'colleté', definition: 'Portant un collier, souvent d\'un émail différent.', category: 'attribut' },
  { term: 'arraché', definition: 'Dont les racines sont visibles (arbre) ou dont la tête est arrachée (animal).', category: 'attribut' },

  // Positions sur l'écu
  { term: 'en cœur', definition: 'Au centre de l\'écu. Position par défaut des meubles.', category: 'position' },
  { term: 'en chef', definition: 'Dans le tiers supérieur de l\'écu.', category: 'position' },
  { term: 'en pointe', definition: 'Dans le tiers inférieur de l\'écu.', category: 'position' },
  { term: 'en abîme', definition: 'Au centre exact de l\'écu, plus petit que le meuble principal.', category: 'position' },
  { term: 'brochant', definition: 'Posé par-dessus d\'autres figures, les recouvrant partiellement.', category: 'position' },

  // Termes généraux
  { term: 'cousu', definition: 'Se dit d\'une pièce (surtout le chef) qui enfreint la règle des émaux (couleur sur couleur ou métal sur métal) mais est tolérée par convention.', category: 'general' },
  { term: 'blasonnement', definition: 'Description codifiée d\'un blason dans un langage héraldique précis.', category: 'general' },
  { term: 'écu', definition: 'Support principal du blason, en forme de bouclier.', category: 'general' },
  { term: 'champ', definition: 'Surface de l\'écu sur laquelle sont posées les figures.', category: 'general' },
  { term: 'meuble', definition: 'Figure quelconque posée sur le champ de l\'écu (animal, objet, plante…).', category: 'general' },
  { term: 'pièce', definition: 'Figure géométrique formée par les lignes de partition de l\'écu.', category: 'general' },
  { term: 'émail', definition: 'Teinture utilisée en héraldique. Se divise en métaux (or, argent), couleurs (gueules, azur, sinople, sable, pourpre) et fourrures (hermine, vair…).', category: 'general' },
  { term: 'lionceau', definition: 'Lion de taille réduite. Utilisé surtout quand l\'écu en porte un grand nombre (semé de lionceaux), mais pas systématiquement pour 3+ lions.', category: 'general' },
];

/** Retrouve un terme par son nom (insensible à la casse) */
export function findTerm(word: string): HeraldryTerm | undefined {
  const lower = word.toLowerCase();
  return GLOSSARY.find((t) => t.term.toLowerCase() === lower);
}
