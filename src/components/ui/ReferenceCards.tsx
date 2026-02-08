import { EMAUX } from '../../data/tinctures';
import { PARTITIONS, getClipPaths } from '../../data/partitions';
import { PIECES, getPiecePath } from '../../data/ordinaries';
import { MEUBLES, getMeublePath } from '../../data/charges';
import { GLOSSARY, findTerm } from '../../data/glossary';
import { BLASONS_HISTORIQUES } from '../../data/exercises/level5';
import { blasonner } from '../../engine/blazon';
import Shield from '../svg/Shield';
import CoatOfArmsRenderer from '../svg/CoatOfArmsRenderer';
import HeraldryTooltip from './HeraldryTooltip';

const SVG_CHARGES = new Set([
  'lion', 'lionceau', 'leopard', 'aigle', 'fleur-de-lys', 'croissant',
  'tour', 'epee', 'arbre', 'cerf', 'coquille',
  'cerf-couche', 'lion-leoparde',
]);

/** Meubles qui réutilisent le SVG d'un autre */
const SVG_ALIAS: Record<string, string> = {
  'lionceau': 'lion',
};

/** Mini-écu avec tooltip blasonnement au hover */
function ShieldWithTooltip({ blazon, children }: { blazon: string; children: React.ReactNode }) {
  return (
    <div className="ref-mini-shield shield-tooltip-wrap">
      {children}
      <span className="shield-tooltip">{blazon}</span>
    </div>
  );
}

/** Blasonnement pour les partitions affichées dans la fiche de référence */
function getPartitionBlason(id: string): string {
  const noms: Record<string, string> = {
    'parti': 'Parti d\'azur et d\'or',
    'coupe': 'Coupé d\'azur et d\'or',
    'tranche': 'Tranché d\'azur et d\'or',
    'taille': 'Taillé d\'azur et d\'or',
    'ecartele': 'Écartelé d\'azur et d\'or',
    'ecartele-en-sautoir': 'Écartelé en sautoir d\'azur, d\'or, de gueules et d\'argent',
    'tierce-en-fasce': 'Tiercé en fasce d\'azur, d\'or et de gueules',
    'tierce-en-pal': 'Tiercé en pal d\'azur, d\'or et de gueules',
  };
  return noms[id] ?? '';
}

/** Blasonnement pour les pièces affichées dans la fiche de référence */
function getPieceBlason(id: string): string {
  const articles: Record<string, string> = {
    'fasce': 'à la fasce',
    'pal': 'au pal',
    'bande': 'à la bande',
    'barre': 'à la barre',
    'chevron': 'au chevron',
    'croix': 'à la croix',
    'sautoir': 'au sautoir',
    'chef': 'au chef',
    'champagne': 'à la champagne',
    'bordure': 'à la bordure',
  };
  return `D'azur, ${articles[id] ?? 'à la pièce'} d'or`;
}

/** Article correct pour un meuble dans un blasonnement */
function getMeubleBlason(nom: string): string {
  const lower = nom.toLowerCase();
  // Meubles féminins
  const feminins = ['fleur de lys', 'étoile', 'tour', 'épée', 'coquille'];
  // Meubles commençant par voyelle (à l')
  if (['a', 'e', 'é', 'i', 'o', 'u'].some((v) => lower.startsWith(v))) {
    return `D'azur, à l'${lower} d'or`;
  }
  if (feminins.some((f) => lower === f)) {
    return `D'azur, à la ${lower} d'or`;
  }
  return `D'azur, au ${lower} d'or`;
}

/** Tailles spéciales pour certains SVG (les autres = 240×240 centré) */
const CHARGE_LAYOUT: Record<string, { x: number; y: number; w: number; h: number }> = {
  'lions-affrontes': { x: 60, y: 220, w: 480, h: 270 },
};

