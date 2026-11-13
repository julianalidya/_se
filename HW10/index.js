function summarizeGrades(items) {
  if (!Array.isArray(items)) {
    throw new TypeError("Provide an array of { score, weight } entries.");
  }

  let totalWeight = 0;
  let weightedScore = 0;

  for (const item of items) {
    const { score, weight } = item ?? {};
    if (!Number.isFinite(score) || score < 0 || score > 100) {
      throw new RangeError("Each score must be a number from 0 to 100.");
    }
    if (!Number.isFinite(weight) || weight <= 0 || weight > 100) {
      throw new RangeError("Each weight must be greater than 0 and at most 100.");
    }
    totalWeight += weight;
    weightedScore += score * weight;
  }

  return { totalWeight, weightedScore };
}

/** Return the weighted average of the provided grades on a 0–100 scale. */
export function weightedAverage(items) {
  const { totalWeight, weightedScore } = summarizeGrades(items);
  if (totalWeight === 0) {
    throw new RangeError("Provide at least one grade.");
  }
  return weightedScore / totalWeight;
}

/**
 * Return the minimum score needed across the remaining percentage weight.
 * Return null when the target cannot be reached even with a score of 100.
 */
export function requiredScore(items, target) {
  if (!Number.isFinite(target) || target < 0 || target > 100) {
    throw new RangeError("The target must be a number from 0 to 100.");
  }

  const { totalWeight, weightedScore } = summarizeGrades(items);
  const remainingWeight = 100 - totalWeight;
  if (remainingWeight <= 0) {
    throw new RangeError("Completed grades must have a combined weight below 100.");
  }

  const score = (target * 100 - weightedScore) / remainingWeight;
  // Allow for floating-point error at the boundary of a perfect score.
  if (score > 100 + 1e-8) {
    return null;
  }
  return Math.min(100, Math.max(0, score));
}
