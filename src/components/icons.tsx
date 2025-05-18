
import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 32" // Adjusted for "|| NOTO"
      fill="currentColor"
      aria-labelledby="notoLogoTitle"
      role="img"
      {...props}
    >
      <title id="notoLogoTitle">NOTO Logo</title>
      
      {/* Two vertical bars */}
      <rect x="5" y="8" width="3" height="16" /> {/* First bar */}
      <rect x="12" y="8" width="3" height="16" /> {/* Second bar */}
      
      {/* Text "NOTO" */}
      <text
        x="25" // Position text to the right of the bars
        y="22" // Adjusted for typical text baseline
        fontFamily="var(--font-geist-sans), system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
        fontSize="16" 
        fontWeight="bold"
      >
        NOTO
      </text>
    </svg>
  );
}

