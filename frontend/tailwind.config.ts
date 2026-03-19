import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        headline: ["Manrope", "sans-serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
        label: ["Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--on-primary)",
          container: "var(--primary-container)",
          "on-container": "var(--on-primary-container)",
          dim: "var(--primary-dim)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--on-secondary)",
          container: "var(--secondary-container)",
          "on-container": "var(--on-secondary-container)",
          dim: "var(--secondary-dim)",
        },
        tertiary: {
          DEFAULT: "var(--tertiary)",
          foreground: "var(--on-tertiary)",
          container: "var(--tertiary-container)",
          "on-container": "var(--on-tertiary-container)",
        },
        error: {
          DEFAULT: "var(--error)",
          foreground: "var(--on-error)",
          container: "var(--error-container)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          dim: "var(--surface-dim)",
          bright: "var(--surface-bright)",
          variant: "var(--surface-variant)",
          tint: "var(--surface-tint)",
          "container-lowest": "var(--surface-container-lowest)",
          "container-low": "var(--surface-container-low)",
          container: "var(--surface-container)",
          "container-high": "var(--surface-container-high)",
          "container-highest": "var(--surface-container-highest)",
        },
        background: "var(--background)",
        foreground: "var(--on-surface)",
        "on-surface": "var(--on-surface)",
        "on-surface-variant": "var(--on-surface-variant)",
        "on-background": "var(--on-background)",
        outline: {
          DEFAULT: "var(--outline)",
          variant: "var(--outline-variant)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        inverse: {
          surface: "var(--inverse-surface)",
          "on-surface": "var(--inverse-on-surface)",
          primary: "var(--inverse-primary)",
        },
        card: {
          DEFAULT: "var(--surface-container-lowest)",
          foreground: "var(--on-surface)",
        },
        popover: {
          DEFAULT: "var(--surface-container-lowest)",
          foreground: "var(--on-surface)",
        },
        muted: {
          DEFAULT: "var(--surface-container-high)",
          foreground: "var(--on-surface-variant)",
        },
        accent: {
          DEFAULT: "var(--secondary-container)",
          foreground: "var(--on-secondary-container)",
        },
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.25rem",
        full: "9999px",
      },
      boxShadow: {
        editorial: "0 8px 32px 0 rgba(46, 51, 58, 0.05)",
        "editorial-hover": "0 24px 48px -12px rgba(0,0,0,0.06)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
