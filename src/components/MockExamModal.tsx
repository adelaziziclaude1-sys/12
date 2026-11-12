import React, { useState } from 'react';
import { InlineMath, BlockMath } from './MathView';
import { calculateMockExamScore } from '../utils/mathCalculations';
import {
  X,
  FileCheck2,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Award,
  Sparkles,
} from 'lucide-react';

interface MockExamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExamQuestionItem {
  id: string;
  number: number;
  title: string;
  points: number;
  statement: string;
  statementMathLatex?: string;
  rubrics: {
    id: string;
    description: string;
    points: number;
  }[];
  modelSolutionSteps: {
    title: string;
    explanation: string;
    formulaLatex: string;
  }[];
  shahrooziKeyTip: string;
}

const EXAM_QUESTIONS: ExamQuestionItem[] = [
  {
    id: 'q1',
    number: 1,
    title: 'یکتایی جواب معادله انتگرالی با لم گرونوال',
    points: 2.0,
    statement:
      'نشان دهید اگر f(x, y) در شرط لیپشیتز نسبت به y صدق کند، آنگاه معادله انتگرالی زیر حداکثر یک جواب خواهد داشت:',
    statementMathLatex: 'y(x) = 1 + \\int_3^x f(t, y(t)) \\, dt',
    rubrics: [
      { id: 'q1_1', description: 'بیان فرض خلف و تعریف تفاضل دو جواب u(x) = |y1(x) - y2(x)|', points: 0.5 },
      { id: 'q1_2', description: 'اعمال نامساوی مثلثی و استفاده از شرط لیپشیتز |f(t,y1)-f(t,y2)| <= L|y1-y2|', points: 0.75 },
      { id: 'q1_3', description: 'تطبیق با لم گرونوال با فرض A=0 و B=L و نتیجه‌گیری u(x) <= 0', points: 0.75 },
    ],
    modelSolutionSteps: [
      {
        title: 'گام ۱: طرح برهان خلف',
        explanation: 'فرض می‌کنیم دو جواب متمایز y1 و y2 وجود داشته باشند (عدد ۱ با ۱ خط می‌خورد):',
        formulaLatex: '|y_1(x) - y_2(x)| = \\left| \\int_3^x [f(t, y_1(t)) - f(t, y_2(t))] \\, dt \\right|',
      },
      {
        title: 'گام ۲: اعمال شرط لیپشیتز',
        explanation: 'قدر مطلق به داخل انتگرال می‌رود و ثابت L بیرون می‌آید:',
        formulaLatex: '|y_1(x) - y_2(x)| \\le L \\left| \\int_3^x |y_1(t) - y_2(t)| \\, dt \\right|',
      },
      {
        title: 'گام ۳: اعمال لم گرونوال و حکم یکتایی',
        explanation: 'با قرار دادن A=0 و B=L در لم گرونوال u(x) <= A e^{B|x-3|}:',
        formulaLatex: 'u(x) \\le 0 \\cdot e^{L|x-3|} = 0 \\implies y_1(x) \\equiv y_2(x)',
      },
    ],
    shahrooziKeyTip:
      'حتماً در پاسخ‌نامه قید کنید: «ابتدا فرض می‌کنیم معادله دارای جواب است، زیرا اگر جوابی نداشته باشد گزاره حداکثر یک جواب به طور بدیهی برقرار است».',
  },
  {
    id: 'q2',
    number: 2,
    title: 'وابستگی پیوسته جواب‌ها به تغییر نقطه شروع',
    points: 2.5,
    statement:
      'فرض کنید y(x) و y_tilde(x) به ترتیب جواب‌های مسائل مقدار اولیه y\'=f(x,y), y(x0)=y0 و y\'=f(x,y), y(x1)=y0 باشند به طوری که |f| <= M و f دارای ثابت لیپشیتز L باشد. ثابت کنید:',
    statementMathLatex: '|y(x) - \\tilde{y}(x)| \\le M |x_1 - x_0| e^{L |x - x_1|}',
    rubrics: [
      { id: 'q2_1', description: 'تبدیل هر دو مسئله دیفرانسیل به معادلات انتگرالی معادل', points: 0.5 },
      { id: 'q2_2', description: 'شکستن بازه انتگرال اول به دو بخش [x0, x1] و [x1, x]', points: 1.0 },
      { id: 'q2_3', description: 'کرانداری بخش اول با M|x1-x0| و اعمال لم گرونوال با مبدأ x1', points: 1.0 },
    ],
    modelSolutionSteps: [
      {
        title: 'گام ۱: معادلات انتگرالی',
        explanation: 'هر دو معادله را با شرایط اولیه‌شان می‌نویسیم:',
        formulaLatex: 'y(x) = y_0 + \\int_{x_0}^x f(t, y) \\, dt, \\quad \\tilde{y}(x) = y_0 + \\int_{x_1}^x f(t, \\tilde{y}) \\, dt',
      },
      {
        title: 'گام ۲: تفاضل و تجزیه بازه',
        explanation: 'انتگرال اول را روی [x0, x1] و [x1, x] می‌شکنیم و با انتگرال دوم ادغام می‌کنیم:',
        formulaLatex: '|y(x) - \\tilde{y}(x)| \\le \\left| \\int_{x_0}^{x_1} f(t, y) \\, dt \\right| + \\int_{x_1}^x |f(t, y) - f(t, \\tilde{y})| \\, dt \\le M(x_1 - x_0) + L \\int_{x_1}^x |y - \\tilde{y}| \\, dt',
      },
      {
        title: 'گام ۳: اعمال لم گرونوال',
        explanation: 'با ثوابت A = M(x1-x0) و B = L با کران پایین x1:',
        formulaLatex: '|y(x) - \\tilde{y}(x)| \\le M |x_1 - x_0| e^{L|x - x_1|}',
      },
    ],
    shahrooziKeyTip:
      'دقت کنید که توان نمایی حتماً |x - x1| است نه |x - x0| چون بازه انتگرال تفاضلی از x1 شروع شده است.',
  },
  {
    id: 'q3',
    number: 3,
    title: 'تحلیل شکست شرط لیپشیتز در مبدأ برای y\' = sqrt(|y|)',
    points: 2.5,
    statement:
      'مسئله مقدار اولیه y\' = sqrt(|y|), y(0) = 0 را در نظر بگیرید. نشان دهید حداقل دو تابع y1(x) = 0 و y2(x) = {0 for t<=0, t^2/4 for t>0} جواب هستند. توضیح دهید چرا این مثال قضیه وجود و یکتایی پیکارد را نقض نمی‌کند؟',
    rubrics: [
      { id: 'q3_1', description: 'اثبات صدق تابع بدیهی y1(x) = 0 در معادله و شرایط اولیه', points: 0.5 },
      { id: 'q3_2', description: 'اثبات مشتق‌پذیری و صدق تابع چندضابطه‌ای y2(x) در t=0 و t>0', points: 1.0 },
      { id: 'q3_3', description: 'محاسبه حد مشتق جزئی در مبدأ و اثبات شکست شرط کافی لیپشیتز', points: 1.0 },
    ],
    modelSolutionSteps: [
      {
        title: 'گام ۱: بررسی جواب‌ها',
        explanation: 'هر دو تابع در معادله صدق می‌کنند و در t=0 پیوسته و مشتق‌پذیر با شیب صفر هستند:',
        formulaLatex: 'y_2\'(0) = 0, \\quad \\sqrt{|y_2(0)|} = 0, \\quad \\forall t > 0: \\, y_2\'(t) = \\frac{t}{2} = \\sqrt{\\frac{t^2}{4}}',
      },
      {
        title: 'گام ۲: شکست شرط لیپشیتز',
        explanation: 'مشتق جزئی نسبت به y در مبدأ بی‌نهایت می‌شود و کراندار نیست:',
        formulaLatex: '\\frac{\\partial f}{\\partial y}(0) = \\lim_{y \\to 0} \\frac{\\sqrt{|y|} - 0}{|y|} = \\lim_{y \\to 0} \\frac{1}{\\sqrt{|y|}} = +\\infty',
      },
    ],
    shahrooziKeyTip:
      'قضیه پیکارد شرط کافی ارائه می‌دهد نه شرط لازم؛ وقتی فرض لیپشیتز در مبدأ نقض شود، قضیه پیکارد ادعایی در مورد یکتایی ندارد.',
  },
  {
    id: 'q4',
    number: 4,
    title: 'دستگاه خطی با ریشه مکرر و بردار ویژه تعمیم‌یافته',
    points: 4.0,
    statement:
      'دستگاه معادلات دیفرانسیل روبه‌رو را با روش مقادیر ویژه و بردار ویژه حل کنید:',
    statementMathLatex: '\\dot{X} = \\begin{pmatrix} 3 & 1 & -1 \\\\ 2 & 2 & -1 \\\\ 2 & 2 & 0 \\end{pmatrix} X',
    rubrics: [
      { id: 'q4_1', description: 'تشکیل معادله مشخصه -(r-1)(r-2)^2 = 0 و یافتن ریشه‌ها r1=1, r2=2', points: 0.75 },
      { id: 'q4_2', description: 'محاسبه بردار ویژه متناظر با r1=1: v(1) = (1, 0, 2)^T', points: 0.75 },
      { id: 'q4_3', description: 'محاسبه بردار ویژه متناظر با r2=2 و اثبات نقص بعد (فقط یک بردار v(2))', points: 0.75 },
      { id: 'q4_4', description: 'محاسبه ماتریس (A-2I)^2 و یافتن بردار تعمیم‌یافته v(3) = (1, 1, 1)^T', points: 1.0 },
      { id: 'q4_5', description: 'ساخت جواب سوم با بسط نمایی و نوشتن جواب عمومی کامل', points: 0.75 },
    ],
    modelSolutionSteps: [
      {
        title: 'مقادیر و بردارهای ویژه',
        explanation: 'r1=1 ریشه ساده با بردار v(1)=(1,0,2)^T. r2=2 ریشه مضاعف با تک بردار v(2)=(1,1,2)^T.',
        formulaLatex: 'X^{(1)}(t) = e^t \\begin{pmatrix} 1 \\\\ 0 \\\\ 2 \\end{pmatrix}, \\quad X^{(2)}(t) = e^{2t} \\begin{pmatrix} 1 \\\\ 1 \\\\ 2 \\end{pmatrix}',
      },
      {
        title: 'بردار ویژه تعمیم‌یافته',
        explanation: 'از رابطه (A-2I)^2 v(3) = 0 بردار (1, 1, 1)^T را انتخاب می‌کنیم:',
        formulaLatex: 'X^{(3)}(t) = e^{2t} [I + (A - 2I)t] v^{(3)} = e^{2t} \\begin{pmatrix} 1+t \\\\ 1+t \\\\ 1+2t \\end{pmatrix}',
      },
    ],
    shahrooziKeyTip:
      'حتماً در برگه امتحان چک کنید و بنویسید که (A - 2I) v(3) ≠ 0 است تا اثبات شود بردار تعمیم‌یافته واقعی است.',
  },
  {
    id: 'q5',
    number: 5,
    title: 'محاسبه ماتریس نمایی e^{At} با ماتریس اساسی',
    points: 3.0,
    statement:
      'ماتریس نمایی e^{At} را با استفاده از رابطه e^{At} = ψ(t)ψ^{-1}(0) برای ماتریس زیر محاسبه کنید:',
    statementMathLatex: 'A = \\begin{pmatrix} 3 & 5 \\\\ -5 & -3 \\end{pmatrix}',
    rubrics: [
      { id: 'q5_1', description: 'یافتن مقادیر ویژه مختلط r = ±4i و بردار ویژه v = (5, -3+4i)^T', points: 1.0 },
      { id: 'q5_2', description: 'تشکیل دو جواب مستقل حقیقی با فرمول اویلر و ساخت ماتریس اساسی ψ(t)', points: 1.0 },
      { id: 'q5_3', description: 'محاسبه معکوس ψ^(-1)(0) و ضرب ماتریسی نهایی e^{At} = ψ(t)ψ^(-1)(0)', points: 1.0 },
    ],
    modelSolutionSteps: [
      {
        title: 'ماتریس اساسی و معکوس در مبدأ',
        explanation: 'ستون‌های ψ(t) بخش حقیقی و موهومی جواب مختلط هستند:',
        formulaLatex: '\\psi(0) = \\begin{pmatrix} 5 & 0 \\\\ -3 & 4 \\end{pmatrix} \\implies \\psi^{-1}(0) = \\frac{1}{20} \\begin{pmatrix} 4 & 0 \\\\ 3 & 5 \\end{pmatrix}',
      },
      {
        title: 'ضرب نهایی ماتریس نمایی',
        explanation: 'با ضرب ψ(t) در معکوس مبدأ حاصل می‌شود:',
        formulaLatex: 'e^{At} = \\begin{pmatrix} \\cos 4t + \\frac{3}{4}\\sin 4t & \\frac{5}{4}\\sin 4t \\\\ -\\frac{5}{4}\\sin 4t & \\cos 4t - \\frac{3}{4}\\sin 4t \\end{pmatrix}',
      },
    ],
    shahrooziKeyTip:
      'معکوس حتماً در سمت راست ضرب می‌شود: ψ(t) ψ^(-1)(0). برای چک کردن درستی، t=0 بگذارید و ببینید ماتریس همانی I می‌شود یا خیر.',
  },
  {
    id: 'q6',
    number: 6,
    title: 'اثبات خاصیت جابه‌جایی ماتریس نمایی AB = BA => e^{At}B = B e^{At}',
    points: 2.0,
    statement:
      'نشان دهید اگر دو ماتریس A و B جابه‌جاپذیر باشند (AB = BA)، آنگاه e^{At} B = B e^{At}.',
    rubrics: [
      { id: 'q6_1', description: 'بیان بسط سری توان نمایی یا تعریف تابع کمکی F(t) = e^{At} B e^{-At}', points: 1.0 },
      { id: 'q6_2', description: 'اثبات استقرا روی A^n B = B A^n یا مشتق‌گیری F\'(t) = e^{At}(AB-BA)e^{-At} = 0', points: 1.0 },
    ],
    modelSolutionSteps: [
      {
        title: 'روش مشتق‌گیری تابع کمکی (رویکرد پیشنهادی سریع)',
        explanation: 'F(t) = e^{At} B e^{-At}. مشتق نسبت به t:',
        formulaLatex: 'F\'(t) = A e^{At} B e^{-At} - e^{At} B A e^{-At} = e^{At} (AB - BA) e^{-At} = 0 \\implies F(t) = F(0) = B',
      },
    ],
    shahrooziKeyTip:
      'در روش استقرا، حتماً گام پایه (n=1) و فرض استقرا (n=k) را به صورت خطی مجزا بنویسید.',
  },
  {
    id: 'q7',
    number: 7,
    title: 'اثبات نامتناهی بودن صفرهای معادله x\'\' + (t+1)x = 0',
    points: 2.0,
    statement:
      'نشان دهید هر جواب حقیقی معادله دیفرانسیل مرتبه دوم زیر دارای تعداد نامتناهی صفر مثبت است:',
    statementMathLatex: '\\frac{d^2 x}{dt^2} + (t + 1)x = 0',
    rubrics: [
      { id: 'q7_1', description: 'طرح برهان خلف و فرض بزرگترین صفر tm و بررسی حالت x(t) > 0', points: 0.75 },
      { id: 'q7_2', description: 'اثبات تقعر منفی x\'\'(t) = -(t+1)x < 0 و نزولی اکید بودن شیب x\'(t)', points: 0.75 },
      { id: 'q7_3', description: 'منفی شدن شیب در نقطه‌ای و نتیجه‌گیری تناقض میل به منفی بی‌نهایت و قطع محور', points: 0.5 },
    ],
    modelSolutionSteps: [
      {
        title: 'برهان خلف و تحلیل تقعر',
        explanation: 'اگر صفرها متناهی باشند و tm بزرگترین صفر باشد، برای t>tm فرض می‌کنیم x(t) > 0. پس:',
        formulaLatex: 'x\'\'(t) = -(t + 1)x(t) < 0 \\implies x\'(t) \\downarrow \\implies \\exists t_b: x\'(t_b) < 0 \\implies x(t) \\to -\\infty',
      },
    ],
    shahrooziKeyTip:
      'قید کنید که حالت x(t) < 0 نیز با در نظر گرفتن قرینه تابع -x(t) به صورت متقارن اثبات می‌شود.',
  },
  {
    id: 'q8',
    number: 8,
    title: 'فرمول آبل، نسبت جواب‌ها و قضایای تفکیک ریشه‌های اشتورم',
    points: 2.5,
    statement:
      'معادله y\'\' + p(x)y\' + q(x)y = 0 با دو جواب مستقل خطی y1 و y2 را در نظر بگیرید. الف) ثابت کنید y1 و y2 صفر مشترک ندارند. ب) ثابت کنید نسبت R(x) = y2/y1 روی فاصله ریشه‌های متوالی اکیداً یکنواست. ج) ثابت کنید R(x) نگاشتی دوسویی به کل R است.',
    rubrics: [
      { id: 'q8_1', description: 'اثبات نداشتن صفر مشترک از طریق صفر شدن رونسکین و فرمول آبل P(t)W(t)=k', points: 0.75 },
      { id: 'q8_2', description: 'مشتق‌گیری R\'(x) = W(y1, y2) / y1^2 و اثبات اکیداً یکنوا بودن', points: 1.0 },
      { id: 'q8_3', description: 'بررسی حدهای کناری در x1 و x2 و نتیجه‌گیری یک‌به‌یک و پوشا بودن به روی R', points: 0.75 },
    ],
    modelSolutionSteps: [
      {
        title: 'اثبات نداشتن صفر مشترک',
        explanation: 'اگر x0 صفر مشترک باشد، W(x0) = 0. طبق آبل رونسکین در همه جا صفر می‌شود که تناقض است:',
        formulaLatex: 'W(y_1, y_2)(x_0) = y_1(x_0)y_2\'(x_0) - y_2(x_0)y_1\'(x_0) = 0 \\implies W \\equiv 0 \\quad (\\text{تناقض})',
      },
      {
        title: 'مشتق نسبت جواب‌ها',
        explanation: 'چون مخرج در بازه باز صفر نمی‌شود و صورت رونسکین هم‌علامت است:',
        formulaLatex: 'R\'(x) = \\left( \\frac{y_2}{y_1} \\right)\' = \\frac{W(y_1, y_2)}{y_1^2(x)} \\neq 0 \\implies \\text{اکیداً یکنوا}',
      },
    ],
    shahrooziKeyTip:
      'تأکید کنید که چون ریشه‌های x1 و x2 متوالی فرض شده‌اند، تابع y1 در کل بازه باز مابین آن‌ها مخالف صفر است.',
  },
];

