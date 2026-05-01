import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
            },
            colors: {
                brand: {
                    50: '#FAF7F5',
                    100: '#F0EBE6',
                    200: '#E0D6D1',
                    300: '#C9B9B1',
                    400: '#3E2F2B',
                    500: '#3E2F2B',
                    600: '#332520',
                    700: '#2F2421',
                    800: '#251D19',
                    900: '#1E1714',
                },
                clay: '#C47A5A',
            },
        },
    },
    plugins: [],
}
export default config
