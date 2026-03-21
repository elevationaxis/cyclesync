interface CyncLogoProps {
  className?: string;
  size?: number;
}

export function CyncLogoMark({ className = "", size = 32 }: CyncLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 130"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
      aria-label="Cync logo"
    >
      {/* Center flame — tall pointed shape */}
      <path d="M60 8 C57 16 52 24 52 34 C52 42 55 47 60 48 C65 47 68 42 68 34 C68 24 63 16 60 8Z" />
      {/* Inner flame teardrop */}
      <path d="M60 20 C58 26 57 32 58 38 C59 43 61 43 62 38 C63 32 62 26 60 20Z" />

      {/* Left petal — curves out left then loops back to a teardrop point */}
      <path d="M52 36 C46 36 36 40 30 48 C25 55 28 65 37 66 C44 67 51 59 52 50 C53 45 53 40 52 36Z" />
      {/* Left inner teardrop */}
      <path d="M37 55 C35 59 36 64 39 64 C42 64 43 59 41 56" />

      {/* Right petal — mirrors left */}
      <path d="M68 36 C74 36 84 40 90 48 C95 55 92 65 83 66 C76 67 69 59 68 50 C67 45 67 40 68 36Z" />
      {/* Right inner teardrop */}
      <path d="M83 55 C85 59 84 64 81 64 C78 64 77 59 79 56" />

      {/* Gathering stem */}
      <path d="M52 50 C54 56 57 61 60 63 C63 61 66 56 68 50" />
      <path d="M60 63 L60 73" />

      {/* Roots — organic, fanning wide like reference */}
      {/* Far left root */}
      <path d="M57 68 C50 72 40 77 24 88" />
      {/* Left root */}
      <path d="M58 70 C53 76 46 82 36 96" />
      {/* Left-center root */}
      <path d="M59 72 C57 79 55 87 53 102" />
      {/* Center root */}
      <path d="M60 73 C60 81 60 90 60 104" />
      {/* Right-center root */}
      <path d="M61 72 C63 79 65 87 67 102" />
      {/* Right root */}
      <path d="M62 70 C67 76 74 82 84 96" />
      {/* Far right root */}
      <path d="M63 68 C70 72 80 77 96 88" />
    </svg>
  );
}
