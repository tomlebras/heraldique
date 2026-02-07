import type { Blason } from '../../types/heraldry';
import Shield from './Shield';
import PartitionOverlay from './PartitionOverlay';
import OrdinaryShape from './OrdinaryShape';
import ChargeShape from './ChargeShape';

interface Props {
  blason: Blason;
  onClick?: () => void;
  className?: string;
}

/** Renderer principal : transforme un objet Blason en SVG complet */
export default function CoatOfArmsRenderer({ blason, onClick, className }: Props) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', display: 'inline-block' }}
    >
      <Shield>
        {/* 1. Champ : partition + émaux */}
        <PartitionOverlay partition={blason.partition} emaux={blason.emaux} />

        {/* 2. Pièce honorable */}
        {blason.piece && (
          <OrdinaryShape piece={blason.piece.id} emailId={blason.piece.email} />
        )}

        {/* 3. Meubles */}
        {blason.meubles.map((m, i) => (
          <ChargeShape key={`meuble-${i}`} meuble={m} />
        ))}
      </Shield>
    </div>
  );
}
