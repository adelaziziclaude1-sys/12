import React, { useState } from 'react';
import {
  analyze2x2Matrix,
  picardExponentialTermCoefficients,
  evaluatePicardApproximation,
  calculateGronwallBound,
  Matrix2x2,
} from '../utils/mathCalculations';
import { InlineMath, BlockMath } from './MathView';
import { Sliders, Cpu, Play, RotateCcw, Activity, ShieldCheck, Scale, Compass } from 'lucide-react';

export const InteractiveSimulators: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'picard' | 'sturm' | 'gronwall'>('matrix');

  // Matrix Explorer State
  const [matrix, setMatrix] = useState<Matrix2x2>({ a: 3, b: 5, c: -5, d: -3 }); // Shahroozi Q5 default

  const matrixAnalysis = analyze2x2Matrix(matrix);

  // Picard Simulator State
  const [picardSteps, setPicardSteps] = useState<number>(3);
  const [evalX, setEvalX] = useState<number>(0.5);

  const picardCoeffs = picardExponentialTermCoefficients(picardSteps);
  const picardApproxVal = evaluatePicardApproximation(picardCoeffs, evalX);
  const exactVal = Math.exp(2 * evalX);
  const absError = Math.abs(exactVal - picardApproxVal);

  // Sturm Separation Simulator State
  const [sturmT, setSturmT] = useState<number>(0.5);
  const sturmY1 = Math.cos(sturmT);
  const sturmY2 = Math.sin(sturmT);
  const sturmWronskian = 1.0; // cos^2 + sin^2 = 1
  const sturmRatio = Math.abs(sturmY1) > 0.001 ? sturmY2 / sturmY1 : 0;
  const sturmRatioDeriv = Math.abs(sturmY1) > 0.001 ? 1 / (sturmY1 * sturmY1) : 0;

  // Gronwall Calculator State
  const [gronwallM, setGronwallM] = useState<number>(2.0);
  const [gronwallDeltaX0, setGronwallDeltaX0] = useState<number>(0.1);
  const [gronwallL, setGronwallL] = useState<number>(1.5);
  const [gronwallDist, setGronwallDist] = useState<number>(0.5);
  const gronwallBound = calculateGronwallBound(gronwallM, gronwallDeltaX0, gronwallL, gronwallDist);

  const presets = [
    {
      name: 'سوال ۵ میان‌ترم: ماتریس مختلط محض',
      matrix: { a: 3, b: 5, c: -5, d: -3 },
      desc: 'مقادیر ویژه r = ±4i (نوسان خالص، مرکز دایره‌ای)',
    },
    {
      name: 'مثال ۲.۷ جزوه: نوسان با رشد نمایی',
      matrix: { a: 1, b: 2, c: -2, d: 1 },
      desc: 'مقادیر ویژه r = 1 ± 2i (مارپیچ ناپایدار)',
    },
    {
      name: 'مثال ۲.۴ جزوه: مقادیر ویژه حقیقی متمایز',
      matrix: { a: -2, b: 1, c: -5, d: 4 },
      desc: 'مقادیر ویژه r = -1, 3 (نقطه زینی Saddle)',
    },
    {
      name: 'مثال ۲.۱۲ جزوه: ریشه مضاعف با نقص بعد',
      matrix: { a: 1, b: -1, c: 1, d: 3 },
      desc: 'مقدار ویژه تکراری r = 2 (نیازمند بردار تعمیم‌یافته)',
    },
  ];

  return (
    <div id="simulators" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl mb-12 scroll-mt-24">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>آزمایشگاه تعاملی و شبیه‌ساز فرمول‌های امتحان</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                شبیه‌ساز زنده
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              آزمایش سریع مفاهیم جزوه و نمونه‌سوالات با تغییر پارامترها و مشاهده محاسبات گام‌به‌گام
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'matrix' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            کاوشگر مقادیر ویژه و e^{`{At}`}
          </button>
          <button
            onClick={() => setActiveTab('picard')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'picard' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            شبیه‌ساز تقریب‌های پیکارد
          </button>
          <button
            onClick={() => setActiveTab('sturm')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'sturm' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            تفکیک ریشه‌های اشتورم و آبل
          </button>
          <button
            onClick={() => setActiveTab('gronwall')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'gronwall' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            محاسبه‌گر کران گرونوال
          </button>
        </div>
      </div>

      {/* Tab 1: Matrix Explorer */}
      {activeTab === 'matrix' && (
        <div className="mt-6 space-y-6">
          {/* Preset Buttons */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-2">
              گزینش سریع از نمونه‌سوالات امتحانی دکتر شهروزی:
            </label>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setMatrix(p.matrix)}
                  className="p-2.5 text-right bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 rounded-xl transition-all text-xs"
                >
                  <div className="font-semibold text-cyan-300 mb-0.5">{p.name}</div>
                  <div className="text-[11px] text-slate-400">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Matrix Input & Visual Output */}
          <div className="grid md:grid-cols-2 gap-6 items-start">
            {/* Left: Matrix Inputs */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-cyan-400" /> ضرایب ماتریس A:
                </span>
                <button
                  onClick={() => setMatrix({ a: 3, b: 5, c: -5, d: -3 })}
                  className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> بازنشانی به سوال ۵
                </button>
              </div>

              {/* 2x2 Grid Input */}
              <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 flex justify-center">
                <div className="inline-flex items-center gap-2">
                  <span className="text-2xl font-serif text-slate-500 font-light">[</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">a11 (a)</label>
                      <input
                        type="number"
                        value={matrix.a}
                        onChange={(e) => setMatrix({ ...matrix, a: parseFloat(e.target.value) || 0 })}
                        className="w-20 px-2 py-1.5 text-center font-mono font-bold bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">a12 (b)</label>
                      <input
                        type="number"
                        value={matrix.b}
                        onChange={(e) => setMatrix({ ...matrix, b: parseFloat(e.target.value) || 0 })}
                        className="w-20 px-2 py-1.5 text-center font-mono font-bold bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">a21 (c)</label>
                      <input
                        type="number"
                        value={matrix.c}
                        onChange={(e) => setMatrix({ ...matrix, c: parseFloat(e.target.value) || 0 })}
                        className="w-20 px-2 py-1.5 text-center font-mono font-bold bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">a22 (d)</label>
                      <input
                        type="number"
                        value={matrix.d}
                        onChange={(e) => setMatrix({ ...matrix, d: parseFloat(e.target.value) || 0 })}
                        className="w-20 px-2 py-1.5 text-center font-mono font-bold bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  <span className="text-2xl font-serif text-slate-500 font-light">]</span>
                </div>
              </div>

              {/* Direct KaTeX Matrix Render */}
              <div className="text-center">
                <span className="text-xs text-slate-400 block mb-1">نمایش لاتک ماتریس در برگه امتحان:</span>
                <BlockMath
                  math={`A = \\begin{pmatrix} ${matrix.a} & ${matrix.b} \\\\ ${matrix.c} & ${matrix.d} \\end{pmatrix}`}
                />
              </div>
            </div>

            {/* Right: Live Mathematical Analysis */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3.5">
              <span className="text-xs font-bold text-cyan-300 block">
                تحلیل گام‌به‌گام جبری:
              </span>

              {/* Trace & Det */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">اثر ماتریس (Trace):</span>
                  <InlineMath math={`\\text{tr}(A) = ${matrix.a} + (${matrix.d}) = ${matrixAnalysis.trace}`} />
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">دترمینان (Determinant):</span>
                  <InlineMath math={`\\det(A) = ad - bc = ${matrixAnalysis.det}`} />
                </div>
              </div>

              {/* Characteristic Equation */}
              <div>
                <span className="text-xs text-slate-400 block mb-1">معادله مشخصه:</span>
                <BlockMath math={`\\det(A - rI) = ${matrixAnalysis.characteristicEquationLatex}`} />
              </div>

              {/* Eigenvalues */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1 text-xs">
                <span className="text-slate-400 block">مقادیر ویژه به دست آمده:</span>
                {matrixAnalysis.type === 'complex' && (
                  <div className="text-amber-300 font-semibold">
                    <InlineMath
                      math={`r_{1,2} = ${matrixAnalysis.r1.real === 0 ? '' : matrixAnalysis.r1.real} \\pm ${matrixAnalysis.r1.imag}i`}
                    />
                    <span className="text-slate-400 text-[11px] block mt-1">
                      (ریشه‌های مزدوج مختلط؛ سیستم دارای رفتار نوسانی و نیازمند فرمول اویلر است)
                    </span>
                  </div>
                )}
                {matrixAnalysis.type === 'repeated_real' && (
                  <div className="text-amber-300 font-semibold">
                    <InlineMath math={`r_1 = r_2 = ${matrixAnalysis.r1.real}`} />
                    <span className="text-slate-400 text-[11px] block mt-1">
                      (ریشه مضاعف حقیقی؛ بررسی بعد بردار ویژه و در صورت نقص، استفاده از بردار تعمیم‌یافته)
                    </span>
                  </div>
                )}
                {matrixAnalysis.type === 'distinct_real' && (
                  <div className="text-amber-300 font-semibold">
                    <InlineMath
                      math={`r_1 = ${matrixAnalysis.r1.real.toFixed(2)}, \\quad r_2 = ${matrixAnalysis.r2.real.toFixed(2)}`}
                    />
                    <span className="text-slate-400 text-[11px] block mt-1">
                      (دو ریشه متمایز حقیقی؛ سیستم دارای دو بردار ویژه مستقل معمولی است)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Picard Iteration Step Simulator */}
      {activeTab === 'picard' && (
        <div className="mt-6 space-y-6">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-cyan-300 block">
                  مسئله مقدار اولیه مثال ۱.۷ جزوه دکتر شهروزی:
                </span>
                <InlineMath math="y' = 2y, \quad y(0) = 1" />
              </div>
              <div className="text-xs text-slate-400">
                معادله انتگرالی معادل: <InlineMath math="y(x) = 1 + \int_0^x 2y(t) \, dt" />
              </div>
            </div>

            {/* Step Control */}
            <div className="py-4 flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold text-slate-300">انتخاب مرتبه تقریب پیکارد (n):</span>
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3, 4, 5].map((step) => (
                  <button
                    key={step}
                    onClick={() => setPicardSteps(step)}
                    className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border transition-all ${
                      picardSteps === step
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    n = {step}
                  </button>
                ))}
              </div>
            </div>

            {/* Generated Polynomial */}
            <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800">
              <span className="text-xs font-semibold text-amber-400 block mb-1">
                جمله {picardSteps === 0 ? 'شروع' : 'تقریب متوالی'} <InlineMath math={`y_{${picardSteps}}(x)`} />:
              </span>
              <BlockMath
                math={`y_{${picardSteps}}(x) = ${
                  picardSteps === 0
                    ? '1'
                    : picardSteps === 1
                    ? '1 + 2x'
                    : picardSteps === 2
                    ? '1 + 2x + 2x^2'
                    : picardSteps === 3
                    ? '1 + 2x + 2x^2 + \\frac{4}{3}x^3'
                    : picardSteps === 4
                    ? '1 + 2x + 2x^2 + \\frac{4}{3}x^3 + \\frac{2}{3}x^4'
                    : '1 + 2x + 2x^2 + \\frac{4}{3}x^3 + \\frac{2}{3}x^4 + \\frac{4}{15}x^5'
                }`}
              />
              <div className="text-center text-xs text-slate-400 mt-2">
                فرمول کلی جمله عمومی: <InlineMath math="y_n(x) = \sum_{j=0}^n \frac{(2x)^j}{j!}" />
              </div>
            </div>

            {/* Numerical Convergence Checker */}
            <div className="mt-4 p-4 bg-slate-900/60 rounded-xl border border-slate-800 grid sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">نقطه ارزیابی x:</label>
                <input
                  type="range"
                  min="0.1"
                  max="1.5"
                  step="0.1"
                  value={evalX}
                  onChange={(e) => setEvalX(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <span className="font-mono text-cyan-300 font-bold block mt-1">x = {evalX}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">مقدار تقریب y_{picardSteps}({evalX}):</span>
                <span className="font-mono text-white text-sm font-bold block tabular-nums">
                  {picardApproxVal.toFixed(6)}
                </span>
                <span className="text-slate-500 text-[11px]">حاصل از {picardSteps + 1} جمله سری</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">جواب دقیق e^(2x) و خطا:</span>
                <span className="font-mono text-emerald-400 text-sm font-bold block tabular-nums">
                  {exactVal.toFixed(6)}
                </span>
                <span className="text-amber-400 font-mono text-[11px] tabular-nums">
                  خطای مطلق: {absError.toExponential(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Sturm Separation & Oscillations Explorer */}
      {activeTab === 'sturm' && (
        <div className="mt-6 space-y-6">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-5">
            {/* Context & Equations */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-cyan-300 block">
                  قضیه تفکیک ریشه‌های اشتورم (سوال ۸ میان‌ترم دکتر شهروزی):
                </span>
                <InlineMath math="y'' + y = 0 \implies y_1(t) = \cos t, \quad y_2(t) = \sin t" />
              </div>
              <div className="text-xs text-slate-400">
                فرمول رونسکین آبل: <InlineMath math="W(y_1, y_2)(t) = \cos^2 t + \sin^2 t = 1 > 0" />
              </div>
            </div>

            {/* Interactive SVG Plot of Sturm Separation */}
            <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  نمودار هندسی تفکیک ریشه‌ها و نسبت اکیداً یکنوای <InlineMath math="R(t) = \frac{y_2}{y_1}" />
                </span>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <span className="w-3 h-1 bg-cyan-400 rounded-full inline-block" />
                    <InlineMath math="y_1(t) = \cos t" />
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <span className="w-3 h-1 bg-amber-400 rounded-full inline-block" />
                    <InlineMath math="y_2(t) = \sin t" />
                  </span>
                </div>
              </div>

              {/* SVG Canvas */}
              <div className="w-full overflow-x-auto flex justify-center py-2">
                <svg
                  viewBox="0 0 520 200"
                  className="w-full max-w-2xl h-48 bg-slate-950 rounded-xl border border-slate-800 select-none"
                >
                  {/* Grid Lines */}
                  <line x1="20" y1="100" x2="500" y2="100" stroke="#334155" strokeWidth="1.5" />
                  <line x1="260" y1="20" x2="260" y2="180" stroke="#334155" strokeWidth="1.5" />

                  {/* Vertical markers for roots of y1: t1 = -pi/2 (-1.57), t2 = pi/2 (1.57) */}
                  {/* Scale: X = 260 + t * 110 */}
                  {/* t1 = -1.57 => X = 260 - 172.7 = 87.3 */}
                  <line x1="87" y1="20" x2="87" y2="180" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4 4" />
                  <text x="87" y="195" fill="#f43f5e" fontSize="11" textAnchor="middle" fontFamily="monospace">
                    t1 = -π/2 (ریشه y1)
                  </text>

                  {/* t2 = +1.57 => X = 260 + 172.7 = 432.7 */}
                  <line x1="433" y1="20" x2="433" y2="180" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4 4" />
                  <text x="433" y="195" fill="#f43f5e" fontSize="11" textAnchor="middle" fontFamily="monospace">
                    t2 = +π/2 (ریشه y1)
                  </text>

                  {/* Interior root of y2 at t=0 => X = 260 */}
                  <circle cx="260" cy="100" r="5" fill="#10b981" />
                  <text x="260" y="85" fill="#10b981" fontSize="11" textAnchor="middle" fontWeight="bold">
                    t=0 (تک ریشه y2 مابین دو ریشه y1)
                  </text>

                  {/* Curve for y1 = cos(t): t from -2.0 to +2.0 */}
                  {/* Y = 100 - cos(t) * 60 */}
                  <path
                    d={`M ${Array.from({ length: 81 })
                      .map((_, i) => {
                        const t = -2.0 + (i / 80) * 4.0;
                        const x = 260 + t * 110;
                        const y = 100 - Math.cos(t) * 60;
                        return `${x.toFixed(1)},${y.toFixed(1)}`;
                      })
                      .join(' L ')}`}
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="2.5"
                  />

                  {/* Curve for y2 = sin(t): t from -2.0 to +2.0 */}
                  {/* Y = 100 - sin(t) * 60 */}
                  <path
                    d={`M ${Array.from({ length: 81 })
                      .map((_, i) => {
                        const t = -2.0 + (i / 80) * 4.0;
                        const x = 260 + t * 110;
                        const y = 100 - Math.sin(t) * 60;
                        return `${x.toFixed(1)},${y.toFixed(1)}`;
                      })
                      .join(' L ')}`}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                  />

                  {/* Current T Tracker Line & Dots */}
                  {(() => {
                    const curX = 260 + sturmT * 110;
                    const curY1 = 100 - sturmY1 * 60;
                    const curY2 = 100 - sturmY2 * 60;
                    return (
                      <g>
                        <line x1={curX} y1="20" x2={curX} y2="180" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
                        <circle cx={curX} cy={curY1} r="4" fill="#22d3ee" stroke="#fff" strokeWidth="1" />
                        <circle cx={curX} cy={curY2} r="4" fill="#f59e0b" stroke="#fff" strokeWidth="1" />
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Slider for Sturm evaluation point */}
              <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="text-slate-300 font-medium">
                    حرکت نقطه ارزیابی t درون فاصله ریشه‌ها <span dir="ltr" className="inline-block font-mono text-cyan-300 px-1 font-bold">(-π/2, +π/2)</span>:
                  </label>
                  <span className="font-mono text-cyan-300 font-bold tabular-nums">
                    t = {sturmT.toFixed(2)} رادیان
                  </span>
                </div>
                <input
                  type="range"
                  min="-1.50"
                  max="1.50"
                  step="0.05"
                  value={sturmT}
                  onChange={(e) => setSturmT(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Live Calculated Mathematical Values */}
              <div className="mt-4 grid sm:grid-cols-4 gap-2.5 text-xs text-center">
                <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">مقدار <InlineMath math="y_1(t) = \cos t" />:</span>
                  <span className="font-mono font-bold text-cyan-300 tabular-nums text-sm">
                    {sturmY1.toFixed(4)}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">مقدار <InlineMath math="y_2(t) = \sin t" />:</span>
                  <span className="font-mono font-bold text-amber-300 tabular-nums text-sm">
                    {sturmY2.toFixed(4)}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">رونسکین <InlineMath math="W(y_1, y_2)" />:</span>
                  <span className="font-mono font-bold text-emerald-400 tabular-nums text-sm">
                    {sturmWronskian.toFixed(2)} (همواره ۱)
                  </span>
                </div>
                <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">مشتق نسبت <InlineMath math="R'(t) = \frac{W}{y_1^2}" />:</span>
                  <span className="font-mono font-bold text-purple-300 tabular-nums text-sm">
                    {sturmRatioDeriv.toFixed(4)} {'>'} 0
                  </span>
                </div>
              </div>
            </div>

            {/* Proof Card: Why x'' + (t+1)x = 0 has infinite roots (Question 7) */}
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                تحلیل تکمیلی سوال ۷ میان‌ترم: اثبات نامتناهی بودن صفرهای معادله <InlineMath math="x'' + (t+1)x = 0" />
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                طبق <strong>قضیه مقایسه اشتورم (Sturm Comparison)</strong>، برای هر <InlineMath math="t \ge 0" /> داریم <InlineMath math="q(t) = t + 1 \ge 1" />.
                چون معادله مقایسه‌ای <InlineMath math="y'' + 1\cdot y = 0" /> دارای جواب <InlineMath math="y = \sin t" /> با صفرهای متوالی به فاصله <InlineMath math="\pi" /> است،
                بین هر دو صفر متوالی <InlineMath math="\sin t" /> حتماً حداقل یک صفر از <InlineMath math="x(t)" /> قرار می‌گیرد.
                چون تعداد بازه‌های با طول <InlineMath math="\pi" /> تا بی‌نهایت ادامه دارد، پس <InlineMath math="x(t)" /> دارای <strong>تعداد نامتناهی صفر مثبت</strong> است!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Gronwall Error Bound Calculator */}
      {activeTab === 'gronwall' && (
        <div className="mt-6 space-y-6">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-amber-300 block">
                  محاسبه‌گر کران خطای گرونوال (سوال ۲ میان‌ترم و فصل ۱ جزوه):
                </span>
                <InlineMath math="|y(x) - \tilde{y}(x)| \le M |x_1 - x_0| e^{L |x - x_1|}" />
              </div>
              <div className="text-xs text-slate-400">
                وابستگی پیوسته جواب‌ها به تغییر نقطه شروع
              </div>
            </div>

            {/* Interactive Sliders & Live Results */}
            <div className="grid md:grid-cols-2 gap-6 items-start">
              {/* Sliders Box */}
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-4">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  تنظیم پارامترهای مسئله دیفرانسیل:
                </span>

                {/* Slider M */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">کران بالای میدان تابع <InlineMath math="M \ge |f(x,y)|" />:</span>
                    <span className="font-mono text-amber-300 font-bold">M = {gronwallM.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="5.0"
                    step="0.5"
                    value={gronwallM}
                    onChange={(e) => setGronwallM(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                {/* Slider Delta x0 */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">جابه‌جایی نقطه شروع <InlineMath math="|x_1 - x_0|" />:</span>
                    <span className="font-mono text-cyan-300 font-bold">|x1 - x0| = {gronwallDeltaX0.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.50"
                    step="0.01"
                    value={gronwallDeltaX0}
                    onChange={(e) => setGronwallDeltaX0(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                {/* Slider L */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">ثابت لیپشیتز <InlineMath math="L" />:</span>
                    <span className="font-mono text-emerald-300 font-bold">L = {gronwallL.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="4.0"
                    step="0.1"
                    value={gronwallL}
                    onChange={(e) => setGronwallL(parseFloat(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>

                {/* Slider Distance |x - x1| */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">فاصله از مبدأ ثانویه <InlineMath math="|x - x_1|" />:</span>
                    <span className="font-mono text-purple-300 font-bold">|x - x1| = {gronwallDist.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="2.5"
                    step="0.1"
                    value={gronwallDist}
                    onChange={(e) => setGronwallDist(parseFloat(e.target.value))}
                    className="w-full accent-purple-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Calculated Outputs & Explanation */}
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-4">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-emerald-400" />
                  تفکیک و محاسبه اجزای کران گرونوال:
                </span>

                {/* Step 1: Initial Drift */}
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-400">۱. لغزش اولیه در نقطه <InlineMath math="x_1" />:</span>
                    <span className="font-mono text-cyan-300 font-bold">
                      {(gronwallM * gronwallDeltaX0).toFixed(4)}
                    </span>
                  </div>
                  <InlineMath math={`M \\cdot |x_1 - x_0| = ${gronwallM} \\times ${gronwallDeltaX0} = ${(gronwallM * gronwallDeltaX0).toFixed(4)}`} />
                </div>

                {/* Step 2: Exponential Amplification */}
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-400">۲. ضریب تشدید نمایی گرونوال:</span>
                    <span className="font-mono text-emerald-300 font-bold">
                      {Math.exp(gronwallL * gronwallDist).toFixed(4)}
                    </span>
                  </div>
                  <InlineMath math={`e^{L|x - x_1|} = e^{${gronwallL} \\times ${gronwallDist}} = e^{${(gronwallL * gronwallDist).toFixed(2)}}`} />
                </div>

                {/* Step 3: Total Maximum Bound */}
                <div className="p-4 bg-gradient-to-r from-amber-500/10 via-slate-950 to-slate-950 rounded-xl border border-amber-500/30 text-xs space-y-1.5">
                  <span className="text-amber-400 font-bold block">
                    ۳. حداکثر خطای قطعی تفاضل جواب‌ها در نقطه <InlineMath math="x" />:
                  </span>
                  <div className="font-mono text-2xl font-black text-amber-300 tabular-nums">
                    {gronwallBound.toFixed(4)}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    با میل دادن <InlineMath math="x_1 \to x_0" />، مقدار خطا به سمت صفر میل می‌کند که اثبات پایداری پیوسته است.
                  </p>
                </div>
              </div>
            </div>

            {/* Exam Trap Alert */}
            <div className="p-4 bg-rose-950/20 rounded-xl border border-rose-500/30 text-xs text-rose-200 space-y-1">
              <strong className="text-rose-400 font-bold block flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                تله نمره‌کم‌کن دکتر شهروزی در سوال ۲ میان‌ترم:
              </strong>
              <p className="leading-relaxed">
                حتماً دقت کنید که توان تابع نمایی برابر <InlineMath math="|x - x_1|" /> است نه <InlineMath math="|x - x_0|" />!
                زیرا انتگرال تفاضلی <InlineMath math="\int_{x_1}^x |f(t,y) - f(t,\tilde{y})| dt" /> از نقطه <InlineMath math="x_1" /> آغاز شده است و استفاده از لم گرونوال مبدأ زمانی <InlineMath math="x_1" /> را می‌طلبد.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

