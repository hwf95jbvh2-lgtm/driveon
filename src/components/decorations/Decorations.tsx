export function Dots({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      aria-hidden="true"
    >
      <g fill="currentColor">
        <circle cx="6" cy="6" r="2.5" />
        <circle cx="22" cy="6" r="2.5" />
        <circle cx="38" cy="6" r="2.5" />
        <circle cx="6" cy="22" r="2.5" />
        <circle cx="22" cy="22" r="2.5" />
        <circle cx="38" cy="22" r="2.5" />
        <circle cx="6" cy="38" r="2.5" />
        <circle cx="22" cy="38" r="2.5" />
        <circle cx="38" cy="38" r="2.5" />
      </g>
    </svg>
  );
}

export function Rings({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="60" cy="60" r="56" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <circle cx="60" cy="60" r="38" stroke="currentColor" strokeWidth="2" opacity="0.45" />
      <circle cx="60" cy="60" r="20" stroke="currentColor" strokeWidth="2" opacity="0.7" />
      <circle cx="60" cy="60" r="6" fill="currentColor" />
    </svg>
  );
}

export function Squiggle({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="80"
      height="40"
      viewBox="0 0 80 40"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 30 Q 14 4, 26 22 T 50 18 T 78 24"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function ArcShape({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="160"
      height="160"
      viewBox="0 0 160 160"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M150 10 A 140 140 0 0 0 10 150"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="6 10"
      />
    </svg>
  );
}
