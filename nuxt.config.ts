// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },

    future: {
        compatibilityVersion: 4,
    },

    runtimeConfig: {
        public: {
            base_url: process.env.API_BASE_URL,
            cesium_token: process.env.CESIUM_ACCESS_TOKEN,
        },
    },
    modules: ["@nuxt/ui", "nuxt-monaco-editor"],
});
