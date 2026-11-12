import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyze2x2Matrix,
  matricesCommute2x2,
  picardExponentialTermCoefficients,
  evaluatePicardApproximation,
  computeMasteryStats,
  calculateGronwallBound,
  calculateWronskianAtPoint,
  generateSturmSeparationSamples,
  calculateMockExamScore,
} from './mathCalculations';

test('analyze2x2Matrix correctly handles Dr. Shahroozi Midterm Q5 matrix', () => {
  // A = [3, 5; -5, -3] -> tr=0, det=-9 - (-25) = 16 -> r = +/- 4i
  const analysis = analyze2x2Matrix({ a: 3, b: 5, c: -5, d: -3 });
  assert.equal(analysis.trace, 0);
  assert.equal(analysis.det, 16);
  assert.equal(analysis.type, 'complex');
  assert.equal(analysis.r1.real, 0);
  assert.equal(analysis.r1.imag, 4);
  assert.equal(analysis.r2.real, 0);
  assert.equal(analysis.r2.imag, -4);
});

test('analyze2x2Matrix correctly handles Lecture Note page 24 repeated eigenvalue matrix', () => {
  // A = [1, -1; 1, 3] -> tr=4, det=3 - (-1) = 4 -> disc = 16 - 16 = 0 -> r = 2 (repeated)
  const analysis = analyze2x2Matrix({ a: 1, b: -1, c: 1, d: 3 });
  assert.equal(analysis.trace, 4);
  assert.equal(analysis.det, 4);
  assert.equal(analysis.type, 'repeated_real');
  assert.equal(analysis.r1.real, 2);
  assert.equal(analysis.r2.real, 2);
});

test('analyze2x2Matrix correctly handles Lecture Note page 16 distinct real matrix', () => {
  // A = [-2, 1; -5, 4] -> tr=2, det=-8 - (-5) = -3 -> r^2 - 2r - 3 = 0 -> (r-3)(r+1)=0 -> r1=3, r2=-1
  const analysis = analyze2x2Matrix({ a: -2, b: 1, c: -5, d: 4 });
  assert.equal(analysis.trace, 2);
  assert.equal(analysis.det, -3);
  assert.equal(analysis.type, 'distinct_real');
  assert.equal(analysis.r1.real, 3);
  assert.equal(analysis.r2.real, -1);
});

test('matricesCommute2x2 tests commutativity AB = BA', () => {
  // Identity commutes with everything
  const I = { a: 1, b: 0, c: 0, d: 1 };
  const A = { a: 2, b: 3, c: 1, d: 4 };
  assert.equal(matricesCommute2x2(A, I), true);

  // A and A^2 commute
  const A2 = {
    a: A.a * A.a + A.b * A.c,
    b: A.a * A.b + A.b * A.d,
    c: A.c * A.a + A.d * A.c,
    d: A.c * A.b + A.d * A.d,
  };
  assert.equal(matricesCommute2x2(A, A2), true);

  // Non-commuting matrices
  const B = { a: 1, b: 2, c: 3, d: 4 };
  const C = { a: 0, b: 1, c: 0, d: 0 };
  assert.equal(matricesCommute2x2(B, C), false);
});

test('Picard iteration coefficients converge to e^(2x)', () => {
  const coeffs = picardExponentialTermCoefficients(5);
  // c0 = 1, c1 = 2, c2 = 4/2 = 2, c3 = 8/6 = 4/3, c4 = 16/24 = 2/3
  assert.equal(coeffs[0], 1);
  assert.equal(coeffs[1], 2);
  assert.equal(coeffs[2], 2);
  assert.ok(Math.abs(coeffs[3] - 4 / 3) < 1e-9);

  // Evaluate at x = 0.5: approx of e^(2*0.5) = e^1 = 2.71828...
  const val = evaluatePicardApproximation(coeffs, 0.5);
  const target = Math.exp(1);
  assert.ok(Math.abs(val - target) < 0.05);
});

test('computeMasteryStats computes exam grade out of 20', () => {
  const weights = {
    m1: 3.5,
    m2: 4.0,
    m3: 4.5,
    m4: 2.5,
    m5: 2.5,
    m6: 1.5,
    m7: 1.5,
  };

  // If all mastered -> 20/20
  const allMastered = computeMasteryStats(
    {
      m1: 'mastered',
      m2: 'mastered',
      m3: 'mastered',
      m4: 'mastered',
      m5: 'mastered',
      m6: 'mastered',
      m7: 'mastered',
    },
    weights
  );
  assert.equal(allMastered.estimatedExamScore, 20);
  assert.equal(allMastered.percentageReady, 100);

  // If none seen -> 0/20
  const noneSeen = computeMasteryStats({}, weights);
  assert.equal(noneSeen.estimatedExamScore, 0);
  assert.equal(noneSeen.percentageReady, 0);
});

test('calculateGronwallBound computes exponential bound correctly', () => {
  // M = 2, |x1 - x0| = 0.5, L = 1, |x - x1| = 0 -> 2 * 0.5 * e^0 = 1
  const b0 = calculateGronwallBound(2, 0.5, 1, 0);
  assert.equal(b0, 1);

  // at distance 1 with L=1: 1 * e^1 = 2.71828...
  const b1 = calculateGronwallBound(2, 0.5, 1, 1);
  assert.ok(Math.abs(b1 - Math.E) < 1e-9);
});

test('calculateWronskianAtPoint evaluates W(cos, sin) = 1 identically', () => {
  // At t = 0: f = cos(0) = 1, f' = -sin(0) = 0; g = sin(0) = 0, g' = cos(0) = 1
  const w0 = calculateWronskianAtPoint(1, 0, 0, 1);
  assert.equal(w0, 1);

  // At t = pi/4: f = sqrt(2)/2, f' = -sqrt(2)/2, g = sqrt(2)/2, g' = sqrt(2)/2
  const s = Math.SQRT1_2;
  const wPi4 = calculateWronskianAtPoint(s, -s, s, s);
  assert.ok(Math.abs(wPi4 - 1) < 1e-9);
});

test('generateSturmSeparationSamples generates valid points and detects zeros', () => {
  const samples = generateSturmSeparationSamples(-Math.PI / 2, Math.PI / 2, 5);
  assert.equal(samples.length, 5);
  // Center point is t = 0 -> y1 = cos(0) = 1, y2 = sin(0) = 0
  const mid = samples[2];
  assert.ok(Math.abs(mid.t) < 1e-9);
  assert.ok(Math.abs(mid.y1 - 1) < 1e-9);
  assert.ok(Math.abs(mid.y2) < 1e-9);
});

test('calculateMockExamScore aggregates rubric checks accurately', () => {
  const rubrics = { q1_a: 1.0, q1_b: 1.5, q2_a: 2.5 };
  const checked = { q1_a: true, q1_b: true, q2_a: false };
  const score = calculateMockExamScore(checked, rubrics);
  assert.equal(score.maxScore, 5);
  assert.equal(score.earnedScore, 2.5);
  assert.equal(score.percentage, 50);
});

