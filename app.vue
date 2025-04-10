<script setup lang="ts">
import { useUserStore } from './stores/auth';
useHead({
  htmlAttrs: {
    'data-theme': 'light', // Setzt das Light-Theme für DaisyUI
  },
});

const userStore = useUserStore();
const isLoading = ref(true);
onMounted(async () => {
  try {
    // Benutzer-Authentifizierungsstatus überprüfen
    await userStore.checkAuthStatus();

    if (userStore.isLoggedIn) {
      userStore.startInterval();
    }
  } catch (error) {
    console.error('Error checking initial auth status:', error);
    await navigateTo('/auth');
  } finally {
    isLoading.value = false;
  }
});

onBeforeUnmount(() => {
  userStore.stopInterval();
});
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <div v-if="isLoading" class=" w-full h-screen flex items-center justify-center bg-primary"> </div>
    <div v-else>
      <!-- Navbar nur anzeigen, wenn wir NICHT im Admin-Bereich sind -->
      <navbar></navbar>
      <NuxtPage class="pt-[8rem]" />
    </div>
  </NuxtLayout>
</template>

<style>
@import url('/assess/css/main.css');
</style>