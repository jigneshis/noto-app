
import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  // Path for the "N" part, slightly stylized
  const nPath = "M10 20V6H6V4h10v2h-4v14h4v2H6v-2h4z"; 
  // Adjusted lightbulb to be simpler and more iconic within the N's negative space
  const lightbulbPath = "M12 10a2 2 0 100-4 2 2 0 000 4zm0-5a3 3 0 110 6 3 3 0 010-6zm-1 6h2v2h-2v-2zm0 3h2v1h-2v-1z";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 32" // Adjusted viewBox for a wider logo to accommodate "NOTO" text
      fill="currentColor" // Main fill color
      aria-labelledby="notoFullLogoTitle"
      role="img"
      {...props}
    >
      <title id="notoFullLogoTitle">NOTO Logo</title>
      
      {/* N Mark (Stylized) */}
      <g transform="translate(0, 4)"> {/* Shift N and lightbulb down slightly to center in the blue square */}
        <path d="M17 3H7v12h10V3zM7 21V11" fill="hsl(var(--primary-foreground))" />
        <path d="m7 11 10 10" fill="hsl(var(--primary-foreground))" />

        {/* Small decorative circle, simulating a part of the lightbulb idea */}
         <circle cx="12" cy="8" r="1.5" fill="hsl(var(--accent))"/> 
      </g>

      {/* Text "NOTO" next to the mark */}
      <text 
        x="26" // Position text to the right of the N mark
        y="20" // Vertically align text with the mark
        fontFamily="var(--font-geist-sans), Arial, sans-serif"
        fontSize="16" 
        fontWeight="bold"
        fill="hsl(var(--foreground))" // Use theme's foreground color
      >
        NOTO
      </text>
    </svg>
  );
}

// GoogleIcon removed as it was only used in the login page which is being removed.
// export function GoogleIcon(props: SVGProps<SVGSVGElement>) { ... }
