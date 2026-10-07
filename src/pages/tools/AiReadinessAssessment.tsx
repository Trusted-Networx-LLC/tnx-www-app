import React, { useState, useMemo } from 'react';
import { Brain, ArrowRight, CheckCircle2, AlertTriangle, XCircle, Info, TrendingUp, Database, FileText, Users, Zap, Target, Server } from 'lucide-react';
import Seo from '../../components/Seo';
import CrmFormEmbed from '../../components/CrmFormEmbed';

interface Question {
  id: string;
  label: string;
  icon: React.ElementType;
  options: { score: number; label: string; desc: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'technology',
    label: 'Technology Foundation',
    icon: Server,
    options: [
      { score: 0, label: 'Mostly legacy', desc: 'Mostly legacy systems, limited cloud' },
      { score: 1, label: 'Some cloud', desc: 'Some cloud, mostly on-premise' },
      { score: 2, label: 'Hybrid', desc: 'Hybrid cloud/on-premise, some modern tools' },
      { score: 3, label: 'Mostly cloud', desc: 'Mostly cloud-based, modern stack' },
      { score: 4, label: 'Cloud-native', desc: 'Cloud-native, API-first architecture' },
    ],
  },
  {
    id: 'data',
    label: 'Data Readiness',
    icon: Database,
    options: [
      { score: 0, label: 'Scattered', desc: 'Data scattered across spreadsheets and paper' },
      { score: 1, label: 'Some centralized', desc: 'Some centralized data, inconsistent formats' },
      { score: 2, label: 'Centralized DBs', desc: 'Centralized databases, some standardization' },
      { score: 3, label: 'Well-organized', desc: 'Well-organized data with documentation' },
      { score: 4, label: 'Data warehouse', desc: 'Data warehouse/lake, strong governance' },
    ],
  },
  {
    id: 'process',
    label: 'Process Documentation',
    icon: FileText,
    options: [
      { score: 0, label: 'No docs', desc: 'No formal documentation' },
      { score: 1, label: 'Some informal', desc: 'Some processes informally documented' },
      { score: 2, label: 'Key processes', desc: 'Key processes documented' },
      { score: 3, label: 'Most documented', desc: 'Most processes documented and followed' },
      { score: 4, label: 'Fully documented', desc: 'Fully documented, regularly audited' },
    ],
  },
  {
    id: 'ai_literacy',
    label: 'Team AI Literacy',
    icon: Users,
    options: [
      { score: 0, label: 'No experience', desc: 'No experience with AI tools' },
      { score: 1, label: 'A few individuals', desc: 'A few individuals use basic AI tools' },
      { score: 2, label: 'Some teams', desc: 'Some teams experiment with AI' },
      { score: 3, label: 'Multiple teams', desc: 'Multiple teams use AI regularly' },
      { score: 4, label: 'AI embedded', desc: 'AI is embedded in daily workflows' },
    ],
  },
  {
    id: 'automation',
    label: 'Automation Maturity',
    icon: Zap,
    options: [
      { score: 0, label: 'Fully manual', desc: 'Fully manual processes' },
      { score: 1, label: 'Basic workflow', desc: 'Basic email/workflow automation' },
      { score: 2, label: 'Department-level', desc: 'Some department-level automation' },
      { score: 3, label: 'Cross-department', desc: 'Cross-department automated workflows' },
      { score: 4, label: 'Advanced', desc: 'Advanced automation with monitoring' },
    ],
  },
  {
    id: 'leadership',
    label: 'Leadership Alignment',
    icon: Target,
    options: [
      { score: 0, label: 'No discussions', desc: 'No AI discussions at leadership level' },
      { score: 1, label: 'Casual interest', desc: 'Casual interest, no formal commitment' },
      { score: 2, label: 'Exploring', desc: 'Exploring options, budget discussions' },
      { score: 3, label: 'Active sponsor', desc: 'Active sponsor, allocated budget' },
      { score: 4, label: 'Strategic priority', desc: 'AI is a strategic priority with dedicated resources' },
    ],
  },
];

const READINESS_LEVELS = [
  {
    min: 0,
    max: 6,
    label: 'Early Stage',
    color: 'red',
    bg: 'bg-red-50',
    text: 'text-red-700',
    iconBg: 'from-red-600 to-rose-700',
    description: 'Focus on foundational improvements first',
  },
  {
    min: 7,
    max: 12,
    label: 'Developing',
    color: 'orange',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    iconBg: 'from-orange-500 to-red-500',
    description: 'Good progress, address key gaps before scaling',
  },
  {
    min: 13,
    max: 18,
    label: 'Advanced',
    color: 'amber',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    iconBg: 'from-amber-500 to-yellow-600',
    description: 'Strong foundation, ready for targeted AI deployment',
  },
  {
    min: 19,
    max: 24,
    label: 'AI-Ready',
    color: 'emerald',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    iconBg: 'from-emerald-500 to-teal-600',
    description: 'Excellent position to deploy AI agents broadly',
  },
];

