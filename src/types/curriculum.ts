export type MasteryStatus = 'mastered' | 'review' | 'struggling' | 'unseen';

export interface PrerequisiteItem {
  title: string;
  explanation: string;
  formulaLatex?: string;
  tip?: string;
}

export interface FlashRevealCard {
  question: string;
  hint: string;
  answer: string;
  takeaway: string;
}

export interface ToolkitItem {
  title: string;
  statementFa: string;
  formulaLatex: string;
  conditions: string[];
  referenceNote: string;
}

export interface ExamSolutionStep {
  stepNumber: number;
  stepTitle: string;
  examSheetText: string;
  mathFormulaLatex: string;
  keyNote: string;
}

export interface ExamTrap {
  title: string;
  trapDescription: string;
  deductionReason: string;
  howToAvoid: string;
  severity: 'high' | 'medium';
}

export interface TwinProblem {
  problemStatement: string;
  mathFormulaLatex?: string;
  hint: string;
  fullSolutionSteps: {
    title: string;
    description: string;
    mathLatex: string;
  }[];
  finalAnswerLatex: string;
}

export interface CurriculumModule {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  chapter: string;
  phase: 1 | 2 | 3 | 4;
  priority: 'ضریب اطمینان ۱۰۰٪ (سریع‌ترین نمره)' | 'اثبات مفهومی کلیدی' | 'قضایای کیفی و تحلیلی' | 'پوشش امنیتی نمره کامل';
  scoreWeight: number; // In midterm/final exam (out of 20)
  estimatedTimeMin: number;
  examQuestionRef: string;
  summaryBulletPoints: string[];
  
  // 6-Layer Pedagogical Engine
  layer0_prerequisites: {
    intro: string;
    items: PrerequisiteItem[];
  };
  layer1_intuition: {
    plainLanguageIntro: string;
    analogy: string;
    flashCard: FlashRevealCard;
  };
  layer2_toolkit: {
    intro: string;
    items: ToolkitItem[];
  };
  layer3_examTemplate: {
    problemStatement: string;
    examQuestionMeta: string;
    steps: ExamSolutionStep[];
    finalAnswerSummary: string;
  };
  layer4_traps: {
    intro: string;
    traps: ExamTrap[];
  };
  layer5_twinProblem: TwinProblem;
}
