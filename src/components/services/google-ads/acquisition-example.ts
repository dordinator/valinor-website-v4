/** A simple illustrative acquisition calculation, including paid management. */
export function calculateAcquisition(spend: number, customers: number, profitBeforeAds: number) {
  if (![spend, customers, profitBeforeAds].every(Number.isFinite) || spend < 0 || customers < 0 || !Number.isInteger(customers) || profitBeforeAds < 0) return null;
  const management = Math.max(100, spend * .15);
  const total = spend + management;
  const cost = customers > 0 ? total / customers : null;
  return { management, total, cost, remaining: cost === null ? null : profitBeforeAds - cost };
}

/** Average CPC uses media spend only, excluding management fees. */
export function calculateAverageCpc(spend: number, clicks: number) {
  if (!Number.isFinite(spend) || spend < 0 || !Number.isInteger(clicks) || clicks <= 0) return null;
  return spend / clicks;
}
