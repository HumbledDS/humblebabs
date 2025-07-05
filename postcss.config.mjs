const isTurbopack = process.env.TURBOPACK === '1' || process.env.NEXT_RUNTIME === 'edge';
const config = {
  plugins: isTurbopack
    ? { '@tailwindcss/postcss': {} }
    : { tailwindcss: {}, autoprefixer: {} },
};

export default config;
