import type { IdPiece } from '../../types/heraldry';
import { getHexEmail } from '../../data/tinctures';
import { getPiecePath } from '../../data/ordinaries';

interface Props {
  piece: IdPiece;
  emailId: string;
}

/** Affiche une pièce honorable sur l'écu */
export default function OrdinaryShape({ piece, emailId }: Props) {
  const path = getPiecePath(piece);
  if (!path) return null;

  return (
    <path
      d={path}
      fill={getHexEmail(emailId)}
      stroke="#1a1a1a"
      strokeWidth="1"
      fillRule="evenodd"
    />
  );
}
