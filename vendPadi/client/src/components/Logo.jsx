const Logo = ({ variant = 'full', size = 'md', className = '' }) => {
  const sizes = {
    sm: { width: 80, height: 32 },
    md: { width: 120, height: 48 },
    lg: { width: 160, height: 64 },
    xl: { width: 200, height: 80 },
  };

  const { width, height } = sizes[size] || sizes.md;

  if (variant === 'icon') {
    return (
      <svg
        width={height}
        height={height}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#25C866"/>
            <stop offset="100%" stopColor="#128C7E"/>
          </linearGradient>
          <linearGradient id="darkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1A1A2E"/>
            <stop offset="100%" stopColor="#16213E"/>
          </linearGradient>
        </defs>
        <rect width="80" height="80" rx="20" fill="url(#darkGrad)"/>
        <rect x="12" y="28" width="56" height="44" rx="10" fill="url(#iconGrad)"/>
        <path d="M24 28 L24 16 Q40 -4 56 16 L56 28" stroke="url(#iconGrad)" strokeWidth="6" strokeLinecap="round" fill="none"/>
        <path d="M22 42 L40 66 L58 42" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <circle cx="58" cy="32" r="6" fill="url(#iconGrad)"/>
        <circle cx="66" cy="24" r="4" fill="url(#iconGrad)" opacity="0.7"/>
        <circle cx="72" cy="18" r="3" fill="url(#iconGrad)" opacity="0.5"/>
      </svg>
    );
  }

  if (variant === 'icon-light') {
    return (
      <svg
        width={height}
        height={height}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id="iconGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#25C866"/>
            <stop offset="100%" stopColor="#128C7E"/>
          </linearGradient>
        </defs>
        <rect width="80" height="80" rx="20" fill="url(#iconGradLight)"/>
        <rect x="12" y="28" width="56" height="44" rx="10" fill="white"/>
        <path d="M24 28 L24 16 Q40 -4 56 16 L56 28" stroke="url(#iconGradLight)" strokeWidth="6" strokeLinecap="round" fill="none"/>
        <path d="M22 42 L40 66 L58 42" stroke="url(#iconGradLight)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <circle cx="58" cy="32" r="6" fill="url(#iconGradLight)"/>
        <circle cx="66" cy="24" r="4" fill="url(#iconGradLight)" opacity="0.7"/>
        <circle cx="72" cy="18" r="3" fill="url(#iconGradLight)" opacity="0.5"/>
      </svg>
    );
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 160 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#25C866"/>
          <stop offset="100%" stopColor="#10B981"/>
        </linearGradient>
        <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#25C866" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      {/* Icon */}
      <g filter="url(#logoShadow)">
        <rect x="2" y="6" width="36" height="32" rx="6" fill="url(#logoGrad)"/>
        <path d="M10 6 L10 2 Q18 -8 26 2 L26 6" stroke="url(#logoGrad)" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M9 14 L20 28 L31 14" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <circle cx="30" cy="12" r="3" fill="url(#logoGrad)"/>
        <circle cx="35" cy="8" r="2" fill="url(#logoGrad)" opacity="0.7"/>
      </g>
      
      {/* Text */}
      <text x="48" y="32" fontFamily="Sora, Inter, system-ui, sans-serif" fontSize="24" fontWeight="700" fill="#1A1A2E" letterSpacing="-0.5">
        Vend
      </text>
      <text x="106" y="32" fontFamily="Sora, Inter, system-ui, sans-serif" fontSize="24" fontWeight="700" fill="url(#logoGrad)" letterSpacing="-0.5">
        Padi
      </text>
    </svg>
  );
};

export default Logo;
