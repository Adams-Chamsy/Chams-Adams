import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx,mdx}',
    './lib/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: {
        '2xl': '1440px',
      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    extend: {
      colors: {
        // Palette Chams Adams (voir docs/GUIDE-DESIGN.md)
        noir: {
          DEFAULT: '#0A0A0A',
          50: '#F5F5F5',
          100: '#E0E0E0',
          200: '#BDBDBD',
          300: '#9E9E9E',
          400: '#757575',
          500: '#424242',
          600: '#2C2C2C',
          700: '#1C1C1C',
          800: '#121212',
          900: '#0A0A0A',
        },
        or: {
          DEFAULT: '#C9A961',
          50: '#FAF6EC',
          100: '#F2E9CE',
          200: '#E6D39E',
          300: '#DABE6E',
          400: '#C9A961',
          500: '#B48F43',
          600: '#906F32',
          700: '#6C5326',
          800: '#483719',
          900: '#241B0D',
        },
        ivoire: {
          DEFAULT: '#F5F0E6',
          50: '#FDFBF6',
          100: '#FAF6EB',
          200: '#F5F0E6',
          300: '#E8DFC9',
          400: '#D9CDA8',
          500: '#C5B683',
        },
        indigo: {
          DEFAULT: '#1B2951',
          50: '#E8ECF6',
          100: '#C5CEE4',
          200: '#8A9DC9',
          300: '#4F6BAE',
          400: '#2E4486',
          500: '#1B2951',
          600: '#152041',
          700: '#101830',
          800: '#0A1020',
          900: '#050810',
        },
        terre: {
          DEFAULT: '#8B4513',
          50: '#F5E8DC',
          100: '#E8C9AD',
          200: '#D49A6A',
          300: '#B86A2E',
          400: '#8B4513',
          500: '#70370F',
          600: '#542A0B',
          700: '#381C07',
          800: '#1C0E04',
        },
        bronze: {
          DEFAULT: '#4A3728',
          50: '#E8E0D8',
          100: '#C9B9A6',
          200: '#A28B71',
          300: '#7B6352',
          400: '#4A3728',
          500: '#3A2B1F',
          600: '#2B2017',
          700: '#1C150F',
          800: '#0D0A08',
        },

        // shadcn/ui — HSL via CSS variables (base color: neutral)
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // Tokens Chams Adams custom (voir subtle utilisé en opacité)
        subtle: 'rgba(245, 240, 230, 0.4)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        script: ['var(--font-italianno)', 'Italianno', 'cursive'],
      },
      fontSize: {
        // Typographie éditoriale — voir docs/GUIDE-DESIGN.md
        'display-xl': ['clamp(3rem, 6vw, 7.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.5rem, 5vw, 5rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-sm': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.2' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7', letterSpacing: '0.01em' }],
        caption: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.05em' }],
        eyebrow: ['0.75rem', { lineHeight: '1', letterSpacing: '0.2em' }],
      },
      letterSpacing: {
        widest: '0.25em',
        luxe: '0.2em',
      },
      spacing: {
        section: 'clamp(5rem, 10vw, 12.5rem)',
        'section-sm': 'clamp(3rem, 6vw, 7.5rem)',
      },
      maxWidth: {
        content: '1440px',
        wide: '1920px',
        prose: '65ch',
      },
      transitionTimingFunction: {
        // Courbes signées (voir docs/GUIDE-DESIGN.md)
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'in-out-cubic': 'cubic-bezier(0.65, 0, 0.35, 1)',
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
        luxe: 'cubic-bezier(0.77, 0, 0.175, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '900': '900ms',
        '1200': '1200ms',
      },
      boxShadow: {
        'halo-or': '0 0 40px rgba(201, 169, 97, 0.2)',
        'halo-or-strong': '0 0 60px rgba(201, 169, 97, 0.35)',
        editorial: '0 20px 60px -20px rgba(0, 0, 0, 0.8)',
      },
      backgroundImage: {
        'gradient-noir': 'linear-gradient(180deg, #0A0A0A 0%, #1C1C1C 100%)',
        'gradient-or': 'linear-gradient(135deg, #C9A961 0%, #B48F43 100%)',
        'grain-noir': 'radial-gradient(ellipse at top, rgba(28,28,28,0.8), #0A0A0A)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 900ms cubic-bezier(0.19, 1, 0.22, 1) both',
        'fade-in': 'fade-in 600ms ease-out both',
        shimmer: 'shimmer 2.4s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
