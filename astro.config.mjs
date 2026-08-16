import { defineConfig } from "astro/config";
import icon from "astro-icon";

export default defineConfig({
  site: "https://Peter-Phi-Tran.github.io",
  base: "/",
  markdown: {
    shikiConfig: { theme: "github-dark" },
  },
  integrations: [icon()],
});
