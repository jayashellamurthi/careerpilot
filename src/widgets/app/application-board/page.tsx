'use client';

import { useTheme, useWidgetSDK } from '@nitrostack/widgets';

interface Application {
  id: number;
  company: string;
  role: string;
  status: string;
  notes: string;
  added_on: string;
}

interface BoardData {
  total: number;
  applications: Application[];
}

const COLUMNS: { key: string; label: string; color: string }[] = [
  { key: 'saved', label: 'Saved', color: '#6b7280' },
  { key: 'applied', label: 'Applied', color: '#3b82f6' },
  { key: 'interview', label: 'Interview', color: '#f59e0b' },
  { key: 'offer', label: 'Offer', color: '#10b981' },
  { key: 'rejected', label: 'Rejected', color: '#ef4444' }
];

export default function ApplicationBoard() {
  const theme = useTheme();
  const { getToolOutput } = useWidgetSDK();
  const data = getToolOutput<BoardData>();

  const isDark = theme === 'dark';
  const textColor = isDark ? '#ffffff' : '#111827';
  const panelBg = isDark ? '#1f2937' : '#f3f4f6';
  const cardBg = isDark ? '#374151' : '#ffffff';

  if (!data) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: textColor }}>
        Loading...
      </div>
    );
  }

  const apps = data.applications || [];

  return (
    <div
      style={{
        padding: '20px',
        borderRadius: '16px',
        color: textColor,
        background: isDark ? '#111827' : '#ffffff',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}
      >
        <h3 style={{ margin: 0, fontSize: '18px' }}>CareerPilot Application Board</h3>
        <span style={{ fontSize: '13px', opacity: 0.7 }}>{data.total} total</span>
      </div>

      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto' }}>
        {COLUMNS.map((col) => {
          const items = apps.filter((a) => a.status === col.key);
          return (
            <div
              key={col.key}
              style={{
                minWidth: '150px',
                flex: '1 0 150px',
                background: panelBg,
                borderRadius: '12px',
                padding: '10px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                  borderBottom: '3px solid ' + col.color,
                  paddingBottom: '6px',
                  fontSize: '13px',
                  fontWeight: 'bold'
                }}
              >
                <span>{col.label}</span>
                <span style={{ opacity: 0.7 }}>{items.length}</span>
              </div>

              {items.length === 0 && (
                <div style={{ fontSize: '12px', opacity: 0.5, padding: '6px 2px' }}>Empty</div>
              )}

              {items.map((a) => (
                <div
                  key={a.id}
                  style={{
                    background: cardBg,
                    borderRadius: '8px',
                    padding: '8px',
                    marginBottom: '8px',
                    borderLeft: '4px solid ' + col.color,
                    fontSize: '12px'
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{a.company}</div>
                  <div style={{ opacity: 0.85 }}>{a.role}</div>
                  <div style={{ opacity: 0.55, marginTop: '4px', fontSize: '11px' }}>
                    {a.added_on}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
