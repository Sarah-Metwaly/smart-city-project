const WarningIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    style={{
      filter: 'drop-shadow(0 0 6px rgba(255, 0, 0, 0.85))',
      animation: 'cab-glow 2s ease-in-out infinite alternate',
    }}
  >
    <path
      d="M12 2L1 21h22L12 2z"
      fill="#ff6b6b"
      stroke="#ff6b6b"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M12 9v5"
      stroke="#4a0000"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle
      cx="12"
      cy="17"
      r="1.25"
      fill="#4a0000"
    />
  </svg>
);

export default WarningIcon;