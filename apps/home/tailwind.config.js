import nucleusPreset from "@isaac545454/nucleus/tailwind-preset";

/** @type {import("tailwindcss").Config} */
const config = {
  presets: [nucleusPreset],
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/shell/src/**/*.{ts,tsx}",
    "./node_modules/@isaac545454/nucleus/dist/**/*.js",
  ],
  corePlugins: {
    preflight: false,
  },
};

export default config;
