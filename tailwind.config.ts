import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'col-span-1', 'col-span-2', 'col-span-3',
    'lg:col-span-1', 'lg:col-span-2', 'lg:col-span-3',
    'md:col-span-1', 'md:col-span-2', 'md:col-span-3',
    'sm:col-span-1', 'sm:col-span-2', 'sm:col-span-3',
	'text-xs', 'text-2xs',
  ],
  theme: {
    extend: {
  		colors: {
			'dark-tangerine': '#ff9f1c',
			'sea-buckthorn': '#ffbf69',
			'white': '#ffffff',
			'turquoise': '#cbf3f0',
			'mint': '#2ec4b6',
			'gun-metal': '#284b63',
			'raisin-black': '#353535',
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
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			sans: ['var(--font-quicksand)', 'Arial', 'Helvetica', 'sans-serif'],
  			logo: ['"hvd-comic-serif-pro"', 'serif'],
  		},
		fontSize: {
			xs: '0.625rem',
		},
		keyframes: {
			bounce: {
				'0%, 100%': { transform: 'translateY(-50%)', opacity: '0.2' },
				'65%': { opacity: '0.9' },
				'50%': { transform: 'translateY(0)', opacity: '1' }
			}
		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
