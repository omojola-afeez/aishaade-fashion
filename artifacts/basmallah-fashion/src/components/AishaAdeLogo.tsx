interface LogoProps {
  size?: number;
  variant?: "full" | "mark";
  light?: boolean;
}

export function AishaAdeLogo({ size = 42, variant = "full", light = false }: LogoProps) {
  const textColor = light ? "#fff" : "hsl(163 60% 17%)";
  const subTextColor = light ? "rgba(255,255,255,0.6)" : "hsl(30 15% 48%)";

  return (
    <div className="flex items-center gap-3">
      {/* Logo Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Outer rounded square background */}
        <rect width="100" height="100" rx="22" fill="hsl(163 60% 17%)" />

        {/* Decorative geometric star/diamond pattern */}
        <g opacity="0.25">
          <path d="M50 10 L55 45 L90 50 L55 55 L50 90 L45 55 L10 50 L45 45 Z" fill="#c9922a" />
        </g>

        {/* Inner circle ring */}
        <circle cx="50" cy="50" r="28" stroke="#c9922a" strokeWidth="1.5" fill="none" opacity="0.6" />

        {/* "AA" Stylized Letters */}
        {/* First A */}
        <path
          d="M28 68 L38 32 L44 32 L50 52"
          stroke="#c9922a"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M30.5 57 L47 57"
          stroke="#c9922a"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Second A */}
        <path
          d="M50 52 L56 32 L62 32 L72 68"
          stroke="#c9922a"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M53 57 L69.5 57"
          stroke="#c9922a"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Crescent accent at top */}
        <path
          d="M46 20 A8 8 0 1 1 54 20 A5 5 0 1 0 46 20"
          fill="#c9922a"
          opacity="0.7"
        />
      </svg>

      {variant === "full" && (
        <div style={{ lineHeight: 1.1 }}>
          <div
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: size * 0.48,
              fontWeight: 700,
              color: textColor,
              letterSpacing: "0.02em",
              lineHeight: 1,
            }}
          >
            AishaADe
          </div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: size * 0.18,
              fontWeight: 500,
              color: subTextColor,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginTop: 2,
            }}
          >
            Fashion & Gadgets Hub
          </div>
        </div>
      )}
    </div>
  );
}
