// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxt/icon'],
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
      title: 'المستقبل | منصة تعليمية متميزة',
      meta: [
        // Essential Meta Tags
        { name: 'description', content: 'منصة المستقبل التعليمية - تعلم بأسلوب مميز مع أفضل المدرسين' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#3B82F6' },
        
        // Apple Mobile Web App Meta Tags
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'المستقبل' },
        
        // Microsoft Tiles
        { name: 'msapplication-TileColor', content: '#3B82F6' },
        { name: 'msapplication-config', content: '/browserconfig.xml' },
        
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'http://almustaqbal-iq.com' },
        { property: 'og:title', content: 'المستقبل | منصة تعليمية متميزة' },
        { property: 'og:description', content: 'منصة المستقبل التعليمية - تعلم بأسلوب مميز مع أفضل المدرسين' },
        { property: 'og:image', content: 'http://almustaqbal-iq.com/social-banner.jpg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:locale', content: 'ar_SA' },
        { property: 'og:site_name', content: 'المستقبل' },
        
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:url', content: 'http://almustaqbal-iq.com' },
        { name: 'twitter:title', content: 'المستقبل | منصة تعليمية متميزة' },
        { name: 'twitter:description', content: 'منصة المستقبل التعليمية - تعلم بأسلوب مميز مع أفضل المدرسين' },
        { name: 'twitter:image', content: 'http://almustaqbal-iq.com/social-banner.jpg' },
        
        // Additional SEO Tags
        { name: 'robots', content: 'index, follow' },
        { name: 'author', content: 'المستقبل' },
        { name: 'keywords', content: 'تعليم, دروس, كورسات, تعلم عن بعد, منصة تعليمية, المستقبل التعليمية' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#3B82F6' },
        { rel: 'canonical', href: 'https://almustaqbal.edu' }
      ],
      htmlAttrs: {
        lang: 'ar',
        dir: 'rtl'
      }
    }
  },
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