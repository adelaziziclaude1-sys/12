/**
 * Pure mathematical helper functions for ODE and Linear Systems calculations.
 * Decoupled from UI components for unit testing and interactive simulators.
 */

export interface Matrix2x2 {
  a: number;
  b: number;
  c: number;
  d: number;
}

export interface EigenAnalysis2x2 {
  trace: number;
  det: number;
  discriminant: number;
  type: 'distinct_real' | 'repeated_real' | 'complex';
  r1: { real: number; imag: number };
  r2: { real: number; imag: number };
  characteristicEquationLatex: string;
}

/**
 * Calculates eigenvalues and character of a 2x2 matrix:
 * A = [a, b; c, d]
 * det(A - rI) = r^2 - tr(A)r + det(A) = 0
 */
export function analyze2x2Matrix(m: Matrix2x2): EigenAnalysis2x2 {
  const trace = m.a + m.d;
  const det = m.a * m.d - m.b * m.c;
  const discriminant = trace * trace - 4 * det;

  let type: 'distinct_real' | 'repeated_real' | 'complex' = 'distinct_real';
  let r1 = { real: 0, imag: 0 };
  let r2 = { real: 0, imag: 0 };

  if (Math.abs(discriminant) < 1e-9) {
    type = 'repeated_real';
    const r = trace / 2;
    r1 = { real: r, imag: 0 };
    r2 = { real: r, imag: 0 };
  } else if (discriminant > 0) {
    type = 'distinct_real';
    const sqrtD = Math.sqrt(discriminant);
    r1 = { real: (trace + sqrtD) / 2, imag: 0 };
    r2 = { real: (trace - sqrtD) / 2, imag: 0 };
  } else {
    type = 'complex';
    const alpha = trace / 2;
    const beta = Math.sqrt(-discriminant) / 2;
    r1 = { real: alpha, imag: beta };
    r2 = { real: alpha, imag: -beta };
  }

  const signTr = trace >= 0 ? `- ${trace === 1 ? '' : trace}r` : `+ ${Math.abs(trace)}r`;
  const signDet = det >= 0 ? `+ ${det}` : `- ${Math.abs(det)}`;
  const characteristicEquationLatex = `r^2 ${trace === 0 ? '' : signTr} ${signDet} = 0`;

  return {
    trace,
    det,
    discriminant,
    type,
    r1,
    r2,
    characteristicEquationLatex,
  };
}

/**
 * Checks if two 2x2 matrices commute: AB == BA
 */
export function matricesCommute2x2(A: Matrix2x2, B: Matrix2x2): boolean {
  // AB:
  const ab_11 = A.a * B.a + A.b * B.c;
  const ab_12 = A.a * B.b + A.b * B.d;
  const ab_21 = A.c * B.a + A.d * B.c;
  const ab_22 = A.c * B.b + A.d * B.d;

  // BA:
  const ba_11 = B.a * A.a + B.b * A.c;
  const ba_12 = B.a * A.b + B.b * A.d;
  const ba_21 = B.c * A.a + B.d * A.c;
  const ba_22 = B.c * A.b + B.d * A.d;

  const tol = 1e-9;
  return (
    Math.abs(ab_11 - ba_11) < tol &&
    Math.abs(ab_12 - ba_12) < tol &&
    Math.abs(ab_21 - ba_21) < tol &&
    Math.abs(ab_22 - ba_22) < tol
  );
}

/**
 * Calculates Picard approximation terms for y' = 2y, y(0) = 1
 * y_0(x) = 1
 * y_1(x) = 1 + 2x
 * y_2(x) = 1 + 2x + 2x^2
 * y_n(x) = sum_{j=0}^n (2x)^j / j!
 */
export function picardExponentialTermCoefficients(steps: number): number[] {
  // Returns coefficients [c0, c1, c2, ...] where c_j = 2^j / j!
  const coeffs: number[] = [];
  let fact = 1;
  let power2 = 1;

  for (let j = 0; j <= steps; j++) {
    if (j > 0) {
      fact *= j;
      power2 *= 2;
    }
    coeffs.push(power2 / fact);
  }
  return coeffs;
}

/**
 * Evaluates Picard approximation at x for y' = 2y, y(0) = 1
 */
export function evaluatePicardApproximation(coeffs: number[], x: number): number {
  let sum = 0;
  for (let i = 0; i < coeffs.length; i++) {
    sum += coeffs[i] * Math.pow(x, i);
  }
  return sum;
}

/**
 * Calculates student readiness stats
 */
