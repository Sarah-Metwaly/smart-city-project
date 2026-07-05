import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Incident } from '../../types/incident';
import { X } from 'lucide-react';
import  WarningIcon  from '../../icons/WarningIcon';

interface CriticalAlertBannerProps {
  incident: Incident | null;
  onDismiss: () => void;
  autoDismissMs?: number;
}

const SEEN_KEY = 'cab-seen-incident-ids';
const MAX_STORED = 200; // avoid unbounded growth in localStorage

function getSeenIds(): Set<string> {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function markSeen(id: string) {
  try {
    const seen = getSeenIds();
    seen.add(id);
    const arr = Array.from(seen).slice(-MAX_STORED);
    localStorage.setItem(SEEN_KEY, JSON.stringify(arr));
  } catch {
    // localStorage might be unavailable (private mode, quota, etc.) — fail silently
  }
}

const TYPE_META: Record<string, { icon: React.ReactNode; label: string; path: string; gradient: string }> = {
  FIRE_DETECTION: {
    icon: <WarningIcon />,
    label: 'FIRE DETECTION',
    path: '/fire',
    gradient: 'linear-gradient(90deg, #500c0f 0%, #851e23 50%, #500c0f 100%)',
  },
  THEFT_DETECTION: {
    icon: <WarningIcon />,
    label: 'THEFT DETECTION',
    path: '/police?view=behavior',
    gradient: 'linear-gradient(90deg, #3d0a0a 0%, #6e1313 50%, #3d0a0a 100%)',
  },
};

const DEFAULT_META = {
  icon: <WarningIcon />,
  label: 'INCIDENT',
  path: '/police?view=LiveEvents',
  gradient: 'linear-gradient(90deg, #3d0a0a 0%, #6e1313 50%, #3d0a0a 100%)',
};

const CriticalAlertBanner: React.FC<CriticalAlertBannerProps> = ({
  incident,
  onDismiss,
  autoDismissMs = 10000,
}) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastShownIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!incident) {
      setVisible(false);
      return;
    }

    const incidentId = incident.incidentId;

    // Guard against React StrictMode double-invocation (or any duplicate
    // re-run) for the exact same incident. This MUST run before the
    // seen-check below — otherwise the second invocation sees the incident
    // as "already seen" (because the first invocation just marked it) and
    // immediately hides the banner that was just shown.
    if (lastShownIdRef.current === incidentId) return;

    // Already seen before (this session or a previous one, via localStorage) → skip
    if (getSeenIds().has(incidentId)) {
      setVisible(false);
      return;
    }

    lastShownIdRef.current = incidentId;

    // Mark as seen immediately, so a refresh right after doesn't show it again
    markSeen(incidentId);

    setVisible(true);
    setProgress(100);

    const stepMs = 30;
    const totalSteps = autoDismissMs / stepMs;
    let step = 0;

    intervalRef.current = setInterval(() => {
      step += 1;
      setProgress(Math.max(0, 100 - (step / totalSteps) * 100));
    }, stepMs);

    timerRef.current = setTimeout(() => {
      handleDismiss();
    }, autoDismissMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [incident, autoDismissMs]);

  const handleDismiss = () => {
    setVisible(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeout(() => onDismiss(), 400); // Increased slightly for smoother exit
  };

  if (!incident) return null;

  // Don't render unless this incident is the one we've actively decided to show.
  if (lastShownIdRef.current !== incident.incidentId) return null;

  const meta = TYPE_META[incident.type] ?? DEFAULT_META;
  const zoneName = incident.location?.zone || incident.location?.name || 'Unknown';
  const time = new Date(incident.createdAt).toLocaleTimeString('en-GB');

  return (
    <div
      role="alert"
      style={{
        position: 'relative',
        width: '100%',
        zIndex: 200,
        background: meta.gradient,
        overflow: 'hidden',
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        opacity: visible ? 1 : 0,
        maxHeight: visible ? 100 : 0,
        transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease, maxHeight 0.45s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '12px 2rem',
          maxWidth: 1920,
          margin: '0 auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {meta.icon}
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '0.1em',
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '3px 8px',
              borderRadius: 5,
            }}
          >
            CRITICAL
          </span>
        </div>

        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{meta.label}</span>
          <span style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.85)' }}>
            detected in <b>{zoneName}</b>
            {typeof incident.aiData?.confidence === 'number' && (
              <> — AI confidence <b>{incident.aiData.confidence}%</b></>
            )}
          </span>
          <span style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.55)' }}>{time}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => {
              navigate(meta.path);
              handleDismiss();
            }}
            style={{
              background: '#fff',
              color: '#851e23',
              fontSize: 11,
              fontWeight: 700,
              padding: '6px 16px',
              borderRadius: 7,
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.03em',
            }}
          >
            View →
          </button>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss alert"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              width: 26,
              height: 26,
              borderRadius: 6,
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s',
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Countdown progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 3,
          width: `${progress}%`,
          background: 'linear-gradient(90deg, rgba(255,255,255,0.25), rgba(255,255,255,0.8))',
          transition: 'width 0.03s linear',
        }}
      />

      {/* Enhanced Smooth Sweeping Reflection */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '35%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), rgba(255,255,255,0.08), transparent)',
            animation: 'cab-sweep 4s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite',
            willChange: 'transform',
          }}
        />
      </div>

      <style>{`
        @keyframes cab-sweep {
          0%   { transform: translateX(-120%); }
          100% { transform: translateX(280%); }
        }

        @keyframes cab-glow {
          0%   { filter: drop-shadow(0 0 4px rgba(255, 0, 0, 0.6)); }
          100% { filter: drop-shadow(0 0 12px rgba(255, 70, 70, 0.95)); }
        }
      `}</style>
    </div>
  );
};

export default CriticalAlertBanner;