const RECOMMENDATIONS: Record<string, string[]> = {
  technology: [
    'Modernize infrastructure: migrate legacy systems to cloud-native platforms',
    'Implement API-first architecture to enable seamless AI integration',
    'Conduct a technology audit to identify modernization priorities',
  ],
  data: [
    'Centralize data into a single source of truth with proper governance',
    'Clean and standardize data formats — AI models need consistent inputs',
    'Consider a data warehouse or lake for scalable AI training and inference',
  ],
  process: [
    'Document at least key business processes before attempting automation',
    'Map process flows end-to-end to identify AI insertion points',
    'Establish process KPIs to measure AI impact post-deployment',
  ],
  ai_literacy: [
    'Launch an AI literacy program — start with hands-on workshops',
    'Identify AI champions within each department to drive adoption',
    'Provide guided access to AI tools with clear use-case guidelines',
  ],
  automation: [
    'Start with simple, high-volume processes to build automation maturity',
    'Invest in workflow automation platforms with AI capabilities built in',
    'Implement monitoring and alerting for all automated processes',
  ],
  leadership: [
    'Present an AI business case with projected ROI to leadership',
    'Secure an executive sponsor and dedicated AI initiative budget',
    'Develop a formal AI strategy with milestones and success metrics',
  ],
};