/** Mini-écu pour les cartes de terminologie */
function TermShield({ chargeId, blazon, mirror, clipBottom, pair, coupe, variantSvg }: {
  chargeId: string; blazon: string; mirror?: boolean; clipBottom?: number;
  pair?: 'affronted' | 'addorsed'; coupe?: boolean; variantSvg?: string;
}) {
  const layout = CHARGE_LAYOUT[chargeId] ?? { x: 180, y: 180, w: 240, h: 240 };
  const clipId = clipBottom ? `clip-${chargeId}-bot` : undefined;

  const renderContent = () => {
    // Deux meubles côte à côte (affronté/adossé) avec lion.svg
    if (pair) {
      const s = 190;
      const gap = 20;
      const svgHref = `${import.meta.env.BASE_URL}charges/${variantSvg ?? chargeId}.svg`;
      // Centrer la paire : total = s + gap + s, offset = (600 - total) / 2
      const leftX = (600 - s * 2 - gap) / 2;
      const rightX = leftX + s + gap;
      const y = 220;
      // Affronté : gauche miroir (→), droite normal (←) = face à face
      // Adossé : gauche normal (←), droite miroir (→) = dos à dos
      const leftMirror = pair === 'affronted';
      const rightMirror = pair === 'addorsed';
      return (
        <>
          {leftMirror ? (
            <g transform={`translate(${leftX + s}, ${y}) scale(-1, 1)`}>
              <image href={svgHref} x={0} y={0} width={s} height={s} preserveAspectRatio="xMidYMid meet" />
            </g>
          ) : (
            <image href={svgHref} x={leftX} y={y} width={s} height={s} preserveAspectRatio="xMidYMid meet" />
          )}
          {rightMirror ? (
            <g transform={`translate(${rightX + s}, ${y}) scale(-1, 1)`}>
              <image href={svgHref} x={0} y={0} width={s} height={s} preserveAspectRatio="xMidYMid meet" />
            </g>
          ) : (
            <image href={svgHref} x={rightX} y={y} width={s} height={s} preserveAspectRatio="xMidYMid meet" />
          )}
        </>
      );
    }

    if (SVG_CHARGES.has(chargeId)) {
      const svgFile = variantSvg ?? chargeId;
      return (
        <g transform={mirror ? 'translate(600, 0) scale(-1, 1)' : undefined} clipPath={clipId ? `url(#${clipId})` : undefined}>
          <image
            href={`${import.meta.env.BASE_URL}charges/${svgFile}.svg`}
            x={layout.x} y={layout.y} width={layout.w} height={layout.h}
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      );
    }
    return (
      <g transform={`translate(300, 330) scale(${mirror ? -2.5 : 2.5}, 2.5)`}>
        <path d={getMeublePath(chargeId)} fill="#FFD700" stroke="#1a1a1a" strokeWidth="0.5" />
      </g>
    );
  };

  return (
    <div className="ref-term-shield shield-tooltip-wrap">
      <Shield>
        {coupe ? (
          <>
            <rect width={600} height={340} fill="#E21313" />
            <rect y={340} width={600} height={380} fill="#0055A4" />
          </>
        ) : (
          <rect width={600} height={720} fill="#0055A4" />
        )}
        {clipId && (
          <defs>
            <clipPath id={clipId}>
              <rect x={0} y={0} width={600} height={clipBottom} />
            </clipPath>
          </defs>
        )}
        {renderContent()}
      </Shield>
      <span className="shield-tooltip">{blazon}</span>
    </div>
  );
}

