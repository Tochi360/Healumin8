/**
 * Overrides accent (primary) color to Healumin8 brand #0069FF.
 * Renders after BaseHubThemeProvider so it takes precedence.
 */
export function Healumin8AccentOverride() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
:root {
  --accent-50: #e6f0ff;
  --accent-rgb-50: 230, 240, 255;
  --accent-100: #cce0ff;
  --accent-rgb-100: 204, 224, 255;
  --accent-200: #99c2ff;
  --accent-rgb-200: 153, 194, 255;
  --accent-300: #66a3ff;
  --accent-rgb-300: 102, 163, 255;
  --accent-400: #3385ff;
  --accent-rgb-400: 51, 133, 255;
  --accent-500: #0069ff;
  --accent-rgb-500: 0, 105, 255;
  --accent-600: #0052cc;
  --accent-rgb-600: 0, 82, 204;
  --accent-700: #003d99;
  --accent-rgb-700: 0, 61, 153;
  --accent-800: #002966;
  --accent-rgb-800: 0, 41, 102;
  --accent-900: #001433;
  --accent-rgb-900: 0, 20, 51;
  --accent-950: #000a1a;
  --accent-rgb-950: 0, 10, 26;
  --text-on-accent: #ffffff;
}
` }} />
  );
}
