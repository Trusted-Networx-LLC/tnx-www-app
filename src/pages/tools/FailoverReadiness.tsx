import React, { useState, useMemo } from 'react';
import { Shield, ArrowRight, CheckCircle2, AlertTriangle, XCircle, Wifi, Globe, CloudOff, Radio, Satellite, Cable, Info, Building2, Clock, FileText, ServerCrash } from 'lucide-react';
import Seo from '../../components/Seo';
import CrmFormEmbed from '../../components/CrmFormEmbed';
import type { CrmFormContext } from '../../lib/crm-forms';

const SITE_TIERS = [
  { value: '1', label: '1', score: 5 },
  { value: '2-5', label: '2–5', score: 10 },
  { value: '6-20', label: '6–20', score: 15 },
  { value: '20+', label: '20+', score: 25 },
];

const BACKUP_OPTIONS = [
  { value: 'yes_all', label: 'Yes, all locations', score: 0, good: true },
  { value: 'most', label: 'Most locations', score: 10, good: false },
  { value: 'some', label: 'Some locations', score: 15, good: false },
  { value: 'none', label: 'None', score: 25, good: false },
];

const CONNECTION_TYPES = [
  { value: 'fiber', label: 'Fiber', icon: Wifi, score: 3, riskLabel: 'Lowest risk' },
  { value: 'cable', label: 'Cable', icon: Cable, score: 8, riskLabel: 'Moderate risk' },
  { value: 'fixed_wireless', label: 'Fixed Wireless', icon: Radio, score: 5, riskLabel: 'Low-moderate risk' },
  { value: 'dsl', label: 'DSL', icon: Globe, score: 15, riskLabel: 'Higher risk' },
  { value: 'satellite', label: 'Satellite', icon: Satellite, score: 12, riskLabel: 'Latency concerns' },
  { value: 't1_pri', label: 'T1 / PRI', icon: ServerCrash, score: 20, riskLabel: 'Legacy — sunset risk' },
];

const DOWNTIME_TIERS = [
  { value: '<1m', label: '< 1 minute', score: 25 },
  { value: '<5m', label: '< 5 minutes', score: 20 },
  { value: '<1h', label: '< 1 hour', score: 10 },
  { value: '<4h', label: '< 4 hours', score: 5 },
  { value: '<1d', label: '< 1 day', score: 0 },
];

const DR_PLAN_OPTIONS = [
  { value: 'yes_tested', label: 'Yes, tested regularly', score: 0, good: true },
  { value: 'yes_untested', label: 'Yes, but untested', score: 10, good: false },
  { value: 'in_dev', label: 'In development', score: 15, good: false },
  { value: 'no', label: 'No DR plan', score: 25, good: false },
];

