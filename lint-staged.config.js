/** @type { import("lint-staged").Config } */
const config = {
  "*.{tsx,ts,js}": ["bash -c 'px typecheck'", "px check", "px lint:legacy"],
  "*.json": ["px format"],
  "*.md": ["px format"],
};

export default config;
