import type { IdPartition } from '../../types/heraldry';
import { getClipPaths } from '../../data/partitions';
import { getHexEmail } from '../../data/tinctures';

interface Props {
  partition: IdPartition;
  emaux: string[];
}

/** Affiche les zones colorées d'une partition */
export default function PartitionOverlay({ partition, emaux }: Props) {
  const clipPaths = getClipPaths(partition);

  return (
    <>
      {clipPaths.map((path, i) => {
        const emailId = emaux[i] || emaux[0] || 'argent';
        return (
          <path
            key={`partition-${partition}-${i}`}
            d={path}
            fill={getHexEmail(emailId)}
          />
        );
      })}
    </>
  );
}
