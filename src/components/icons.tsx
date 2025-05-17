
import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 84 97" // Width 84, Height 97
      fill="none"
      aria-labelledby="notoLogoTitle notoLogoDesc"
      role="img"
      {...props}
    >
      <title id="notoLogoTitle">NOTO Logo</title>
      <desc id="notoLogoDesc">The logo consists of a light blue rounded square with a dark 'N' inside, a yellow lightbulb at the top-right, and the word 'Noto' underneath.</desc>
      {/* Main square */}
      <rect x="7" y="1.5" width="64" height="64" rx="10" fill="#DCEEFB" />
      {/* Letter N */}
      <text
        x="39"
        y="47" // Adjusted for better vertical centering
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="40"
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#231F20"
      >
        N
      </text>
      {/* Lightbulb group - positioned relative to SVG top-left */}
      <g transform="translate(48 -2)"> {/* Overall adjustment for lightbulb position */}
        {/* Rays */}
        <line x1="16.5" y1="3.5" x2="16.5" y2="0" stroke="#FCE081" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="23.0941" y1="6.90588" x2="25.5689" y2="4.43111" stroke="#FCE081" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="9.90588" y1="6.90588" x2="7.43111" y2="4.43111" stroke="#FCE081" strokeWidth="2.5" strokeLinecap="round" />
        {/* Bulb */}
        <circle cx="16.5" cy="14.5" r="6.5" fill="#FCE081" />
        {/* Filament */}
        <g stroke="#F2A80F" strokeWidth="1.2" strokeLinecap="round">
          <line x1="14.5" y1="12.5" x2="18.5" y2="16.5" />
          <line x1="18.5" y1="12.5" x2="14.5" y2="16.5" />
        </g>
        {/* Base of lightbulb */}
        <rect x="13" y="20" width="7" height="3" rx="1" fill="#E0E0E0" /> {/* Slightly rounded base */}
      </g>
      {/* Text "Noto" */}
      <text
        x="40"
        y="86" 
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="22"
        fontWeight="bold"
        textAnchor="middle"
        fill="#231F20"
      >
        Noto
      </text>
    </svg>
  );
}

export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 48 48" 
      width="24px" 
      height="24px"
      {...props}
    >
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l0.002-0.001l6.19,5.238C39.904,36.304,44,30.608,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
  )
}
