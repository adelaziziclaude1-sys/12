import React from 'react';
import { MasteryStats } from '../utils/mathCalculations';
import { CheckCircle2, AlertCircle, RefreshCw, Trophy, Flame } from 'lucide-react';

interface MasteryBarProps {
  stats: MasteryStats;
  activeFilter: 'all' | 'phase1' | 'review' | 'struggling';
  onFilterChange: (filter: 'all' | 'phase1' | 'review' | 'struggling') => void;
  onResetMastery: () => void;
}

export const MasteryBar: React.FC<MasteryBarProps> = ({
  stats,
  activeFilter,
  onFilterChange,
  onResetMastery,
}) => {
  return (
    <div className="bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg mb-8">
      {/* Top row: Readiness score & quick status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-amber-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> آمادگی برای امتحان شنبه دکتر شهروزی
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs text-slate-400">نمره تخمینی فعلی</span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
                {stats.estimatedExamScore.toFixed(1)}
              </span>
              <span className="text-sm font-medium text-slate-400">از ۲۰ نمره</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30 mr-2 tabular-nums">
                {stats.percentageReady}٪ تکمیل
              </span>
            </div>
          </div>
        </div>

        {/* Status badges count */}
        <div className="flex items-center gap-3 text-xs sm:text-sm font-medium">
          <button
            onClick={() => onFilterChange('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              activeFilter === 'all'
                ? 'bg-slate-800 border-slate-600 text-white'
                : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>کل مباحث:</span>
            <span className="font-mono font-bold text-white tabular-nums">{stats.totalModules}</span>
          </button>

          <button
            onClick={() => onFilterChange('review')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              activeFilter === 'review'
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
            }`}
            title="فیلتر مباحث نیازمند مرور برای عصر جمعه"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>نیاز به مرور:</span>
            <span className="font-mono font-bold tabular-nums">{stats.reviewCount}</span>
          </button>

          <button
            onClick={() => onFilterChange('struggling')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              activeFilter === 'struggling'
                ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
            }`}
            title="فیلتر مباحث ضعیف"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>ضعیف:</span>
            <span className="font-mono font-bold tabular-nums">{stats.strugglingCount}</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>مسلط:</span>
            <span className="font-mono font-bold tabular-nums">{stats.masteredCount}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="h-2.5 w-full bg-slate-800/80 rounded-full overflow-hidden flex">
          <div
            className="bg-emerald-500 transition-all duration-500 h-full"
            style={{ width: `${(stats.masteredCount / stats.totalModules) * 100}%` }}
            title={`مسلط: ${stats.masteredCount}`}
          />
          <div
            className="bg-amber-400 transition-all duration-500 h-full"
            style={{ width: `${(stats.reviewCount / stats.totalModules) * 100}%` }}
            title={`مرور عصر جمعه: ${stats.reviewCount}`}
          />
          <div
            className="bg-rose-500 transition-all duration-500 h-full"
            style={{ width: `${(stats.strugglingCount / stats.totalModules) * 100}%` }}
            title={`ضعیف: ${stats.strugglingCount}`}
          />
        </div>
      </div>

      {/* Filter Tabs bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 text-xs border-t border-slate-800/60 text-slate-400">
        <div className="flex items-center gap-2">
          <span>فیلتر نمایش:</span>
          <button
            onClick={() => onFilterChange('all')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeFilter === 'all' ? 'bg-amber-500 text-slate-950 font-semibold' : 'hover:text-white'
            }`}
          >
            همه مباحث (۸ ماژول)
          </button>
          <button
            onClick={() => onFilterChange('phase1')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeFilter === 'phase1' ? 'bg-amber-500 text-slate-950 font-semibold' : 'hover:text-white'
            }`}
          >
            فاز ۱: بانک نمره تضمینی (دستگاه‌ها - ۱۲ نمره قطعی)
          </button>
          <button
            onClick={() => onFilterChange('review')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeFilter === 'review' ? 'bg-amber-500 text-slate-950 font-semibold' : 'hover:text-white'
            }`}
          >
            مرور سریع عصر جمعه (زردها)
          </button>
        </div>

        <button
          onClick={onResetMastery}
          className="text-slate-500 hover:text-slate-300 underline underline-offset-4 transition-colors text-[11px]"
        >
          بازنشانی ردیاب تسلط
        </button>
      </div>
    </div>
  );
};
