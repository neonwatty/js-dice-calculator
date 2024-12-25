function probabilityOfMOrMoreSameSimulated(n, m, c) {
  if (n < m || m <= 0 || m > n) {
    throw new Error("Invalid input: ensure 0 < m <= n.");
  }
  if (c <= 0) {
    throw new Error("Invalid input: c must be a positive integer.");
  }

  const sides = 6;

  // Helper function to roll n dice
  function rollDice(n) {
    const rolls = Array(n)
      .fill(0)
      .map(() => Math.ceil(Math.random() * sides));
    return rolls;
  }

  // Helper function to check if m or more dice match
  function hasMOrMoreMatches(rolls, m) {
    const counts = new Array(sides).fill(0);
    rolls.forEach((side) => counts[side - 1]++);
    return counts.some((count) => count >= m);
  }

  // Simulate c rolls and count how many meet the condition
  let matches = 0;

  for (let i = 0; i < c; i++) {
    const rolls = rollDice(n);
    if (hasMOrMoreMatches(rolls, m)) {
      matches++;
    }
  }

  // Compute and return the probability
  return Math.round((matches / c) * 100) / 100; // Round to 2 decimals
}

// Example usage
console.log(probabilityOfMOrMoreSameSimulated(30, 10, 10000)); // Less than 1
