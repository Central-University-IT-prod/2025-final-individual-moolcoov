const XPFactors = {
  time: 0.5,
  weight: 0.1,
};

export const calculateCoins = (
  trainingTime: number,
  totalWeight: number,
): number => {
  return Math.round(
    (Math.min(trainingTime, 7200) * XPFactors.time +
      totalWeight * XPFactors.weight) *
      10,
  );
};
