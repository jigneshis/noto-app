import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
      typography: ({ theme }: { theme: any }) => ({ // Added typography plugin for react-markdown
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.foreground / 1'),
            '--tw-prose-headings': theme('colors.primary / 1'),
            '--tw-prose-lead': theme('colors.foreground / 1'),
            '--tw-prose-links': theme('colors.accent / 1'),
            '--tw-prose-bold': theme('colors.foreground / 1'),
            '--tw-prose-counters': theme('colors.muted-foreground / 1'),
            '--tw-prose-bullets': theme('colors.muted-foreground / 1'),
            '--tw-prose-hr': theme('colors.border / 1'),
            '--tw-prose-quotes': theme('colors.primary / 1'),
            '--tw-prose-quote-borders': theme('colors.border / 1'),
            '--tw-prose-captions': theme('colors.muted-foreground / 1'),
            '--tw-prose-code': theme('colors.accent / 1'),
            '--tw-prose-pre-code': theme('colors.accent-foreground / 1'),
            '--tw-prose-pre-bg': theme('colors.accent / 0.1'),
            '--tw-prose-th-borders': theme('colors.border / 1'),
            '--tw-prose-td-borders': theme('colors.border / 1'),
            '--tw-prose-invert-body': theme('colors.foreground / 1'),
            '--tw-prose-invert-headings': theme('colors.primary / 1'),
            '--tw-prose-invert-lead': theme('colors.foreground / 1'),
            '--tw-prose-invert-links': theme('colors.accent / 1'),
            '--tw-prose-invert-bold': theme('colors.foreground / 1'),
            '--tw-prose-invert-counters': theme('colors.muted-foreground / 1'),
            '--tw-prose-invert-bullets': theme('colors.muted-foreground / 1'),
            '--tw-prose-invert-hr': theme('colors.border / 1'),
            '--tw-prose-invert-quotes': theme('colors.primary / 1'),
            '--tw-prose-invert-quote-borders': theme('colors.border / 1'),
            '--tw-prose-invert-captions': theme('colors.muted-foreground / 1'),
            '--tw-prose-invert-code': theme('colors.accent-foreground / 1'), // Inverted code color
            '--tw-prose-invert-pre-code': theme('colors.background / 1'),     // Inverted pre code color
            '--tw-prose-invert-pre-bg': theme('colors.foreground / 0.15'),   // Inverted pre bg
            '--tw-prose-invert-th-borders': theme('colors.border / 1'),
            '--tw-prose-invert-td-borders': theme('colors.border / 1'),
            // Basic styling for lists, blockquotes, etc.
            ul: { paddingLeft: '1.5em' },
            ol: { paddingLeft: '1.5em' },
            blockquote: { 
              borderLeftWidth: '0.25rem',
              paddingLeft: '1em',
              fontStyle: 'italic',
            },
            code: {
              backgroundColor: 'var(--tw-prose-pre-bg)',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontWeight: '500',
            },
            'code::before': { content: '"" !important' }, // Remove default quotes around inline code
            'code::after': { content: '"" !important' },
            pre: {
              backgroundColor: 'var(--tw-prose-pre-bg)',
              padding: theme('spacing.4'),
              borderRadius: theme('borderRadius.md'),
              overflowX: 'auto',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
              borderRadius: '0',
              fontWeight: 'normal',
            },
          },
        },
        sm: { // Smaller prose for smaller contexts if needed
          css: {
            fontSize: theme('fontSize.sm'),
            p: { 
              marginTop: theme('spacing[3]'),
              marginBottom: theme('spacing[3]'),
            },
            '[class~="lead"]': {
              fontSize: theme('fontSize.base'),
            },
            // Adjust other elements for 'sm' if needed
          }
        }
      }),
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/typography'), // Added typography plugin
  ],
} satisfies Config;
