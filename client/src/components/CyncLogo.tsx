interface CyncLogoProps {
  className?: string;
  size?: number;
}

export function CyncLogoMark({ className = "", size = 32 }: CyncLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
      aria-label="Cync logo"
    >
      {/* Flame / lotus top */}
      <path d="M50 8 C50 8 36 22 36 35 C36 44 42 50 50 50 C58 50 64 44 64 35 C64 22 50 8 50 8Z" />
      {/* Left petal */}
      <path d="M50 50 C50 50 32 37 25 48 C20 56 27 66 37 63 C44 61 50 50 50 50Z" />
      {/* Right petal */}
      <path d="M50 50 C50 50 68 37 75 48 C80 56 73 66 63 63 C56 61 50 50 50 50Z" />
      {/* Inner flame left */}
      <path d="M50 18 C46 26 44 33 46 40" />
      {/* Inner flame right */}
      <path d="M50 18 C54 26 56 33 54 40" />
      {/* Root stem */}
      <path d="M50 63 L50 78" />
      {/* Roots spreading out */}
      <path d="M50 70 C46 73 40 76 34 84" />
      <path d="M50 70 C54 73 60 76 66 84" />
      <path d="M50 75 C47 79 43 83 39 93" />
      <path d="M50 75 C53 79 57 83 61 93" />
      <path d="M50 78 C48 83 47 88 46 98" />
      <path d="M50 78 C52 83 53 88 54 98" />
    </svg>
  );
}
