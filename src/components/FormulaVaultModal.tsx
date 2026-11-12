import React from 'react';
import { BlockMath, InlineMath } from './MathView';
import { X, Sparkles, BookOpen } from 'lucide-react';

interface FormulaVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaVaultModal: React.FC<FormulaVaultModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const categories = [
    {
      title: 'فصل دوم: دستگاه‌های خطی، مقادیر ویژه و ماتریس نمایی',
      formulas: [
        {
          label: 'معادله مشخصه ماتریس',
          latex: '\\det(A - rI) = 0 \\iff r^2 - \\text{tr}(A)r + \\det(A) = 0',
        },
        {
          label: 'تفکیک جواب مختلط به دو جواب حقیقی (قضیه ۲.۶)',
          latex: 'X^{(1)}(t) = e^{\\alpha t} (\\cos \\beta t \\, v^{(1)} - \\sin \\beta t \\, v^{(2)}), \\quad X^{(2)}(t) = e^{\\alpha t} (\\cos \\beta t \\, v^{(2)} + \\sin \\beta t \\, v^{(1)})',
        },
        {
          label: 'بردار ویژه تعمیم‌یافته و جواب مرتبه ۲ (سوال ۴)',
          latex: '(A - rI)^2 v^{(3)} = 0, \\quad (A - rI)v^{(3)} \\neq 0 \\implies X^{(3)}(t) = e^{rt} [I + (A - rI)t] v^{(3)}',
        },
        {
          label: 'محاسبه ماتریس نمایی با ماتریس اساسی (قضیه ۲.۱۵)',
          latex: 'e^{At} = \\psi(t) \\psi^{-1}(0)',
        },
        {
          label: 'قضیه جابه‌جایی ماتریس نمایی (سوال ۶)',
          latex: 'AB = BA \\implies e^{At} B = B e^{At}, \\quad e^{A+B} = e^A e^B',
        },
        {
          label: 'روش تغییر پارامترها در دستگاه ناهمگن (قضیه ۲.۱۶)',
          latex: '\\dot{X} = AX + g(t) \\implies X(t) = \\psi(t)C + \\psi(t) \\int \\psi^{-1}(t) g(t) \\, dt',
        },
      ],
    },
    {
      title: 'فصل اول: قضیه پیکارد، لم گرونوال و وابستگی به داده‌های اولیه',
      formulas: [
        {
          label: 'معادله انتگرالی هم‌ارز پیکارد',
          latex: 'y(x) = y_0 + \\int_{x_0}^x f(t, y(t)) \\, dt, \\quad y_{n+1}(x) = y_0 + \\int_{x_0}^x f(t, y_n(t)) \\, dt',
        },
        {
          label: 'صورت لم گرونوال (لم ۱.۹)',
          latex: 'u(x) \\le A + B \\left| \\int_{x_0}^x u(t) \\, dt \\right| \\implies u(x) \\le A e^{B|x - x_0|}',
        },
        {
          label: 'وابستگی پیوسته جواب به داده اولیه (قضیه ۱.۱۰)',
          latex: '|\\varphi(x) - \\psi(x)| \\le |y_0 - \\hat{y}_0| e^{L|x - x_0|}',
        },
        {
          label: 'وابستگی جواب به جابه‌جایی نقطه شروع (سوال ۲ میان‌ترم)',
          latex: '|y(x) - \\tilde{y}(x)| \\le M |x_1 - x_0| e^{L|x - x_1|}',
        },
      ],
    },
    {
      title: 'فصل سوم: معادلات خودالحاق، فرمول آبل و قضایای اشتورم',
      formulas: [
        {
          label: 'شرط خودالحاقی معادله مرتبه دوم (قضیه ۳.۴)',
          latex: 'a_0(t) x\'\' + a_1(t) x\' + a_2(t) x = 0 \\iff \\dot{a}_0(t) = a_1(t)',
        },
        {
          label: 'عامل انتگرال‌ساز خودالحاق‌کننده (قضیه ۳.۵)',
          latex: '\\mu(t) = \\frac{1}{a_0(t)} \\exp\\left( \\int \\frac{a_1(t)}{a_0(t)} \\, dt \\right) \\implies [P(t) x\']\' + Q(t) x = 0',
        },
        {
          label: 'فرمول آبل برای معادله اشتورم-لیوویل (قضیه ۳.۷)',
          latex: 'P(t) W(f, g)(t) = k \\quad (\\text{ثابت}), \\quad W(f, g) = f \\dot{g} - g \\dot{f}',
        },
        {
          label: 'مشتق نسبت جواب‌ها و قضیه تفکیک اشتورم (سوال ۸)',
          latex: 'R(x) = \\frac{y_2(x)}{y_1(x)} \\implies R\'(x) = \\frac{W(y_1, y_2)(x)}{y_1^2(x)} \\neq 0',
        },
      ],
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="vault-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 id="vault-modal-title" className="text-lg font-bold text-white">
                خزانه فرمول‌های طلایی شب امتحان (معادلات دیفرانسیل - دکتر شهروزی)
              </h3>
              <p className="text-xs text-slate-400">
                تمام روابطی که برای گرفتن نمره کامل باید در حافظه کوتاه‌مدت شب امتحان داشته باشید
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="بستن پنجره"
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {categories.map((cat, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800/80 pb-1.5">
                <BookOpen className="w-4 h-4 text-amber-400" />
                {cat.title}
              </h4>
              <div className="grid md:grid-cols-2 gap-3">
                {cat.formulas.map((f, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5"
                  >
                    <span className="text-xs text-slate-300 font-medium block">{f.label}</span>
                    <BlockMath math={f.latex} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>نکته امتحانی: در فرمول‌های الحاقی و آبل، ضریب اول P(t) حتماً در چپ رونسکین ضرب می‌شود.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