const SCORE_CATEGORIES: { min: number; max: number; label: string; color: string; bg: string; text: string; iconBg: string }[] = [
  { min: 0, max: 30, label: 'Resilient', color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-700', iconBg: 'from-emerald-500 to-teal-600' },
  { min: 31, max: 60, label: 'Needs Improvement', color: 'amber', bg: 'bg-amber-50', text: 'text-amber-700', iconBg: 'from-amber-500 to-yellow-600' },
  { min: 61, max: 90, label: 'Vulnerable', color: 'orange', bg: 'bg-orange-50', text: 'text-orange-700', iconBg: 'from-orange-500 to-red-500' },
  { min: 91, max: 200, label: 'At Risk', color: 'red', bg: 'bg-red-50', text: 'text-red-700', iconBg: 'from-red-600 to-rose-700' },
];

const RECOMMENDATIONS: Record<string, string[]> = {
  backup: [
    'Deploy 4G/5G cellular failover at all critical locations',
    'Consider SD-WAN for intelligent traffic routing across multiple connections',
    'Implement automatic failover testing on a monthly schedule',
  ],
  connection: [
    'Replace T1/PRI lines with fiber or high-speed cable alternatives',
    'Add a secondary connection type (e.g., cellular backup for DSL sites)',
    'Audit all connection contracts for SLA guarantees and uptime commitments',
  ],
  dr_plan: [
    'Develop and document a formal disaster recovery plan with clear RTO/RPO targets',
    'Conduct quarterly DR plan reviews and tabletop exercises',
    'Include telecom-specific recovery procedures for each location type',
  ],
  downtime: [
    'Implement redundant connectivity with sub-second failover for mission-critical sites',
    'Deploy local edge computing for essential services that cannot tolerate WAN latency',
    'Review and right-size your uptime SLAs — ensure they match actual business needs',
  ],
  sites: [
    'Implement centralized network monitoring across all locations',
    'Standardize connectivity hardware and configurations for easier management',
    'Consider managed SD-WAN for multi-site visibility and control',
  ],
};

const FailoverReadiness = () => {
  const [sites, setSites] = useState('');
  const [backup, setBackup] = useState('');
  const [connection, setConnection] = useState('');
  const [downtime, setDowntime] = useState('');
  const [drPlan, setDrPlan] = useState('');

  const totalScore = useMemo(() => {
    let score = 0;
    const s = SITE_TIERS.find((t) => t.value === sites);
    if (s) score += s.score;
    const b = BACKUP_OPTIONS.find((t) => t.value === backup);
    if (b) score += b.score;
    const c = CONNECTION_TYPES.find((t) => t.value === connection);
    if (c) score += c.score;
    const d = DOWNTIME_TIERS.find((t) => t.value === downtime);
    if (d) score += d.score;
    const p = DR_PLAN_OPTIONS.find((t) => t.value === drPlan);
    if (p) score += p.score;
    return score;
  }, [sites, backup, connection, downtime, drPlan]);

  const category = useMemo(() => {
    return SCORE_CATEGORIES.find((c) => totalScore >= c.min && totalScore <= c.max) ?? SCORE_CATEGORIES[3];
  }, [totalScore]);

  const maxPossible = 25 + 25 + 20 + 25 + 25; // 120

  // Factor analysis
  const factorResults = useMemo(() => {
    return {
      sites: {
        label: 'Multi-Site Complexity',
        icon: Building2,
        value: SITE_TIERS.find((t) => t.value === sites)?.label ?? '—',
        score: SITE_TIERS.find((t) => t.value === sites)?.score ?? 0,
        max: 25,
        good: (SITE_TIERS.find((t) => t.value === sites)?.score ?? 99) <= 5,
      },
      backup: {
        label: 'Backup Connectivity',
        icon: CloudOff,
        value: BACKUP_OPTIONS.find((t) => t.value === backup)?.label ?? '—',
        score: BACKUP_OPTIONS.find((t) => t.value === backup)?.score ?? 0,
        max: 25,
        good: BACKUP_OPTIONS.find((t) => t.value === backup)?.good ?? false,
      },
      connection: {
        label: 'Connection Reliability',
        icon: Globe,
        value: CONNECTION_TYPES.find((t) => t.value === connection)?.label ?? '—',
        score: CONNECTION_TYPES.find((t) => t.value === connection)?.score ?? 0,
        max: 20,
        good: (CONNECTION_TYPES.find((t) => t.value === connection)?.score ?? 99) <= 5,
      },
      downtime: {
        label: 'Downtime Tolerance',
        icon: Clock,
        value: DOWNTIME_TIERS.find((t) => t.value === downtime)?.label ?? '—',
        score: DOWNTIME_TIERS.find((t) => t.value === downtime)?.score ?? 0,
        max: 25,
        good: (DOWNTIME_TIERS.find((t) => t.value === downtime)?.score ?? 99) <= 5,
      },
      drPlan: {
        label: 'Disaster Recovery Plan',
        icon: FileText,
        value: DR_PLAN_OPTIONS.find((t) => t.value === drPlan)?.label ?? '—',
        score: DR_PLAN_OPTIONS.find((t) => t.value === drPlan)?.score ?? 0,
        max: 25,
        good: DR_PLAN_OPTIONS.find((t) => t.value === drPlan)?.good ?? false,
      },
    };
  }, [sites, backup, connection, downtime, drPlan]);

  // Everything the visitor answered, so the CRM lead carries the questions, answers and score.
  const crmContext = useMemo<CrmFormContext>(() => ({
    v: 1,
    tool: 'failover-readiness',
    title: 'Business Continuity Readiness Check',
    score: totalScore,
    max: maxPossible,
    band: category.label,
    scale: 'higher = more risk',
    answers: Object.values(factorResults).map((f) => ({
      q: f.label,
      a: f.value === '—' ? 'Not answered' : f.value,
      points: f.score,
      max: f.max,
    })),
  }), [totalScore, maxPossible, category, factorResults]);

  // Recommendations: pick top 2 worst factors
  const recommendations = useMemo(() => {
    const entries = Object.entries(factorResults)
      .map(([key, val]) => ({ key, pct: val.max > 0 ? val.score / val.max : 0 }))
      .filter((e) => e.pct > 0.33)
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 2);

    const recs: string[] = [];
    for (const entry of entries) {
      const recList = RECOMMENDATIONS[entry.key];
      if (recList) recs.push(...recList.slice(0, 2));
    }
    return recs.length > 0 ? recs : ['Your organization appears well-prepared. Consider periodic reassessments and staying current with emerging connectivity technologies.'];
  }, [factorResults]);

  const hasAnyInput = sites || backup || connection || downtime || drPlan;

  // Form state
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="bg-navy-50">
      <Seo
        title="Business Continuity Readiness Check | TrustedNetworx"
        description="How prepared is your organization for a connectivity outage? Assess wireless failover and business continuity readiness with this TrustedNetworx tool."
        jsonLd={{
          // Free tool → WebApplication (name = page title without site suffix).
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Business Continuity Readiness Check',
          url: 'https://trustednetworx.com/tools/failover-readiness',
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
                <Shield size={14} />
                Interactive Assessment Tool
              </span>
              <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
                {'Business Continuity '}
                <span className="text-brand-300">
                  Readiness Check
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-lg sm:text-xl text-navy-200">
                How prepared is your organization for a connectivity outage?
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
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <Shield size={20} />
              </span>
              Readiness Questionnaire
            </h2>
            <p className="mt-2 text-navy-500">
              Answer the questions below to assess your organization's business continuity posture.
            </p>

            <div className="mt-8 space-y-8">
              {/* Q1: Sites */}
              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-3">
                  1. How many locations / sites does your organization operate?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {SITE_TIERS.map((tier) => (
                    <button
                      key={tier.value}
                      onClick={() => setSites(tier.value)}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                        sites === tier.value
                          ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-500'
                          : 'border-navy-200 bg-white text-navy-600 hover:border-navy-300 hover:bg-navy-50'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q2: Backup */}
              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-3">
                  2. Do you have backup internet at all locations?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {BACKUP_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setBackup(opt.value)}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                        backup === opt.value
                          ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-500'
                          : 'border-navy-200 bg-white text-navy-600 hover:border-navy-300 hover:bg-navy-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q3: Connection type */}
              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-3">
                  3. What's your primary connection type?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {CONNECTION_TYPES.map((ct) => {
                    const Icon = ct.icon;
                    return (
                      <button
                        key={ct.value}
                        onClick={() => setConnection(ct.value)}
                        className={`flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-semibold transition-all duration-200 ${
                          connection === ct.value
                            ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-500'
                            : 'border-navy-200 bg-white text-navy-600 hover:border-navy-300 hover:bg-navy-50'
                        }`}
                      >
                        <Icon size={20} />
                        {ct.label}
                        <span className="text-[10px] font-normal text-navy-400">{ct.riskLabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Q4: Downtime tolerance */}
              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-3">
                  4. What's your average acceptable downtime?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {DOWNTIME_TIERS.map((tier) => (
                    <button
                      key={tier.value}
                      onClick={() => setDowntime(tier.value)}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                        downtime === tier.value
                          ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-500'
                          : 'border-navy-200 bg-white text-navy-600 hover:border-navy-300 hover:bg-navy-50'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q5: DR plan */}
              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-3">
                  5. Do you have an active disaster recovery plan?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {DR_PLAN_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setDrPlan(opt.value)}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                        drPlan === opt.value
                          ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-500'
                          : 'border-navy-200 bg-white text-navy-600 hover:border-navy-300 hover:bg-navy-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          {hasAnyInput && (
            <div className="mt-8 rounded-2xl bg-gradient-to-br from-navy-50 to-white border border-navy-200 p-6 sm:p-10">
              {/* Score header */}
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <div className="flex flex-col items-center">
                  <span
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${category.iconBg} text-white shadow-lg`}
                  >
                    <Shield size={24} />
                  </span>
                </div>
                <div className="text-center sm:text-left">
                  <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
                    <span className="text-5xl sm:text-6xl font-extrabold text-navy-900">
                      {totalScore}
                    </span>
                    <span className="text-lg text-navy-400">/ {maxPossible}</span>
                  </div>
                  <span
                    className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold ${category.bg} ${category.text}`}
                  >
                    {category.label === 'Resilient' ? (
                      <CheckCircle2 size={14} />
                    ) : category.label === 'At Risk' ? (
                      <XCircle size={14} />
                    ) : (
                      <AlertTriangle size={14} />
                    )}
                    {category.label}
                  </span>
                </div>
              </div>

              {/* Factor breakdown */}
              <h4 className="font-semibold text-navy-900 mb-4">Factor Analysis</h4>
              <div className="space-y-3 mb-8">
                {Object.values(factorResults).map((factor) => {
                  const Icon = factor.icon;
                  return (
                    <div
                      key={factor.label}
                      className="rounded-xl bg-white border border-navy-100 p-4 flex items-center gap-4"
                    >
                      <span className="flex-shrink-0">
                        {factor.good ? (
                          <CheckCircle2 size={20} className="text-emerald-500" />
                        ) : factor.score > 0 ? (
                          <AlertTriangle size={20} className="text-amber-500" />
                        ) : (
                          <CheckCircle2 size={20} className="text-emerald-500" />
                        )}
                      </span>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon size={16} className="text-navy-400 flex-shrink-0" />
                          <p className="text-sm font-semibold text-navy-800 truncate">
                            {factor.label}
                          </p>
                        </div>
                        <p className="text-xs text-navy-500">{factor.value}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <span
                          className={`text-sm font-bold ${
                            factor.good ? 'text-emerald-600' : factor.score > 10 ? 'text-red-600' : 'text-amber-600'
                          }`}
                        >
                          {factor.score}
                        </span>
                        <span className="text-xs text-navy-400"> / {factor.max}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recommendations */}
              <div className="rounded-xl bg-brand-50 border border-brand-200 p-5">
                <h4 className="font-semibold text-navy-900 flex items-center gap-2 mb-3">
                  <Info size={16} className="text-brand-600" />
                  Recommendations
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
            </div>
          )}

          {/* CTA */}
          <div className="mt-10">
            {!showForm ? (
              <div className="text-center">
                <p className="text-navy-500 mb-4">
                  Want a comprehensive continuity strategy for your organization?
                </p>
                <button onClick={() => setShowForm(true)} className="btn-primary">
                  Get a Continuity Consultation
                  <ArrowRight size={18} />
                </button>
              </div>
            ) : (
              <CrmFormEmbed form="potsVoice" context={crmContext} />
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-cyan-600">
        <div className="absolute inset-0 bg-grid-dark bg-grid opacity-20" />
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            <span className="block">Downtime isn't an option.</span>
            <span className="block text-brand-100">Let's make sure your business never skips a beat.</span>
          </h2>
          <div className="mt-8 lg:mt-0 lg:flex-shrink-0">
            <button onClick={() => setShowForm(true)} className="btn-light">
              Get a Continuity Consultation
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FailoverReadiness;
