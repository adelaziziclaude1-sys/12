import React from 'react';
import { Sparkles, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  onOpenVault: () => void;
  onOpenMockExam: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenVault,
  onOpenMockExam,
  isDarkMode,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title wordmark (single text element, no subtitle) */}
        <a
          href="#"
          className="text-base sm:text-lg font-bold tracking-tight text-white hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
        >
          نظریه معادلات دیفرانسیل · دکتر شهروزی
        </a>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a
            href="#modules"
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            سرفصل‌های امتحانی
          </a>
          <a
            href="#module-1-eigenvalues-complex"
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            فاز ۱: بانک نمره تضمینی
          </a>
          <a
            href="#simulators"
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            آزمایشگاه تعاملی
          </a>
          <button
            onClick={onOpenMockExam}
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 text-right cursor-pointer"
          >
            آزمون شبیه‌ساز (۸ سوال)
          </button>
          <button
            onClick={onOpenVault}
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 text-right cursor-pointer"
          >
            فرمول‌های طلایی
          </button>
        </nav>

        {/* Zone 3: 1 primary action & theme toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleTheme}
            aria-label="تغییر حالت مطالعه شبانه و روز"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenVault}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>خزانه فرمول‌های شب امتحان</span>
          </button>
        </div>
      </div>
    </header>
  );
};
