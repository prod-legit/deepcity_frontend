// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    future: {
        compatibilityVersion: 4,
    },
    runtimeConfig: {
        cesiumAccessToken: process.env.CESIUM_ACCESS_TOKEN,
    },
});
