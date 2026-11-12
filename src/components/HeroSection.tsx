import React from 'react';
import { ArrowDown, Flame, CheckCircle, GraduationCap, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  onOpenVault: () => void;
  onOpenMockExam: () => void;
  onJumpToPhase1: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenVault,
  onOpenMockExam,
  onJumpToPhase1,
}) => {
  return (
    <section className="relative pt-8 pb-10 sm:pt-12 sm:pb-14 border-b border-slate-800/80">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        {/* Urgent Exam Notice */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>برنامه نجات ویژه امتحان روز شنبه · نظریه معادلات دیفرانسیل (دکتر شهروزی)</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight sm:leading-tight">
          آمادگی فوق‌سریع و مفهومی از <span className="text-amber-400">صفر مطلق</span> برای بالاترین نمره
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          اگر در طول ترم سر کلاس‌ها نبوده‌اید، نگران نباشید! این سامانه با تمرکز بر تیپ‌های قطعی امتحانی،
          آموزش صمیمی بدون نمادهای مبهم و شابلون ۶ لایه‌ای حل تشریحی خط‌به‌خط، دقیقاً شما را به همان پاسخی می‌رساند
          که دکتر شهروزی به آن نمره کامل می‌دهد.
        </p>

        {/* 3 Core Pillars */}
        <div className="grid sm:grid-cols-3 gap-3 pt-2 text-xs sm:text-sm text-slate-300 max-w-3xl mx-auto text-right">
          <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-semibold mb-0.5">فاز ۱: بانک نمره تضمینی (۱۲ نمره)</strong>
              <span>مقادیر ویژه، بردار تعمیم‌یافته و ماتریس نمایی e^(At) با کمترین سختی و بالاترین بازده</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-semibold mb-0.5">تله‌های نمره‌کم‌کن استاد</strong>
              <span>هشدار دقیق در مورد اشتباهات متداولی که دکتر شهروزی به خاطر آنها نمره کم می‌کند</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-start gap-2.5">
            <GraduationCap className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-semibold mb-0.5">فرمول‌های ایزوله KaTeX</strong>
              <span>عایق‌بندی کامل چپ‌به‌راست فرمول‌های ریاضی و بدون تداخل با متن فارسی</span>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onJumpToPhase1}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/10 transition-all text-sm cursor-pointer"
          >
            <span>شروع مطالعه از فاز ۱ (بانک نمره تضمینی)</span>
            <ArrowDown className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenMockExam}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/10 transition-all text-sm cursor-pointer"
          >
            <span>آزمون شبیه‌ساز با بارم‌بندی (۸ سوال میان‌ترم)</span>
          </button>

          <button
            onClick={onOpenVault}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl border border-slate-700 transition-colors text-sm cursor-pointer"
          >
            <span>خزانه فرمول‌های طلایی شب امتحان</span>
          </button>
        </div>
      </div>
    </section>
  );
};
