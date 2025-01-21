import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
    site: 'https://bridge.zdk.tsukuba.ac.jp',
    build: {
        format: 'preserve'
    },
    integrations: [sitemap({
        filter: (page) => !page.includes('/search/'),
    })]
});
