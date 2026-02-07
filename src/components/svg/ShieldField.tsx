import { getHexEmail } from '../../data/tinctures';

interface Props {
  emailId: string;
  clipPath?: string;
  index?: number;
}

/** Remplissage d'une zone de l'écu avec un émail */
export default function ShieldField({ emailId, clipPath, index = 0 }: Props) {
  const hex = getHexEmail(emailId);
  const clipId = clipPath ? `zone-${index}` : undefined;

  return (
    <>
      {clipPath && (
        <defs>
          <clipPath id={clipId}>
            <path d={clipPath} />
          </clipPath>
        </defs>
      )}
      <rect
        x={0}
        y={0}
        width={600}
        height={720}
        fill={hex}
        clipPath={clipId ? `url(#${clipId})` : undefined}
      />
    </>
  );
}