export const MockExamModal: React.FC<MockExamModalProps> = ({ isOpen, onClose }) => {
  const [checkedRubrics, setCheckedRubrics] = useState<Record<string, boolean>>({});
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({
    q1: true,
  });

  if (!isOpen) return null;

  // Flatten rubric mapping
  const rubricPointsMap: Record<string, number> = {};
  EXAM_QUESTIONS.forEach((q) => {
    q.rubrics.forEach((r) => {
      rubricPointsMap[r.id] = r.points;
    });
  });

  const scoreResult = calculateMockExamScore(checkedRubrics, rubricPointsMap);

  const toggleCheck = (id: string) => {
    setCheckedRubrics((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleSolution = (qId: string) => {
    setExpandedSolutions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handleSelectAll = () => {
    const all: Record<string, boolean> = {};
    Object.keys(rubricPointsMap).forEach((k) => {
      all[k] = true;
    });
    setCheckedRubrics(all);
  };

  const handleClearAll = () => {
    setCheckedRubrics({});
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mock-exam-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="mock-exam-title" className="text-base sm:text-lg font-bold text-white">
                  شبیه‌ساز برگه امتحانی و خودآزمایی با بارم دکتر شهروزی
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  ۸ تیپ قطعی میان‌ترم
                </span>
              </div>
              <p className="text-xs text-slate-400">
                بارم‌بندی رسمی هر گام، شبیه‌سازی پاسخ‌نامه و محاسبه آنلاین نمره آزمون شما از ۲۰ نمره
              </p>
            </div>
          </div>

          {/* Online score badge & Close */}
          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-amber-500/40 text-xs">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300">نمره کسب‌شده:</span>
              <span className="font-mono font-bold text-base text-amber-300 tabular-nums">
                {scoreResult.earnedScore.toFixed(1)}
              </span>
              <span className="text-slate-500">/ ۲۰</span>
            </div>

            <button
              onClick={onClose}
              aria-label="بستن آزمون"
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Quick check / clear */}
        <div className="px-5 py-2.5 bg-slate-950/50 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>راهنمای آزمون: پاسخ خود را در ذهن مرور کرده یا بنویسید، سپس تیک بارم‌هایی که رعایت کردید را بزنید.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="text-amber-400 hover:underline"
            >
              علامت‌زدن همه (نمره ۲۰)
            </button>
            <span>·</span>
            <button
              onClick={handleClearAll}
              className="text-slate-400 hover:underline"
            >
              پاک کردن همه
            </button>
          </div>
        </div>

        {/* Exam Questions List */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {EXAM_QUESTIONS.map((q) => {
            const isSolOpen = expandedSolutions[q.id];
            const qRubricIds = q.rubrics.map((r) => r.id);
            const qEarned = qRubricIds.reduce(
              (acc, rId) => acc + (checkedRubrics[rId] ? rubricPointsMap[rId] : 0),
              0
            );

            return (
              <div
                key={q.id}
                className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4"
              >
                {/* Question Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      سوال {q.number}
                    </span>
                    <h4 className="font-bold text-white text-sm sm:text-base">{q.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                      بارم: {q.points} نمره
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                      کسب‌شده: {qEarned.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Question Statement */}
                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  <p className="font-medium mb-1">{q.statement}</p>
                  {q.statementMathLatex && <BlockMath math={q.statementMathLatex} />}
                </div>

                {/* Rubrics Checklist */}
                <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 space-y-2">
                  <span className="text-xs font-semibold text-amber-400 block mb-1">
                    📋 بارم‌بندی تصحیح استاد (تیک بزنید):
                  </span>
                  <div className="space-y-1.5">
                    {q.rubrics.map((r) => {
                      const isChecked = !!checkedRubrics[r.id];
                      return (
                        <label
                          key={r.id}
                          className={`flex items-start gap-2.5 p-2 rounded-lg text-xs cursor-pointer border transition-colors ${
                            isChecked
                              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleCheck(r.id)}
                            className="mt-0.5 rounded accent-emerald-500"
                          />
                          <span className="flex-1">{r.description}</span>
                          <span className="font-mono text-amber-400 font-bold text-[11px] shrink-0">
                            +{r.points} نمره
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Model Answer Toggle */}
                <div>
                  <button
                    onClick={() => toggleSolution(q.id)}
                    className="flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-950/30 hover:bg-cyan-900/40 px-3 py-1.5 rounded-lg border border-cyan-500/30 transition-colors"
                  >
                    {isSolOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    <span>{isSolOpen ? 'مخفی‌سازی پاسخ استاندارد برگه امتحان' : 'مشاهده پاسخ استاندارد برگه امتحان'}</span>
                  </button>

                  {isSolOpen && (
                    <div className="mt-3 p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                      {q.modelSolutionSteps.map((step, idx) => (
                        <div key={idx} className="space-y-1 text-xs sm:text-sm">
                          <span className="font-semibold text-amber-300">{step.title}:</span>
                          <p className="text-slate-300 text-xs">{step.explanation}</p>
                          <BlockMath math={step.formulaLatex} />
                        </div>
                      ))}

                      <div className="pt-2 border-t border-slate-800 text-xs text-rose-300">
                        ⚡ <strong>تله کلیدی استاد:</strong> {q.shahrooziKeyTip}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            امتیاز کل شما: <strong className="text-amber-400 font-mono text-sm">{scoreResult.earnedScore} از ۲۰</strong> ({scoreResult.percentage}٪ موفقیت)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg transition-colors"
          >
            تکمیل خودآزمایی و بستن
          </button>
        </div>
      </div>
    </div>
  );
};
