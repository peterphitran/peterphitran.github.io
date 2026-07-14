import { defineConfig } from "astro/config";
import icon from "astro-icon";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://Peter-Phi-Tran.github.io",
  base: "/",
  markdown: {
    shikiConfig: { theme: "github-light" },
  },
  integrations: [icon()],

  vite: {
    plugins: [tailwindcss()],
  },
});