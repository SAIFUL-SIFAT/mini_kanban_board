export const DEFAULT_GAP = 1024;

export function positionBetween(beforeOrder: number, afterOrder: number): number {
  return Math.floor((beforeOrder + afterOrder) / 2);
}

export function positionForEnd(lastOrder: number | null | undefined): number {
  if (lastOrder == null) {
    return DEFAULT_GAP;
  }
  return lastOrder + DEFAULT_GAP;
}

export function needsRenormalization(beforeOrder: number, afterOrder: number): boolean {
  return afterOrder - beforeOrder <= 1;
}

export function renormalize(orderedIds: string[]): { id: string; order: number }[] {
  return orderedIds.map((id, index) => ({
    id,
    order: (index + 1) * DEFAULT_GAP,
  }));
}
