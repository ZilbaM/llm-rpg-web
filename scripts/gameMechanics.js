/**
 * Generate a random number between -10 and +10 based on a normal distribution.
 * @param {number} mean - The average value of the distribution (default: 0).
 * @param {number} stdDev - The standard deviation of the distribution (controls spread).
 * @returns {number} - A random number between -10 and +10.
 */
export function rollOutcome(mean = 0, stdDev = 2) {
    let u = 0, v = 0;
  
    // Generate two random numbers between 0 and 1, avoiding 0 for logarithm
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
  
    // Box-Muller transform to generate a normal distribution
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  
    // Scale and shift the value to center around `mean` with spread `stdDev`
    const scaled = z * stdDev + mean;
  
    // Clamp the result to the range [-10, 10]
    return Math.max(-10, Math.min(10, Math.round(scaled)));
  }
  