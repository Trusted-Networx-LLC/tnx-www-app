import React, { useState, useMemo } from 'react';
import { AlertTriangle, ArrowRight, Flame, PhoneCall, Lock, ShoppingCart, Printer, Siren, DoorOpen, MoreHorizontal, Gauge, Info } from 'lucide-react';
import Seo from '../../components/Seo';
import CrmFormEmbed from '../../components/CrmFormEmbed';

const INDUSTRIES = [
  'Property Management',
  'Senior Living',
  'Hospitality',
  'Healthcare',
  'Education',
  'Government',
  'Retail',
  'Manufacturing',
  'Financial Services',
  'Other',
];

type SystemId =
  | 'fire_alarm'
  | 'elevator'
  | 'security'
  | 'pos'
  | 'fax'
  | 'emergency_phones'
  | 'building_access'
  | 'other';

interface SystemOption {
  id: SystemId;
  label: string;
  icon: React.ElementType;
  critical: boolean;
}

const SYSTEMS: SystemOption[] = [
  { id: 'fire_alarm', label: 'Fire Alarm', icon: Flame, critical: true },
  { id: 'elevator', label: 'Elevator Phones', icon: PhoneCall, critical: true },
  { id: 'security', label: 'Security Systems', icon: Lock, critical: true },
  { id: 'emergency_phones', label: 'Emergency Phones', icon: Siren, critical: true },
  { id: 'pos', label: 'POS Terminals', icon: ShoppingCart, critical: false },
  { id: 'fax', label: 'Fax Machines', icon: Printer, critical: false },
  { id: 'building_access', label: 'Building Access', icon: DoorOpen, critical: false },
  { id: 'other', label: 'Other', icon: MoreHorizontal, critical: false },
];

const LINE_TIERS = [
  { value: '1-10', label: '1–10', score: 5 },
  { value: '11-50', label: '11–50', score: 10 },
  { value: '51-200', label: '51–200', score: 20 },
  { value: '200+', label: '200+', score: 30 },
];

const AUDIT_TIERS = [
  { value: '6m', label: 'Within 6 months', score: 0 },
  { value: '6-12m', label: '6–12 months', score: 5 },
  { value: '1-2y', label: '1–2 years', score: 15 },
  { value: '2y+', label: '2+ years', score: 20 },
  { value: 'never', label: 'Never', score: 25 },
];

const INDUSTRY_NOTES: Record<string, string> = {
  'Senior Living':
    'Senior Living facilities have NFPA 72 compliance requirements — your fire alarm and emergency communication systems are regulated. Copper sunset directly impacts life-safety compliance.',
  Healthcare:
    'Healthcare facilities must maintain compliance with Joint Commission requirements for emergency communications. Copper decommissioning can affect nurse call, emergency phones, and alarm systems.',
  'Property Management':
    'Multi-tenant properties rely on copper for elevator phones, fire alarm panels, and entry systems — all of which have code-mandated connectivity requirements.',
  Hospitality:
    'Guest safety systems including elevator emergency phones, fire panels, and security alarms may depend on copper lines — downtime impacts guest experience and liability.',
  Education:
    'Campus safety systems (emergency phones, fire alarms, elevator comms) are often copper-dependent with strict regulatory oversight.',
  Government:
    'Government facilities often have legacy copper infrastructure with stringent security and reliability requirements.',
  Retail:
    'POS terminals, security alarms, and building access systems may all depend on copper — outages mean lost revenue.',
  Manufacturing:
    'Industrial gate access, fire panels, security systems, and telemetry equipment often rely on legacy copper lines.',
  'Financial Services':
    'ATMs, alarm systems, and backup communications frequently depend on copper — reliability is non-negotiable.',
};

