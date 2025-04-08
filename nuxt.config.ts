// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxt/icon'],
  runtimeConfig: {
    adminPassword: process.env.ADMIN_PASSWORD,
    firebaseAdmin: process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID,
    bunnyApiKey: process.env.BUNNY_API_KEY,
    bunnyLibraryId: process.env.BUNNY_LIBRARY_ID
  },
  devServer: {
    port: 3000,
    host: '0.0.0.0',
  }
})