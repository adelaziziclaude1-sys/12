import React, { useState, useEffect, useMemo } from 'react';
import { CURRICULUM_MODULES } from './data/curriculumData';
import { MasteryStatus } from './types/curriculum';
import { computeMasteryStats } from './utils/mathCalculations';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MasteryBar } from './components/MasteryBar';
import { ModuleCard } from './components/ModuleCard';
import { InteractiveSimulators } from './components/InteractiveSimulators';
import { FormulaVaultModal } from './components/FormulaVaultModal';
import { MockExamModal } from './components/MockExamModal';
import confetti from 'canvas-confetti';
import { Search, Sparkles, BookOpen } from 'lucide-react';

const STORAGE_KEY = 'ode_shahroozi_exam_mastery_v1';

export default function App() {
  // Mastery scores state with LocalStorage persistence
  const [masteryScores, setMasteryScores] = useState<Record<string, MasteryStatus>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return {
      'module-1-eigenvalues-complex': 'unseen',
      'module-2-repeated-generalized-eigenvectors': 'unseen',
      'module-3-matrix-exponential-variation-of-parameters': 'unseen',
      'module-4-picard-existence-uniqueness': 'unseen',
      'module-5-gronwall-lemma-continuous-dependence': 'unseen',
      'module-6-self-adjoint-infinite-zeros': 'unseen',
      'module-7-abel-formula-sturm-theorems': 'unseen',
      'module-8-safety-net': 'unseen',
    };
  });

  const [activeFilter, setActiveFilter] = useState<'all' | 'phase1' | 'review' | 'struggling'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isMockExamOpen, setIsMockExamOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(masteryScores));
    } catch {
      // Ignore
    }
  }, [masteryScores]);

  // Compute weights mapping
  const moduleWeights = useMemo(() => {
    const map: Record<string, number> = {};
    CURRICULUM_MODULES.forEach((m) => {
      map[m.id] = m.scoreWeight;
    });
    return map;
  }, []);

  // Compute live stats
  const stats = useMemo(() => {
    return computeMasteryStats(masteryScores, moduleWeights);
  }, [masteryScores, moduleWeights]);

  // Update status handler
  const handleStatusChange = (moduleId: string, newStatus: MasteryStatus) => {
    setMasteryScores((prev) => {
      const next = { ...prev, [moduleId]: newStatus };
      // Check if user mastered all Phase 1 modules
      const phase1Ids = ['module-1-eigenvalues-complex', 'module-2-repeated-generalized-eigenvectors', 'module-3-matrix-exponential-variation-of-parameters'];
      const allPhase1Mastered = phase1Ids.every((id) => (id === moduleId ? newStatus === 'mastered' : next[id] === 'mastered'));
      if (allPhase1Mastered && newStatus === 'mastered') {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      }
      return next;
    });
  };

  const handleResetMastery = () => {
    if (window.confirm('آیا مطمئن هستید که می‌خواهید وضعیت تسلط همه مباحث را بازنشانی کنید؟')) {
      const resetState: Record<string, MasteryStatus> = {};
      CURRICULUM_MODULES.forEach((m) => {
        resetState[m.id] = 'unseen';
      });
      setMasteryScores(resetState);
    }
  };

  const handleJumpToPhase1 = () => {
    setActiveFilter('phase1');
    const el = document.getElementById('module-1-eigenvalues-complex');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter modules
  const filteredModules = useMemo(() => {
    return CURRICULUM_MODULES.filter((module) => {
      // Filter by category/status
      if (activeFilter === 'phase1' && module.phase !== 1) {
        return false;
      }
      if (activeFilter === 'review' && masteryScores[module.id] !== 'review') {
        return false;
      }
      if (activeFilter === 'struggling' && masteryScores[module.id] !== 'struggling') {
        return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = module.title.toLowerCase().includes(q);
        const matchesSubtitle = module.subtitle.toLowerCase().includes(q);
        const matchesRef = module.examQuestionRef.toLowerCase().includes(q);
        const matchesChapter = module.chapter.toLowerCase().includes(q);
        const matchesSummary = module.summaryBulletPoints.some((p) => p.toLowerCase().includes(q));
        return matchesTitle || matchesSubtitle || matchesRef || matchesChapter || matchesSummary;
      }

      return true;
    });
  }, [activeFilter, searchQuery, masteryScores]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Top Header */}
      <Header
        onOpenVault={() => setIsVaultOpen(true)}
        onOpenMockExam={() => setIsMockExamOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        <HeroSection
          onOpenVault={() => setIsVaultOpen(true)}
          onOpenMockExam={() => setIsMockExamOpen(true)}
          onJumpToPhase1={handleJumpToPhase1}
        />

        {/* Real-time Mastery & Exam Readiness Bar */}
        <div className="mt-8">
          <MasteryBar
            stats={stats}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onResetMastery={handleResetMastery}
          />
        </div>

        {/* Interactive Simulators Playground */}
        <InteractiveSimulators />

        {/* Search & Topic Filters */}
        <div id="modules" className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 scroll-mt-24">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">
              سرفصل‌ها و سوالات قطعی امتحانی ({filteredModules.length} مبحث)
            </h2>
          </div>

          <div className="relative max-w-xs w-full">
            <input
              type="text"
              placeholder="جستجو در مباحث، سوالات یا فرمول‌ها..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-9 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <Search className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
          </div>
        </div>

        {/* Modules List */}
        {filteredModules.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
            <p className="text-slate-400 text-sm">هیچ مبحثی با این فیلتر یا عبارت جستجو یافت نشد.</p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="text-xs text-amber-400 hover:underline"
            >
              پاک کردن فیلترها و مشاهده همه مباحث
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredModules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                status={masteryScores[module.id] || 'unseen'}
                onStatusChange={handleStatusChange}
                defaultExpanded={module.phase === 1} // Phase 1 expanded by default for instant exam prep
              />
            ))}
          </div>
        )}

        {/* Quick Review Note on Friday Night */}
        <div className="mt-12 p-6 bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 rounded-2xl text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>توصیه طلایی استاد برای عصر جمعه (شب امتحان)</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            فقط کافی است فیلتر «مرور سریع عصر جمعه (زردها)» را فعال کنید
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            مباحثی را که علامت زرد زدید در عرض کمتر از ۱ ساعت مرور کنید و تله‌های نمره‌کم‌کن هر ماژول را در ذهنتان تثبیت کنید.
            با تسلط بر فاز ۱ (دستگاه‌ها) و یکی از اثبات‌های گرونوال یا پیکارد، قبولی با نمره بالای ۱۷ قطعی خواهد بود!
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900 py-8 text-center text-xs text-slate-400">
        <p className="max-w-xl mx-auto leading-relaxed">
          سامانه آموزش تعاملی و آمادگی امتحان نظریه معادلات دیفرانسیل عادی (دکتر شهروزی) · طراحی شده با رویکرد آموزش از صفر مطلق، عایق‌بندی کامل فرمول‌های ریاضی KaTeX و شابلون ۶ لایه‌ای حل امتحانی
        </p>
      </footer>

      {/* Formula Vault Modal */}
      <FormulaVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
      />

      {/* Mock Exam Simulator Modal */}
      <MockExamModal
        isOpen={isMockExamOpen}
        onClose={() => setIsMockExamOpen(false)}
      />
    </div>
  );
}