const CopperSunsetRisk = () => {
  const [lineTier, setLineTier] = useState('');
  const [selectedSystems, setSelectedSystems] = useState<Set<SystemId>>(new Set());
  const [industry, setIndustry] = useState('');
  const [auditRecency, setAuditRecency] = useState('');

  const toggleSystem = (id: SystemId) => {
    setSelectedSystems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const riskScore = useMemo(() => {
    let score = 0;
    // Line tier
    const tier = LINE_TIERS.find((t) => t.value === lineTier);
    if (tier) score += tier.score;
    // Systems
    for (const sys of SYSTEMS) {
      if (selectedSystems.has(sys.id)) {
        score += sys.critical ? 10 : 3;
      }
    }
    // Audit recency
    const audit = AUDIT_TIERS.find((t) => t.value === auditRecency);
    if (audit) score += audit.score;
    return Math.min(score, 100);
  }, [lineTier, selectedSystems, auditRecency]);

  const riskLevel = useMemo(() => {
    if (riskScore <= 25) return { label: 'Low', color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-500' };
    if (riskScore <= 50) return { label: 'Moderate', color: 'amber', bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-500' };
    if (riskScore <= 75) return { label: 'High', color: 'orange', bg: 'bg-orange-50', text: 'text-orange-700', ring: 'ring-orange-500' };
    return { label: 'Critical', color: 'red', bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-500' };
  }, [riskScore]);

  // Scoring breakdown
  const breakdown = useMemo(() => {
    const items: { label: string; points: number; max: number }[] = [];
    const tier = LINE_TIERS.find((t) => t.value === lineTier);
    items.push({
      label: `Copper lines (${tier?.label ?? 'none selected'})`,
      points: tier?.score ?? 0,
      max: 30,
    });
    const sysPoints = SYSTEMS.filter((s) => selectedSystems.has(s.id)).reduce(
      (sum, s) => sum + (s.critical ? 10 : 3),
      0,
    );
    const sysMax = SYSTEMS.reduce((sum, s) => sum + (s.critical ? 10 : 3), 0);
    items.push({
      label: `Copper-dependent systems (${selectedSystems.size} selected)`,
      points: sysPoints,
      max: sysMax,
    });
    const audit = AUDIT_TIERS.find((a) => a.value === auditRecency);
    items.push({
      label: `Last audit (${audit?.label ?? 'none selected'})`,
      points: audit?.score ?? 0,
      max: 25,
    });
    return items;
  }, [lineTier, selectedSystems, auditRecency]);

  const hasAnyInput = lineTier || selectedSystems.size > 0 || auditRecency;

  // Risk gauge angle
  const gaugeAngle = useMemo(() => (riskScore / 100) * 270 - 135, [riskScore]);

  // Form state
  const [showForm, setShowForm] = useState(false);

  const industryNote = industry ? INDUSTRY_NOTES[industry] : null;

  return (
    <div className="bg-navy-50">
      <Seo
        title="Copper Sunset Risk Assessment | TrustedNetworx"
        description="Size your organization's exposure to the copper network shutdown. Identify at-risk phone lines, elevator lines, alarm panels, fax machines, and POS lines."
        jsonLd={{
          // Free tool → WebApplication (name = page title without site suffix).
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Copper Sunset Risk Assessment',
          url: 'https://trustednetworx.com/tools/copper-sunset-risk',
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
                <AlertTriangle size={14} />
                Interactive Assessment Tool
              </span>
              <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
                {'Copper Sunset '}
                <span className="text-brand-300">
                  Risk Assessment
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-lg sm:text-xl text-navy-200">
                Evaluate your organization's exposure to the copper network decommissioning.
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
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                <AlertTriangle size={20} />
              </span>
              Risk Assessment Questionnaire
            </h2>
            <p className="mt-2 text-navy-500">
              Answer the questions below to receive your organization's copper sunset risk score.
            </p>

            <div className="mt-8 space-y-8">
              {/* Q1: Copper-dependent lines */}
              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-3">
                  1. How many copper-dependent lines does your organization have?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {LINE_TIERS.map((tier) => (
                    <button
                      key={tier.value}
                      onClick={() => setLineTier(tier.value)}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                        lineTier === tier.value
                          ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-500'
                          : 'border-navy-200 bg-white text-navy-600 hover:border-navy-300 hover:bg-navy-50'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q2: Systems */}
              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-3">
                  2. What systems rely on these lines? (Select all that apply)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {SYSTEMS.map((sys) => {
                    const isSelected = selectedSystems.has(sys.id);
                    return (
                      <button
                        key={sys.id}
                        onClick={() => toggleSystem(sys.id)}
                        className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 ${
                          isSelected
                            ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-500'
                            : 'border-navy-200 bg-white text-navy-600 hover:border-navy-300 hover:bg-navy-50'
                        }`}
                      >
                        <sys.icon size={16} className="flex-shrink-0" />
                        {sys.label}
                        {sys.critical && (
                          <span className="ml-auto text-[10px] uppercase tracking-wider text-red-500 font-semibold">
                            Critical
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Q3: Industry */}
              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-2">
                  3. What's your industry?
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-navy-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                >
                  <option value="">Select your industry</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              {/* Q4: Audit */}
              <div>
                <label className="block text-sm font-semibold text-navy-800 mb-3">
                  4. When was your last telecom audit?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {AUDIT_TIERS.map((tier) => (
                    <button
                      key={tier.value}
                      onClick={() => setAuditRecency(tier.value)}
                      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                        auditRecency === tier.value
                          ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-500'
                          : 'border-navy-200 bg-white text-navy-600 hover:border-navy-300 hover:bg-navy-50'
                      }`}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          {hasAnyInput && (
            <div className="mt-8 rounded-2xl bg-gradient-to-br from-navy-50 to-white border border-navy-200 p-6 sm:p-10">
              <div className="flex items-center gap-3 mb-8">
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${
                  riskLevel.color === 'emerald' ? 'from-emerald-500 to-teal-600' :
                  riskLevel.color === 'amber' ? 'from-amber-500 to-yellow-600' :
                  riskLevel.color === 'orange' ? 'from-orange-500 to-red-500' :
                  'from-red-600 to-rose-700'
                } text-white`}>
                  <Gauge size={20} />
                </span>
                <div>
                  <h3 className="text-xl font-extrabold text-navy-900">Risk Assessment Results</h3>
                  <p className="text-sm text-navy-500">Your copper sunset exposure score</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Gauge + Score */}
                <div className="lg:col-span-2 flex flex-col items-center">
                  {/* SVG gauge */}
                  <div className="relative w-48 h-48">
                    <svg viewBox="0 0 200 120" className="w-full">
                      {/* Background arc */}
                      <path
                        d="M 30 110 A 80 80 0 0 1 170 110"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="16"
                        strokeLinecap="round"
                      />
                      {/* Colored segments */}
                      <path
                        d="M 30 110 A 80 80 0 0 1 86.5 45.5"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="16"
                        strokeLinecap="round"
                        opacity={riskScore <= 25 ? 1 : 0.4}
                      />
                      <path
                        d="M 86.5 45.5 A 80 80 0 0 1 130.5 32"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="16"
                        strokeLinecap="round"
                        opacity={riskScore > 25 && riskScore <= 50 ? 1 : 0.4}
                      />
                      <path
                        d="M 130.5 32 A 80 80 0 0 1 155.5 56"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="16"
                        strokeLinecap="round"
                        opacity={riskScore > 50 && riskScore <= 75 ? 1 : 0.4}
                      />
                      <path
                        d="M 155.5 56 A 80 80 0 0 1 170 110"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="16"
                        strokeLinecap="round"
                        opacity={riskScore > 75 ? 1 : 0.4}
                      />
                      {/* Needle */}
                      <line
                        x1="100"
                        y1="110"
                        x2={100 + 75 * Math.cos((gaugeAngle * Math.PI) / 180)}
                        y2={110 + 75 * Math.sin((gaugeAngle * Math.PI) / 180)}
                        stroke="#1e293b"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <circle cx="100" cy="110" r="6" fill="#1e293b" />
                    </svg>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center">
                      <p className={`text-4xl font-extrabold ${riskLevel.text}`}>
                        {riskScore}
                      </p>
                      <p className="text-xs text-navy-400">/100</p>
                    </div>
                  </div>
                  <span
                    className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold ${riskLevel.bg} ${riskLevel.text} ring-1 ring-inset ${riskLevel.ring}`}
                  >
                    <AlertTriangle size={14} />
                    {riskLevel.label} Risk
                  </span>
                </div>

                {/* Breakdown */}
                <div className="lg:col-span-3 space-y-4">
                  <h4 className="font-semibold text-navy-900">Score Breakdown</h4>
                  {breakdown.map((item) => {
                    const pct = item.max > 0 ? (item.points / item.max) * 100 : 0;
                    return (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-navy-600">{item.label}</span>
                          <span className="font-semibold text-navy-900">
                            {item.points} / {item.max}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-navy-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              pct > 66
                                ? 'bg-red-500'
                                : pct > 33
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.max(pct, 2)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Industry-specific note */}
              {industryNote && (
                <div className="mt-6 rounded-xl bg-brand-50 border border-brand-200 p-4 flex items-start gap-3">
                  <Info size={18} className="text-brand-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-brand-800 leading-relaxed">{industryNote}</p>
                </div>
              )}
            </div>
          )}

          {/* CTA */}
          <div className="mt-10">
            {!showForm ? (
              <div className="text-center">
                <p className="text-navy-500 mb-4">
                  Want a detailed risk mitigation strategy for your organization?
                </p>
                <button onClick={() => setShowForm(true)} className="btn-primary">
                  Get a Risk Mitigation Plan
                  <ArrowRight size={18} />
                </button>
              </div>
            ) : (
              <CrmFormEmbed form="potsVoice" />
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-cyan-600">
        <div className="absolute inset-0 bg-grid-dark bg-grid opacity-20" />
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            <span className="block">Don't wait for the sunset.</span>
            <span className="block text-brand-100">Get ahead of copper decommissioning today.</span>
          </h2>
          <div className="mt-8 lg:mt-0 lg:flex-shrink-0">
            <button onClick={() => setShowForm(true)} className="btn-light">
              Get a Risk Mitigation Plan
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CopperSunsetRisk;
