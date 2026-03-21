interface CyncLogoProps {
  className?: string;
  size?: number;
  color?: string; // optional tint color (not used for image, kept for API compatibility)
}

export function CyncLogoMark({ className = "", size = 32 }: CyncLogoProps) {
  return (
    <img
      src="/logo-mark.png"
      alt="Cync logo"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}