export interface MasteryStats {
  totalModules: number;
  masteredCount: number;
  reviewCount: number;
  strugglingCount: number;
  unseenCount: number;
  estimatedExamScore: number; // Out of 20
  percentageReady: number;
}

export function computeMasteryStats(
  moduleScores: Record<string, 'mastered' | 'review' | 'struggling' | 'unseen'>,
  moduleWeights: Record<string, number>
): MasteryStats {
  const ids = Object.keys(moduleWeights);
  const totalWeight = ids.reduce((acc, id) => acc + moduleWeights[id], 0);

  let earnedScore = 0;
  let masteredCount = 0;
  let reviewCount = 0;
  let strugglingCount = 0;
  let unseenCount = 0;

  for (const id of ids) {
    const status = moduleScores[id] || 'unseen';
    const weight = moduleWeights[id] || 0;

    if (status === 'mastered') {
      masteredCount++;
      earnedScore += weight * 1.0;
    } else if (status === 'review') {
      reviewCount++;
      earnedScore += weight * 0.6; // 60% partial points on review
    } else if (status === 'struggling') {
      strugglingCount++;
      earnedScore += weight * 0.25; // 25% for partial concepts
    } else {
      unseenCount++;
    }
  }

  const normalizedScore = totalWeight > 0 ? (earnedScore / totalWeight) * 20 : 0;
  const percentageReady = totalWeight > 0 ? (earnedScore / totalWeight) * 100 : 0;

  return {
    totalModules: ids.length,
    masteredCount,
    reviewCount,
    strugglingCount,
    unseenCount,
    estimatedExamScore: Math.round(normalizedScore * 10) / 10,
    percentageReady: Math.round(percentageReady),
  };
}

/**
 * Calculates Gronwall bound for question 2:
 * |y(x) - \tilde{y}(x)| <= M |x_1 - x_0| e^{L |x - x_1|}
 */
export function calculateGronwallBound(
  M: number,
  deltaX0: number, // |x_1 - x_0|
  L: number,
  distanceFromX1: number // |x - x_1|
): number {
  return M * Math.abs(deltaX0) * Math.exp(L * Math.abs(distanceFromX1));
}

/**
 * Evaluates Wronskian of two functions at t:
 * W(f, g)(t) = f(t)g'(t) - g(t)f'(t)
 */
export function calculateWronskianAtPoint(
  fVal: number,
  fPrimeVal: number,
  gVal: number,
  gPrimeVal: number
): number {
  return fVal * gPrimeVal - gVal * fPrimeVal;
}

/**
 * Generates coordinate samples for Sturm separation visualization
 * on y'' + y = 0 with y1 = cos(t), y2 = sin(t), and R(t) = y2/y1 = tan(t)
 */
export interface SturmSamplePoint {
  t: number;
  y1: number; // cos(t)
  y2: number; // sin(t)
  ratio: number | null; // tan(t) clamped
}

export function generateSturmSeparationSamples(
  tStart: number,
  tEnd: number,
  numPoints: number = 80
): SturmSamplePoint[] {
  const points: SturmSamplePoint[] = [];
  const step = (tEnd - tStart) / (numPoints - 1);

  for (let i = 0; i < numPoints; i++) {
    const t = tStart + i * step;
    const y1 = Math.cos(t);
    const y2 = Math.sin(t);
    let ratio: number | null = null;

    if (Math.abs(y1) > 0.05) {
      const rawRatio = y2 / y1;
      // Clamp for visual chart stability
      ratio = Math.max(-5, Math.min(5, rawRatio));
    }

    points.push({ t, y1, y2, ratio });
  }

  return points;
}

/**
 * Calculates simulated mock exam score from student rubric checks
 */
export function calculateMockExamScore(
  checkedRubricIds: Record<string, boolean>,
  rubricPoints: Record<string, number>
): { earnedScore: number; maxScore: number; percentage: number } {
  const keys = Object.keys(rubricPoints);
  const maxScore = keys.reduce((acc, k) => acc + rubricPoints[k], 0);
  let earnedScore = 0;

  for (const k of keys) {
    if (checkedRubricIds[k]) {
      earnedScore += rubricPoints[k];
    }
  }

  const percentage = maxScore > 0 ? (earnedScore / maxScore) * 100 : 0;
  return {
    earnedScore: Math.round(earnedScore * 10) / 10,
    maxScore: Math.round(maxScore * 10) / 10,
    percentage: Math.round(percentage),
  };
}