const AiReadinessAssessment = () => {
  const [scores, setScores] = useState<Record<string, number>>({});

  const totalScore = useMemo(() => {
    return Object.values(scores).reduce((sum, s) => sum + s, 0);
  }, [scores]);

  const allAnswered = useMemo(() => {
    return QUESTIONS.every((q) => scores[q.id] !== undefined);
  }, [scores]);

  const readinessLevel = useMemo(() => {
    return (
      READINESS_LEVELS.find((l) => totalScore >= l.min && totalScore <= l.max) ??
      READINESS_LEVELS[0]
    );
  }, [totalScore]);

  const maxPossible = 24; // 6 questions × 4 points

  // Build category scores for bar chart
  const categoryScores = useMemo(() => {
    return QUESTIONS.map((q) => ({
      id: q.id,
      label: q.label,
      icon: q.icon,
      score: scores[q.id] ?? -1,
      max: 4,
    }));
  }, [scores]);

  // Recommendations based on lowest-scoring areas
  const recommendations = useMemo(() => {
    if (!allAnswered) return [];
    const sorted = [...categoryScores].sort((a, b) => a.score - b.score);
    const lowest = sorted.slice(0, Math.min(3, sorted.length)).filter((c) => c.score < 3);
    const recs: string[] = [];
    for (const cat of lowest) {
      const r = RECOMMENDATIONS[cat.id];
      if (r) recs.push(...r.slice(0, 2));
    }
    if (recs.length === 0) {
      return ['Your organization is well-positioned for AI adoption. Consider periodic reassessments and staying current with emerging AI capabilities.'];
    }
    return recs.slice(0, 6);
  }, [allAnswered, categoryScores]);

  const handleSelect = (questionId: string, score: number) => {
    setScores((prev) => ({ ...prev, [questionId]: score }));
  };

  const getScoreColor = (score: number) => {
    if (score <= 1) return 'bg-red-500';
    if (score === 2) return 'bg-amber-500';
    if (score === 3) return 'bg-lime-500';
    return 'bg-emerald-500';
  };

  // Form state
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-navy-50">
      <Seo
        title="AI Readiness Assessment | TrustedNetworx"
        description="Evaluate how prepared your organization is to adopt AI agents and automation. Interactive assessment tool from TrustedNetworx."
        jsonLd={{
          // Free tool → WebApplication (name = page title without site suffix).
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'AI Readiness Assessment',
          url: 'https://trustednetworx.com/tools/ai-readiness',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          publisher: { '@id': 'https://trustednetworx.com/#organization' },
        }}
      />

      {/* Hero */}
      <section className="relative flex min-h-[480px] items-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-navy-950 via-navy-900 to-brand-900" />
        <div className="absolute inset-0 z-0 bg-grid-dark bg-grid opacity-40" />

        <div className="relative z-10 w-full pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="eyebrow border border-brand-400/30 bg-brand-500/10 text-brand-200">
                <Brain size={14} />
                Interactive Assessment Tool
              </span>
              <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
                {'AI '}
                <span className="text-brand-300">
                  Readiness Assessment
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-lg sm:text-xl text-navy-200">
                Evaluate how prepared your organization is to adopt AI agents and automation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Assessment */}
      <section className="relative py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-morphism rounded-2xl p-6 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-600 text-white">
                <Brain size={20} />
              </span>
              AI Readiness Questionnaire
            </h2>
            <p className="mt-2 text-navy-500">
              Answer all 6 questions below to receive your organization's AI readiness score.
            </p>

            <div className="mt-8 space-y-10">
              {QUESTIONS.map((q, qi) => {
                const currentScore = scores[q.id];
                const isAnswered = currentScore !== undefined;
                const Icon = q.icon;
                return (
                  <div key={q.id}>
                    <label className="block text-sm font-semibold text-navy-800 mb-3">
                      {`${qi + 1}. ${q.label}: "${q.options[0].desc.split(',')[0]}" — How would you describe your current state?`}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                      {q.options.map((opt) => {
                        const isSelected = isAnswered && currentScore === opt.score;
                        return (
                          <button
                            key={opt.score}
                            onClick={() => handleSelect(q.id, opt.score)}
                            className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-3 text-xs transition-all duration-200 ${
                              isSelected
                                ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-500'
                                : 'border-navy-200 bg-white text-navy-600 hover:border-navy-300 hover:bg-navy-50'
                            }`}
                          >
                            <span className="text-lg font-extrabold">{opt.score}</span>
                            <span className="font-semibold leading-tight text-center">
                              {opt.label}
                            </span>
                            <span className="text-[10px] text-navy-400 text-center leading-tight">
                              {opt.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-1 text-xs text-navy-400">
                      {`Score: ${isAnswered ? currentScore : '—'} / 4`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Results */}
          {allAnswered && (
            <div className="mt-8 rounded-2xl bg-gradient-to-br from-navy-50 to-white border border-navy-200 p-6 sm:p-10">
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <span
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${readinessLevel.iconBg} text-white shadow-lg`}
                >
                  <Brain size={24} />
                </span>
                <div className="text-center sm:text-left">
                  <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
                    <span className="text-5xl sm:text-6xl font-extrabold text-navy-900">
                      {totalScore}
                    </span>
                    <span className="text-lg text-navy-400">/ {maxPossible}</span>
                  </div>
                  <span
                    className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold ${readinessLevel.bg} ${readinessLevel.text}`}
                  >
                    {readinessLevel.label === 'AI-Ready' || readinessLevel.label === 'Advanced' ? (
                      <CheckCircle2 size={14} />
                    ) : readinessLevel.label === 'Early Stage' ? (
                      <XCircle size={14} />
                    ) : (
                      <AlertTriangle size={14} />
                    )}
                    {readinessLevel.label}
                  </span>
                  <p className="mt-2 text-sm text-navy-500">{readinessLevel.description}</p>
                </div>
              </div>

              {/* Category Score Bars */}
              <h4 className="font-semibold text-navy-900 mb-4">Readiness by Category</h4>
              <div className="space-y-3 mb-8">
                {categoryScores.map((cat) => {
                  const pct = (cat.score / cat.max) * 100;
                  const CatIcon = cat.icon;
                  return (
                    <div key={cat.id} className="rounded-xl bg-white border border-navy-100 p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <CatIcon size={16} className="text-navy-400 flex-shrink-0" />
                        <span className="text-sm font-semibold text-navy-800 flex-grow">
                          {cat.label}
                        </span>
                        <span className="text-sm font-bold text-navy-900">
                          {`${cat.score}/${cat.max}`}
                        </span>
                      </div>
                      <div className="h-3 rounded-full bg-navy-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${getScoreColor(cat.score)}`}
                          style={{ width: `${Math.max(pct, 4)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recommendations */}
              <div className="rounded-xl bg-brand-50 border border-brand-200 p-5 mb-6">
                <h4 className="font-semibold text-navy-900 flex items-center gap-2 mb-3">
                  <Info size={16} className="text-brand-600" />
                  Top Recommendations
                </h4>
                <ul className="space-y-2">
                  {recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-navy-700">
                      <ArrowRight size={14} className="mt-0.5 flex-shrink-0 text-brand-500" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Industry context note */}
              <div className="rounded-xl bg-navy-50 border border-navy-200 p-4 flex items-start gap-3">
                <TrendingUp size={18} className="text-brand-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-navy-600 leading-relaxed">
                  A higher score usually means less groundwork before the first agent can go
                  live — documented processes, clean data, and a named owner are what shorten a
                  deployment. A mid-range score is not a blocker. It points to where the
                  groundwork is, and the fastest first build is almost always a high-volume,
                  well-documented process.
                </p>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-10">
            {!showForm ? (
              <div className="text-center">
                <p className="text-navy-500 mb-4">
                  {allAnswered
                    ? 'Want a personalized AI readiness roadmap for your organization?'
                    : 'Complete the assessment above to unlock your results, then get a personalized consultation.'}
                </p>
                <button onClick={() => setShowForm(true)} className="btn-primary">
                  Get an AI Readiness Consultation
                  <ArrowRight size={18} />
                </button>
              </div>
            ) : (
              <CrmFormEmbed form="ai" />
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-cyan-600">
        <div className="absolute inset-0 bg-grid-dark bg-grid opacity-20" />
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            <span className="block">AI is transforming telecom.</span>
            <span className="block text-brand-100">Make sure you're ready to lead, not follow.</span>
          </h2>
          <div className="mt-8 lg:mt-0 lg:flex-shrink-0">
            <button onClick={() => setShowForm(true)} className="btn-light">
              Get an AI Readiness Consultation
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AiReadinessAssessment;
