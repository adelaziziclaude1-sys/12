import React, { useState } from 'react';
import { CurriculumModule, MasteryStatus } from '../types/curriculum';
import { InlineMath, BlockMath } from './MathView';
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  FileText,
  HelpCircle,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

interface ModuleCardProps {
  module: CurriculumModule;
  status: MasteryStatus;
  onStatusChange: (moduleId: string, newStatus: MasteryStatus) => void;
  defaultExpanded?: boolean;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  status,
  onStatusChange,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showFlashAnswer, setShowFlashAnswer] = useState(false);
  const [showTwinSolution, setShowTwinSolution] = useState(false);

  // Status indicator styling
  const statusConfig = {
    mastered: {
      label: 'مسلط شدم',
      icon: CheckCircle2,
      border: 'border-emerald-500/40',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      indicatorBg: 'bg-emerald-500',
    },
    review: {
      label: 'نیاز به مرور (عصر جمعه)',
      icon: AlertTriangle,
      border: 'border-amber-500/40',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      indicatorBg: 'bg-amber-400',
    },
    struggling: {
      label: 'ضعیف / مطالعه مجدد',
      icon: ShieldAlert,
      border: 'border-rose-500/40',
      badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      indicatorBg: 'bg-rose-500',
    },
    unseen: {
      label: 'هنوز مطالعه نشده',
      icon: HelpCircle,
      border: 'border-slate-800',
      badgeBg: 'bg-slate-800/60 text-slate-400 border-slate-700/40',
      indicatorBg: 'bg-slate-600',
    },
  }[status];

  const StatusIcon = statusConfig.icon;

  return (
    <article
      id={module.id}
      className={`bg-slate-900/80 rounded-2xl border ${statusConfig.border} transition-all duration-300 shadow-lg overflow-hidden mb-8 scroll-mt-24`}
    >
      {/* Header bar */}
      <div className="p-5 sm:p-6 bg-slate-900 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center shrink-0 font-mono font-bold text-amber-400">
            {module.number}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-1">
              <span className="text-amber-400 font-semibold">{module.chapter}</span>
              <span aria-hidden="true">·</span>
              <span>بارم امتحانی: {module.scoreWeight} نمره</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-slate-300">⏱️ {module.estimatedTimeMin} دقیقه</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400/90 font-medium">{module.priority}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {module.title}
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">{module.subtitle}</p>
          </div>
        </div>

        {/* Action button & Status */}
        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-medium ${statusConfig.badgeBg}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{statusConfig.label}</span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
          >
            <span>{isExpanded ? 'بستن مبحث' : 'مشاهده آموزش کامل'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main body: 6-Layer Architecture */}
      {isExpanded && (
        <div className="p-5 sm:p-7 space-y-8 bg-slate-950/40">
          {/* Key Summary bullet points */}
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/80">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400/90 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> چکیده اهداف یادگیری شب امتحان:
            </h3>
            <ul className="grid sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-300">
              {module.summaryBulletPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold shrink-0 mt-0.5">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ========================================================================= */}
          {/* LAYER 0: پل پیشنیاز (Prerequisite Bridge) */}
          {/* ========================================================================= */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                لایه ۰
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-400" />
                پل پیشنیاز جبری (قبل از شروع این را بدانید)
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {module.layer0_prerequisites.intro}
            </p>
            <div className="grid md:grid-cols-2 gap-3.5">
              {module.layer0_prerequisites.items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-xs sm:text-sm"
                >
                  <h4 className="font-semibold text-blue-300 mb-1">{item.title}</h4>
                  <p className="text-slate-300 mb-2 leading-relaxed">{item.explanation}</p>
                  {item.formulaLatex && <BlockMath math={item.formulaLatex} />}
                  {item.tip && (
                    <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
                      💡 نکته: {item.tip}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ========================================================================= */}
          {/* LAYER 1: شهود و مفهوم به زبان ساده (Intuition & Flash Reveal) */}
          {/* ========================================================================= */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                لایه ۱
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-emerald-400" />
                شهود و مفهوم به زبان آدمیزاد (بدون نمادهای ترسناک)
              </h3>
            </div>

            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5 space-y-3">
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                {module.layer1_intuition.plainLanguageIntro}
              </p>
              <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
                🎯 <strong className="text-emerald-300">تشبیه ذهنی:</strong>{' '}
                {module.layer1_intuition.analogy}
              </div>

              {/* Flash-Reveal Card (کارت تفکر و پاسخ سریع) */}
              <div className="mt-4 pt-4 border-t border-slate-800/90">
                <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> کارت تفکر و خودآزمایی سریع (Flash-Reveal)
                    </span>
                    <button
                      onClick={() => setShowFlashAnswer(!showFlashAnswer)}
                      className="flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-md border border-amber-500/30 transition-colors"
                    >
                      {showFlashAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showFlashAnswer ? 'مخفی‌سازی پاسخ' : 'بررسی فکر من'}</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-white mb-2 leading-relaxed">
                    ❓ {module.layer1_intuition.flashCard.question}
                  </p>
                  <p className="text-xs text-slate-400 mb-3">
                    🔍 سرنخ: {module.layer1_intuition.flashCard.hint}
                  </p>

                  {showFlashAnswer && (
                    <div className="bg-slate-900 rounded-lg p-3 text-xs sm:text-sm border border-slate-700/80 space-y-2 transition-all">
                      <div className="text-emerald-300 leading-relaxed">
                        ✅ <strong>پاسخ دقیق:</strong> {module.layer1_intuition.flashCard.answer}
                      </div>
                      <div className="text-amber-300/90 text-xs font-semibold pt-1 border-t border-slate-800">
                        ⚡ نتیجه کلیدی برای برگه: {module.layer1_intuition.flashCard.takeaway}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* LAYER 2: جعبه‌ابزار رسمی (Official Toolkit) */}
          {/* ========================================================================= */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                لایه ۲
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-purple-400" />
                جعبه‌ابزار رسمی (فرمول‌ها و قضایای قطعی برگه امتحان)
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              {module.layer2_toolkit.intro}
            </p>
            <div className="space-y-3">
              {module.layer2_toolkit.items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-purple-300 font-semibold">
                    <span>{item.title}</span>
                    <span className="text-[11px] text-slate-500 font-normal">{item.referenceNote}</span>
                  </div>
                  <p className="text-slate-300">{item.statementFa}</p>
                  <BlockMath math={item.formulaLatex} />
                  {item.conditions.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {item.conditions.map((cond, cIdx) => (
                        <span
                          key={cIdx}
                          className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800"
                        >
                          {cond}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ========================================================================= */}
          {/* LAYER 3: شابلون حل امتحانی گام‌به‌گام (Step-by-Step Exam Template) */}
          {/* ========================================================================= */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                لایه ۳
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-400" />
                شابلون حل امتحانی خط‌به‌خط (برای گرفتن ۲۰ کامل)
              </h3>
            </div>

            <div className="bg-slate-900/95 border border-amber-500/30 rounded-2xl p-5 space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <span className="text-xs text-amber-400 font-semibold block mb-1">
                  📝 {module.layer3_examTemplate.examQuestionMeta}
                </span>
                <p className="text-sm sm:text-base font-medium text-white leading-relaxed">
                  {module.layer3_examTemplate.problemStatement}
                </p>
              </div>

              {/* Step by step */}
              <div className="space-y-4">
                {module.layer3_examTemplate.steps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm space-y-2 relative"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        {step.stepNumber}
                      </span>
                      <h4 className="font-semibold text-slate-100">{step.stepTitle}</h4>
                    </div>

                    <div className="text-slate-300 pr-8 leading-relaxed">
                      <p className="mb-2 text-slate-300 bg-slate-900/50 p-2.5 rounded border border-slate-800/80 font-serif">
                        ✍️ <span className="text-slate-200">عبارت پیشنهادی برای پاسخ‌نامه:</span>{' '}
                        {step.examSheetText}
                      </p>
                      <BlockMath math={step.mathFormulaLatex} />
                      <div className="text-[11px] text-amber-300/80 bg-amber-950/10 p-2 rounded border border-amber-500/10">
                        💡 <strong>نکته تصحیح استاد:</strong> {step.keyNote}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Final Answer Box */}
              <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-4 text-center">
                <span className="text-xs font-semibold text-emerald-400 block mb-1">
                  🏁 پاسخ نهایی مورد انتظار در انتهای پاسخ‌نامه:
                </span>
                <BlockMath math={module.layer3_examTemplate.finalAnswerSummary} />
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* LAYER 4: تله‌های نمره‌کم‌کن استاد (Professor's Traps) */}
          {/* ========================================================================= */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                لایه ۴
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                تله‌های نمره‌کم‌کن استاد (دکتر شهروزی از کجا نمره کم می‌کند؟)
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              {module.layer4_traps.intro}
            </p>
            <div className="grid md:grid-cols-2 gap-3.5">
              {module.layer4_traps.traps.map((trap, idx) => (
                <div
                  key={idx}
                  className="bg-rose-950/10 border border-rose-500/30 rounded-xl p-4 text-xs sm:text-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-rose-300">{trap.title}</h4>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                      {trap.severity === 'high' ? 'کسر نمره سنگین' : 'خطای متداول'}
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    ⚠️ <strong>دام:</strong> {trap.trapDescription}
                  </p>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    🔍 <strong>دلیل کسر نمره:</strong> {trap.deductionReason}
                  </p>
                  <div className="pt-2 border-t border-rose-500/20 text-emerald-300 text-xs font-medium">
                    🛡️ <strong>چگونه نمره را نجات دهیم:</strong> {trap.howToAvoid}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ========================================================================= */}
          {/* LAYER 5: مسئله دوقلو / شبیه‌ساز (Twin Problem) */}
          {/* ========================================================================= */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                لایه ۵
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                مسئله دوقلو (شبیه‌ساز فعال با اعداد جدید)
              </h3>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
              <p className="text-sm text-slate-200 font-medium leading-relaxed">
                🎯 {module.layer5_twinProblem.problemStatement}
              </p>
              {module.layer5_twinProblem.mathFormulaLatex && (
                <BlockMath math={module.layer5_twinProblem.mathFormulaLatex} />
              )}
              <p className="text-xs text-slate-400">
                🔍 راهنمایی: {module.layer5_twinProblem.hint}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => setShowTwinSolution(!showTwinSolution)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 rounded-lg border border-cyan-500/30 transition-colors"
                >
                  {showTwinSolution ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showTwinSolution ? 'مخفی‌سازی پاسخ تشریحی' : 'مشاهده پاسخ تشریحی کامل'}</span>
                </button>

                {showTwinSolution && (
                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 bg-slate-950/60 p-4 rounded-xl">
                    {module.layer5_twinProblem.fullSolutionSteps.map((s, sIdx) => (
                      <div key={sIdx} className="text-xs sm:text-sm space-y-1">
                        <span className="font-semibold text-cyan-300">{s.title}:</span>
                        <p className="text-slate-300">{s.description}</p>
                        <BlockMath math={s.mathLatex} />
                      </div>
                    ))}
                    <div className="pt-2 border-t border-slate-800 text-center">
                      <span className="text-xs font-medium text-emerald-400">پاسخ نهایی مسئله دوقلو:</span>
                      <BlockMath math={module.layer5_twinProblem.finalAnswerLatex} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* MASTERY TRAFFIC LIGHT CONTROLLER */}
          {/* ========================================================================= */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              🚦 وضعیت تسلط شما بر این مبحث (ذخیره خودکار در مرورگر):
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onStatusChange(module.id, 'mastered')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  status === 'mastered'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-400'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>🟢 مسلط شدم</span>
              </button>

              <button
                onClick={() => onStatusChange(module.id, 'review')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  status === 'review'
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-amber-400/50 hover:text-amber-400'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>🟡 نیاز به مرور (عصر جمعه)</span>
              </button>

              <button
                onClick={() => onStatusChange(module.id, 'struggling')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  status === 'struggling'
                    ? 'bg-rose-500 text-white border-rose-400 font-bold shadow-md shadow-rose-500/20'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-rose-500/50 hover:text-rose-400'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>🔴 ضعیف / مطالعه مجدد</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
