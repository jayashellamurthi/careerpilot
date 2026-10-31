'use client';

import { useTheme, useWidgetSDK } from '@nitrostack/widgets';

interface MatchData {
  job_title: string;
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  verdict: string;
  tip: string;
}

export default function MatchScore() {
  const theme = useTheme();
  const { getToolOutput } = useWidgetSDK();
  const data = getToolOutput<MatchData>();

  const isDark = theme === 'dark';
  const textColor = isDark ? '#ffffff' : '#111827';

  if (!data) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: textColor }}>
        Loading...
      </div>
    );
  }

  const score = data.match_score || 0;
  const scoreColor = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';

  const chip = (label: string, bg: string, key: string) => (
    <span
      key={key}
      style={{
        display: 'inline-block',
        padding: '4px 10px',
        margin: '3px',
        borderRadius: '999px',
        fontSize: '12px',
        background: bg,
        color: 'white'
      }}
    >
      {label}
    </span>
  );

  return (
    <div
      style={{
        padding: '24px',
        borderRadius: '16px',
        maxWidth: '420px',
        color: 'white',
        background: isDark
          ? 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
          : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}
    >
      <div style={{ fontSize: '13px', opacity: 0.8 }}>CareerPilot Resume Match</div>
      <h3 style={{ margin: '4px 0 16px 0', fontSize: '20px' }}>{data.job_title}</h3>

      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '56px', fontWeight: 'bold', color: scoreColor, lineHeight: 1 }}>
          {score}%
        </div>
        <div style={{ fontSize: '14px', opacity: 0.9, marginTop: '6px' }}>{data.verdict}</div>
      </div>

      <div
        style={{
          height: '10px',
          borderRadius: '999px',
          background: 'rgba(255,255,255,0.2)',
          overflow: 'hidden',
          marginBottom: '20px'
        }}
      >
        <div
          style={{
            width: score + '%',
            height: '100%',
            background: scoreColor,
            transition: 'width 0.6s ease'
          }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>Matched skills</div>
        {data.matched_skills && data.matched_skills.length > 0
          ? data.matched_skills.map((s) => chip(s, '#10b981', 'm-' + s))
          : <span style={{ fontSize: '12px', opacity: 0.7 }}>None found</span>}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>Missing skills</div>
        {data.missing_skills && data.missing_skills.length > 0
          ? data.missing_skills.map((s) => chip(s, '#ef4444', 'x-' + s))
          : <span style={{ fontSize: '12px', opacity: 0.7 }}>Nothing missing</span>}
      </div>

      <div
        style={{
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '12px',
          padding: '12px',
          fontSize: '13px'
        }}
      >
        {data.tip}
      </div>
    </div>
  );
}
