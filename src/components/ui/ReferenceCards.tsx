import { EMAUX } from '../../data/tinctures';
import { PARTITIONS, getClipPaths } from '../../data/partitions';
import { PIECES, getPiecePath } from '../../data/ordinaries';
import { MEUBLES, getMeublePath } from '../../data/charges';
import Shield from '../svg/Shield';

export default function ReferenceCards() {
  return (
    <div className="reference">
      <h2>Fiches de référence</h2>

      {/* Émaux */}
      <section className="ref-section">
        <h3>Les 7 Émaux</h3>
        <p className="ref-intro">
          Les émaux se divisent en <strong>métaux</strong> (Or, Argent) et <strong>couleurs</strong> (Gueules, Azur, Sinople, Sable, Pourpre).
          La <em>règle des émaux</em> interdit de poser métal sur métal ou couleur sur couleur.
        </p>
        <div className="ref-grid ref-emaux">
          {EMAUX.map((email) => (
            <div key={email.id} className="ref-card">
              <div
                className="ref-color-swatch"
                style={{ backgroundColor: email.hex }}
              />
              <div className="ref-card-info">
                <strong>{email.nom}</strong>
                <span className="ref-type">{email.type === 'metal' ? 'Métal' : 'Couleur'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Partitions */}
      <section className="ref-section">
        <h3>Les Partitions</h3>
        <div className="ref-grid ref-partitions">
          {PARTITIONS.filter((p) => p.id !== 'plein').map((partition) => {
            const paths = getClipPaths(partition.id);
            const colors = ['#0055A4', '#FFD700', '#E21313', '#F5F5F5'];
            return (
              <div key={partition.id} className="ref-card">
                <div className="ref-mini-shield">
                  <Shield>
                    {paths.map((p, i) => (
                      <path key={i} d={p} fill={colors[i % colors.length]} />
                    ))}
                  </Shield>
                </div>
                <div className="ref-card-info">
                  <strong>{partition.nom}</strong>
                  <span className="ref-desc">{partition.description}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pièces */}
      <section className="ref-section">
        <h3>Les Pièces honorables</h3>
        <div className="ref-grid ref-pieces">
          {PIECES.map((piece) => {
            const path = getPiecePath(piece.id);
            return (
              <div key={piece.id} className="ref-card">
                <div className="ref-mini-shield">
                  <Shield>
                    <rect width={600} height={720} fill="#0055A4" />
                    <path d={path} fill="#FFD700" stroke="#1a1a1a" strokeWidth="1" fillRule="evenodd" />
                  </Shield>
                </div>
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
        <h3>Les Meubles</h3>
        <div className="ref-grid ref-meubles">
          {MEUBLES.map((meuble) => {
            const path = getMeublePath(meuble.id);
            return (
              <div key={meuble.id} className="ref-card">
                <div className="ref-mini-shield">
                  <Shield>
                    <rect width={600} height={720} fill="#0055A4" />
                    <g transform="translate(300, 330) scale(2.5)">
                      <path d={path} fill="#FFD700" stroke="#1a1a1a" strokeWidth="0.5" />
                    </g>
                  </Shield>
                </div>
                <div className="ref-card-info">
                  <strong>{meuble.nom}</strong>
                  <span className="ref-desc">{meuble.description}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
