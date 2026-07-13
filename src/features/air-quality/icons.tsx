export function MQ135Icon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="2" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function PressureIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
      <path d="M12 7v5l3 3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function AltitudeIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L4 20h16L12 2z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 8v5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function HumidityIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2v6M12 13a4 4 0 100 8 4 4 0 000-8z" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}