/** Remplace les termes héraldiques connus dans un texte par des spans avec tooltip */
function TermText({ text }: { text: string }) {
  const termWords = GLOSSARY.map((t) => t.term).sort((a, b) => b.length - a.length);
  const regex = new RegExp(`\\b(${termWords.join('|')})(e?e?s?)?\\b`, 'gi');

  const parts: (string | { term: string; match: string })[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push({ term: match[1], match: match[0] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return (
    <>
      {parts.map((part, i) => {
        if (typeof part === 'string') return <span key={i}>{part}</span>;
        const termData = findTerm(part.term);
        if (!termData) return <span key={i}>{part.match}</span>;
        return (
          <HeraldryTooltip key={i} term={termData}>
            {part.match}
          </HeraldryTooltip>
        );
      })}
    </>
  );
}

export default function ReferenceCards() {
  return (
    <div className="reference">
      <h2>Fiches de référence</h2>

      {/* Émaux */}
      <section className="ref-section">
        <h3>Les émaux</h3>
        <p className="ref-intro">
          Les émaux se divisent en trois catégories. La <em>règle des émaux</em> interdit de poser métal sur métal ou couleur sur couleur.
          Exception : une pièce qui enfreint cette règle est dite <HeraldryTooltip term={findTerm('cousu')!}>cousue</HeraldryTooltip> (surtout le chef).
          Les fourrures, composées de métal et de couleur, ne sont pas soumises à cette règle.
        </p>

        <h4 style={{ marginTop: 24, marginBottom: 14, fontSize: 16, color: 'var(--gold)' }}>Métaux</h4>
        <div className="ref-grid ref-emaux">
          {EMAUX.filter((e) => e.type === 'metal').map((email) => (
            <div key={email.id} className="ref-card">
              <div className="ref-color-swatch" style={{ backgroundColor: email.hex }} />
              <div className="ref-card-info">
                <strong>{email.nom}</strong>
                <span className="ref-type ref-type-metal">métal</span>
              </div>
            </div>
          ))}
        </div>

        <h4 style={{ marginTop: 24, marginBottom: 14, fontSize: 16, color: '#818cf8' }}>Couleurs</h4>
        <div className="ref-grid ref-emaux">
          {EMAUX.filter((e) => e.type === 'couleur').map((email) => (
            <div key={email.id} className="ref-card">
              <div className="ref-color-swatch" style={{ backgroundColor: email.hex }} />
              <div className="ref-card-info">
                <strong>{email.nom}</strong>
                <span className="ref-type ref-type-couleur">couleur</span>
              </div>
            </div>
          ))}
        </div>

        <h4 style={{ marginTop: 24, marginBottom: 14, fontSize: 16, color: '#d4a853' }}>Fourrures</h4>
        <div className="ref-grid ref-emaux">
          <div className="ref-card">
            <svg width={56} height={56} viewBox="0 0 48 48" style={{ borderRadius: 10, border: '2px solid var(--border)' }}>
              <rect width="48" height="48" fill="#F5F5F5"/>
              <g fill="#2C2C2C">
                <path d="M 12,2 L 14,10 L 16,2 L 14,4 Z"/><circle cx="10" cy="12" r="1"/><circle cx="18" cy="12" r="1"/><circle cx="14" cy="14" r="1"/>
                <path d="M 34,2 L 36,10 L 38,2 L 36,4 Z"/><circle cx="32" cy="12" r="1"/><circle cx="40" cy="12" r="1"/><circle cx="36" cy="14" r="1"/>
                <path d="M 23,16 L 25,24 L 27,16 L 25,18 Z"/><circle cx="21" cy="26" r="1"/><circle cx="29" cy="26" r="1"/><circle cx="25" cy="28" r="1"/>
                <path d="M 12,30 L 14,38 L 16,30 L 14,32 Z"/><circle cx="10" cy="40" r="1"/><circle cx="18" cy="40" r="1"/><circle cx="14" cy="42" r="1"/>
                <path d="M 34,30 L 36,38 L 38,30 L 36,32 Z"/><circle cx="32" cy="40" r="1"/><circle cx="40" cy="40" r="1"/><circle cx="36" cy="42" r="1"/>
              </g>
            </svg>
            <div className="ref-card-info">
              <strong>Hermine</strong>
              <span className="ref-type ref-type-fourrure">fourrure</span>
            </div>
          </div>
          <div className="ref-card">
            <svg width={56} height={56} viewBox="0 0 48 48" style={{ borderRadius: 10, border: '2px solid var(--border)' }}>
              <rect width="48" height="48" fill="#2C2C2C"/>
              <g fill="#F5F5F5">
                <path d="M 12,2 L 14,10 L 16,2 L 14,4 Z"/><circle cx="10" cy="12" r="1"/><circle cx="18" cy="12" r="1"/><circle cx="14" cy="14" r="1"/>
                <path d="M 34,2 L 36,10 L 38,2 L 36,4 Z"/><circle cx="32" cy="12" r="1"/><circle cx="40" cy="12" r="1"/><circle cx="36" cy="14" r="1"/>
                <path d="M 23,16 L 25,24 L 27,16 L 25,18 Z"/><circle cx="21" cy="26" r="1"/><circle cx="29" cy="26" r="1"/><circle cx="25" cy="28" r="1"/>
                <path d="M 12,30 L 14,38 L 16,30 L 14,32 Z"/><circle cx="10" cy="40" r="1"/><circle cx="18" cy="40" r="1"/><circle cx="14" cy="42" r="1"/>
                <path d="M 34,30 L 36,38 L 38,30 L 36,32 Z"/><circle cx="32" cy="40" r="1"/><circle cx="40" cy="40" r="1"/><circle cx="36" cy="42" r="1"/>
              </g>
            </svg>
            <div className="ref-card-info">
              <strong>Contre-hermine</strong>
              <span className="ref-type ref-type-fourrure">fourrure</span>
            </div>
          </div>
          <div className="ref-card">
            <svg width={56} height={56} viewBox="0 0 48 48" style={{ borderRadius: 10, border: '2px solid var(--border)' }}>
              <rect width="48" height="48" fill="#F5F5F5"/>
              <g fill="#0055A4">
                <path d="M 0,0 L 6,12 L 12,0 Z"/><path d="M 12,0 L 18,12 L 24,0 Z"/><path d="M 24,0 L 30,12 L 36,0 Z"/><path d="M 36,0 L 42,12 L 48,0 Z"/>
                <path d="M 6,12 L 12,24 L 18,12 Z"/><path d="M 18,12 L 24,24 L 30,12 Z"/><path d="M 30,12 L 36,24 L 42,12 Z"/>
                <path d="M 0,24 L 6,36 L 12,24 Z"/><path d="M 12,24 L 18,36 L 24,24 Z"/><path d="M 24,24 L 30,36 L 36,24 Z"/><path d="M 36,24 L 42,36 L 48,24 Z"/>
                <path d="M 6,36 L 12,48 L 18,36 Z"/><path d="M 18,36 L 24,48 L 30,36 Z"/><path d="M 30,36 L 36,48 L 42,36 Z"/>
              </g>
            </svg>
            <div className="ref-card-info">
              <strong>Vair</strong>
              <span className="ref-type ref-type-fourrure">fourrure</span>
            </div>
          </div>
          <div className="ref-card">
            <svg width={56} height={56} viewBox="0 0 48 48" style={{ borderRadius: 10, border: '2px solid var(--border)' }}>
              <rect width="48" height="48" fill="#F5F5F5"/>
              <g fill="#0055A4">
                <path d="M 0,0 L 6,12 L 12,0 Z"/><path d="M 12,0 L 18,12 L 24,0 Z"/><path d="M 24,0 L 30,12 L 36,0 Z"/><path d="M 36,0 L 42,12 L 48,0 Z"/>
                <path d="M 0,24 L 6,12 L 12,24 Z"/><path d="M 12,24 L 18,12 L 24,24 Z"/><path d="M 24,24 L 30,12 L 36,24 Z"/><path d="M 36,24 L 42,12 L 48,24 Z"/>
                <path d="M 0,24 L 6,36 L 12,24 Z"/><path d="M 12,24 L 18,36 L 24,24 Z"/><path d="M 24,24 L 30,36 L 36,24 Z"/><path d="M 36,24 L 42,36 L 48,24 Z"/>
                <path d="M 0,48 L 6,36 L 12,48 Z"/><path d="M 12,48 L 18,36 L 24,48 Z"/><path d="M 24,48 L 30,36 L 36,48 Z"/><path d="M 36,48 L 42,36 L 48,48 Z"/>
              </g>
            </svg>
            <div className="ref-card-info">
              <strong>Contre-vair</strong>
              <span className="ref-type ref-type-fourrure">fourrure</span>
            </div>
          </div>
        </div>
      </section>

      {/* Partitions */}
      <section className="ref-section">
        <h3>Les partitions</h3>
        <div className="ref-grid ref-partitions">
          {PARTITIONS.filter((p) => p.id !== 'plein').map((partition) => {
            const paths = getClipPaths(partition.id);
            const colors = ['#0055A4', '#FFD700', '#E21313', '#F5F5F5'];
            return (
              <div key={partition.id} className="ref-card">
                <ShieldWithTooltip blazon={getPartitionBlason(partition.id)}>
                  <Shield>
                    {paths.map((p, i) => (
                      <path key={i} d={p} fill={colors[i % colors.length]} />
                    ))}
                  </Shield>
                </ShieldWithTooltip>
                <div className="ref-card-info">
                  <strong>{partition.nom}</strong>
                  <span className="ref-desc">{partition.description}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dextre, Senestre et ordre de l'écu */}
      <section className="ref-section">
        <h3>Orientation et ordre de l'écu</h3>
        <p className="ref-intro">
          En héraldique, <strong>dextre</strong> (droite du porteur) est à <strong>gauche</strong> du spectateur,
          et <strong>senestre</strong> (gauche du porteur) est à <strong>droite</strong> du spectateur.
        </p>
        <div className="ref-grid" style={{ gap: 24 }}>
          {/* Dextre / Senestre */}
          <div className="ref-card" style={{ alignItems: 'center', padding: 16 }}>
            <div className="shield-tooltip-wrap" style={{ flexShrink: 0 }}>
              <svg viewBox="0 0 200 240" width={160} height={192}>
                <defs><clipPath id="ref-ds"><path d="M 0,0 L 200,0 L 200,173 Q 200,211 100,240 Q 0,211 0,173 Z"/></clipPath></defs>
                <g clipPath="url(#ref-ds)">
                  <rect x="0" y="0" width="100" height="240" fill="#FFD700"/>
                  <rect x="100" y="0" width="100" height="240" fill="#0055A4"/>
                </g>
                <path d="M 0,0 L 200,0 L 200,173 Q 200,211 100,240 Q 0,211 0,173 Z" fill="none" stroke="#333" strokeWidth="2"/>
                <text x="50" y="125" fill="#333" fontSize="16" textAnchor="middle" fontFamily="Inter" fontWeight="700">Dextre</text>
                <text x="150" y="125" fill="white" fontSize="16" textAnchor="middle" fontFamily="Inter" fontWeight="700">Senestre</text>
              </svg>
              <span className="shield-tooltip">Parti d'or et d'azur</span>
            </div>
            <div className="ref-card-info" style={{ fontSize: 12, marginTop: 8 }}>
              <strong>Parti :</strong> d'or et d'azur
            </div>
          </div>

          {/* Écartelé numéroté */}
          <div className="ref-card" style={{ alignItems: 'center', padding: 16 }}>
            <div className="shield-tooltip-wrap" style={{ flexShrink: 0 }}>
              <svg viewBox="0 0 200 240" width={160} height={192}>
              <defs><clipPath id="ref-ec"><path d="M 0,0 L 200,0 L 200,173 Q 200,211 100,240 Q 0,211 0,173 Z"/></clipPath></defs>
              <g clipPath="url(#ref-ec)">
                <rect x="0" y="0" width="100" height="120" fill="#0055A4"/>
                <rect x="100" y="0" width="100" height="120" fill="#FFD700"/>
                <rect x="0" y="120" width="100" height="120" fill="#FFD700"/>
                <rect x="100" y="120" width="100" height="120" fill="#0055A4"/>
              </g>
              <path d="M 0,0 L 200,0 L 200,173 Q 200,211 100,240 Q 0,211 0,173 Z" fill="none" stroke="#333" strokeWidth="2"/>
              <text x="50" y="68" fill="white" fontSize="28" textAnchor="middle" fontFamily="Inter" fontWeight="800">1</text>
              <text x="150" y="68" fill="#333" fontSize="28" textAnchor="middle" fontFamily="Inter" fontWeight="800">2</text>
              <text x="50" y="180" fill="#333" fontSize="28" textAnchor="middle" fontFamily="Inter" fontWeight="800">3</text>
              <text x="150" y="180" fill="white" fontSize="28" textAnchor="middle" fontFamily="Inter" fontWeight="800">4</text>
              </svg>
              <span className="shield-tooltip">Écartelé d'azur et d'or</span>
            </div>
            <div className="ref-card-info" style={{ fontSize: 12, marginTop: 8 }}>
              <strong>Écartelé</strong> d'azur et d'or
            </div>
          </div>
        </div>
      </section>

      {/* Pièces */}
      <section className="ref-section">
        <h3>Les pièces honorables</h3>
        <div className="ref-grid ref-pieces">
          {PIECES.map((piece) => {
            const path = getPiecePath(piece.id);
            return (
              <div key={piece.id} className="ref-card">
                <ShieldWithTooltip blazon={getPieceBlason(piece.id)}>
                  <Shield>
                    <rect width={600} height={720} fill="#0055A4" />
                    <path d={path} fill="#FFD700" stroke="#1a1a1a" strokeWidth="1" fillRule="evenodd" />
                  </Shield>
                </ShieldWithTooltip>
                <div className="ref-card-info">
                  <strong>{piece.nom}</strong>
                  <span className="ref-desc">{piece.description}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Meubles */}
      <section className="ref-section">
        <h3>Les meubles</h3>
        <div className="ref-grid ref-meubles">
          {MEUBLES.map((meuble) => {
            const svgFile = SVG_ALIAS[meuble.id] ?? meuble.id;
            const chargeSize = meuble.id === 'lionceau' ? 170 : 240;
            const offset = (600 - chargeSize) / 2;
            const yOffset = meuble.id === 'lionceau' ? 240 : 180;
            return (
              <div key={meuble.id} className="ref-card">
                <ShieldWithTooltip blazon={getMeubleBlason(meuble.nom)}>
                  <Shield>
                    <rect width={600} height={720} fill="#0055A4" />
                    {SVG_CHARGES.has(meuble.id) ? (
                      <image
                        href={`${import.meta.env.BASE_URL}charges/${svgFile}.svg`}
                        x={offset}
                        y={yOffset}
                        width={chargeSize}
                        height={chargeSize}
                        preserveAspectRatio="xMidYMid meet"
                      />
                    ) : (
                      <g transform="translate(300, 330) scale(2.5)">
                        <path d={getMeublePath(meuble.id)} fill="#FFD700" stroke="#1a1a1a" strokeWidth="0.5" />
                      </g>
                    )}
                  </Shield>
                </ShieldWithTooltip>
                <div className="ref-card-info">
                  <strong>{meuble.nom}</strong>
                  <span className="ref-desc"><TermText text={meuble.description} /></span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Vocabulaire des meubles */}
      <section className="ref-section">
        <h3>Attributs des meubles</h3>
        <p className="ref-intro">
          En héraldique française, chaque partie d'un animal peut être d'un émail différent.
          Survolez les termes en <span style={{ color: 'var(--primary)', fontStyle: 'italic', borderBottom: '1px dotted var(--primary)' }}>violet</span> pour voir leur définition.
        </p>

        <h4 style={{ marginTop: 28, marginBottom: 14, fontSize: 16, color: 'var(--text-muted)' }}>Postures</h4>
        <div className="ref-terminology">
          <div className="ref-term-card">
            <TermShield chargeId="lion" blazon="D'azur, au lion d'or" variantSvg="lion-mono" />
            <div className="ref-term-content">
              <h5>Rampant</h5>
              <p>Dressé sur ses pattes arrière, de profil. Posture par défaut du lion.</p>
            </div>
          </div>
          <div className="ref-term-card">
            <TermShield chargeId="leopard" blazon="D'azur, au léopard d'or" />
            <div className="ref-term-content">
              <h5>Passant</h5>
              <p>Marchant, trois pattes au sol. Posture par défaut du léopard (avec la tête de face).</p>
            </div>
          </div>
          <div className="ref-term-card">
            <TermShield chargeId="aigle" blazon="D'azur, à l'aigle d'or" />
            <div className="ref-term-content">
              <h5>Éployé</h5>
              <p>Ailes étendues et ouvertes. Se dit principalement de l'aigle (féminin : éployée).</p>
            </div>
          </div>
          <div className="ref-term-card">
            <TermShield chargeId="cerf" blazon="D'azur, au cerf d'or" />
            <div className="ref-term-content">
              <h5>Courant</h5>
              <p>Animal en pleine course, les quatre pattes étendues.</p>
            </div>
          </div>
          <div className="ref-term-card">
            <TermShield chargeId="cerf-couche" blazon="D'azur, au cerf couché d'or" />
            <div className="ref-term-content">
              <h5>Couché</h5>
              <p>Au repos, pattes repliées.</p>
            </div>
          </div>
          <div className="ref-term-card">
            <TermShield chargeId="lion" blazon="Coupé de gueules et d'azur, au lion issant d'or" clipBottom={340} coupe variantSvg="lion-mono" />
            <div className="ref-term-content">
              <h5>Issant</h5>
              <p>Semble sortir d'une pièce ou d'une ligne de partition, seule la moitié supérieure est visible.</p>
            </div>
          </div>
          <div className="ref-term-card">
            <TermShield chargeId="lion" blazon="D'azur, au lion contourné d'or" mirror variantSvg="lion-mono" />
            <div className="ref-term-content">
              <h5>Contourné</h5>
              <p>Tourné vers senestre (inversé par rapport à la position normale, vers dextre).</p>
            </div>
          </div>
          <div className="ref-term-card">
            <TermShield chargeId="lion" blazon="D'azur, à deux lions affrontés d'or" pair="affronted" variantSvg="lion-mono" />
            <div className="ref-term-content">
              <h5>Affronté</h5>
              <p>Deux figures face à face.</p>
            </div>
          </div>
          <div className="ref-term-card">
            <TermShield chargeId="lion" blazon="D'azur, à deux lions adossés d'or" pair="addorsed" variantSvg="lion-mono" />
            <div className="ref-term-content">
              <h5>Adossé</h5>
              <p>Deux figures dos à dos.</p>
            </div>
          </div>
          <div className="ref-term-card">
            <TermShield chargeId="leopard" blazon="D'azur, au léopard d'or" />
            <div className="ref-term-content">
              <h5>Léopard</h5>
              <p>Un lion <TermText text="passant" />, tête de face. En héraldique française, ce n'est pas un animal distinct.</p>
            </div>
          </div>
          <div className="ref-term-card">
            <TermShield chargeId="lion-leoparde" blazon="D'azur, au lion léopardé d'or" />
            <div className="ref-term-content">
              <h5>Lion léopardé</h5>
              <p><TermText text="Passant" />, tête de profil.</p>
            </div>
          </div>
        </div>

        <h4 style={{ marginTop: 28, marginBottom: 14, fontSize: 16, color: 'var(--text-muted)' }}>Attributs colorés</h4>
        <p className="ref-intro" style={{ marginTop: 0 }}>
          Quand une partie du corps est d'un émail différent, on le précise avec un terme spécifique.
        </p>
        <div className="ref-terminology">
          <div className="ref-term-card">
            <TermShield chargeId="lion" blazon="D'azur, au lion d'or, armé de gueules" variantSvg="lion-arme" />
            <div className="ref-term-content">
              <h5>Armé</h5>
              <p>Griffes d'un émail différent.</p>
            </div>
          </div>
          <div className="ref-term-card">
            <TermShield chargeId="lion" blazon="D'azur, au lion d'or, lampassé de gueules" variantSvg="lion-lampasse" />
            <div className="ref-term-content">
              <h5>Lampassé</h5>
              <p>Langue d'un émail différent.</p>
            </div>
          </div>
          <div className="ref-term-card">
            <TermShield chargeId="lion" blazon="D'azur, au lion d'or, couronné de gueules" variantSvg="lion-mono" />
            <div className="ref-term-content">
              <h5>Couronné</h5>
              <p>Portant une couronne. On précise l'émail si différent du corps.</p>
            </div>
          </div>
          <div className="ref-term-card">
            <TermShield chargeId="aigle" blazon="D'azur, à l'aigle d'or, becquée de gueules"  />
            <div className="ref-term-content">
              <h5>Becqué</h5>
              <p>Bec d'un émail différent (oiseaux).</p>
            </div>
          </div>
          <div className="ref-term-card">
            <TermShield chargeId="aigle" blazon="D'azur, à l'aigle d'or, membrée de gueules"  />
            <div className="ref-term-content">
              <h5>Membré</h5>
              <p>Pattes d'un émail différent (oiseaux).</p>
            </div>
          </div>
          <div className="ref-term-card">
            <TermShield chargeId="lion" blazon="D'azur, au lion d'or, allumé de gueules" variantSvg="lion-allume" />
            <div className="ref-term-content">
              <h5>Allumé</h5>
              <p>Yeux d'un émail différent.</p>
            </div>
          </div>
          <div className="ref-term-card">
            <TermShield chargeId="arbre" blazon="D'azur, à l'arbre arraché d'or" />
            <div className="ref-term-content">
              <h5>Arraché</h5>
              <p>Se dit d'un arbre dont les racines sont visibles, ou d'une tête séparée du corps de façon irrégulière.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blasons historiques */}
      <section className="ref-section">
        <h3>Blasons historiques</h3>
        <p className="ref-intro">
          Quelques armoiries célèbres de l'histoire de France.
        </p>
        <div className="ref-grid ref-meubles">
          {BLASONS_HISTORIQUES.map((bh) => (
            <div key={bh.nom} className="ref-card">
              <ShieldWithTooltip blazon={blasonner(bh.blason)}>
                <CoatOfArmsRenderer blason={bh.blason} />
              </ShieldWithTooltip>
              <div className="ref-card-info">
                <strong>{bh.nom}</strong>
                <span className="ref-desc" style={{ color: 'var(--gold)', fontSize: 12 }}>{bh.dates}</span>
                <span className="ref-desc">{bh.description}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
