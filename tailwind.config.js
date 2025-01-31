/** @type {import('tailwindcss').Config} */
export default {
  build: {
    target: "esnext", // Ensure modern module support
  },
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    apply: true,
  },
  server: {
    mimeTypes: {
      js: "text/javascript",
    },
  },
};
