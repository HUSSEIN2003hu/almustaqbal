<template>
  <div class="flex justify-center h-0">
    <div class="navbar shadow-sm fixed z-50 container top-4 rounded-xl transition-colors duration-300 bg-tertiary "
      style="color: azure; border-width: 8px;  border-color: transparent;    border-radius: 1.2rem !important /* 12px */;">

      <!-- Left Section -->
      <div class="navbar-start">
        <button @click="isMenuOpen = !isMenuOpen" class="btn btn-ghost lg:hidden text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </button>
        <NuxtLink to="/" class="">
          <img src="/assess/img/logo.svg" alt="logo" load="lazy">
        </NuxtLink>
      </div>

      <!-- Mobile Menu -->
      <div :class="['lg:hidden fixed inset-0 transform', isMenuOpen ? 'translate-x-0' : 'translate-x-full']"
        class="transition-transform duration-300 ease-in-out z-40">
        <div class="bg-tertiary h-full w-64 float-right p-4 mt-4 rounded-xl shadow-lg">
          <div class="flex justify-end">
            <button @click="isMenuOpen = false" class="btn btn-ghost text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <ul class="menu menu-vertical gap-2">
            <li>
              <NuxtLink @click="isMenuOpen = false"
                class="text-xl mb-4 hover:bg-red hover:text-white px-3 py-1 rounded transition-colors duration-200"
                to="/">الصفحة الرئيسية</NuxtLink>
            </li>
            <li>
              <NuxtLink @click="isMenuOpen = false"
                class="text-xl mb-4 hover:bg-red hover:text-white px-3 py-1 rounded transition-colors duration-200"
                to="/my-courses">الدورات التدريسية</NuxtLink>
            </li>
            <li>
              <NuxtLink @click="isMenuOpen = false"
                class="text-xl mb-4 hover:bg-red hover:text-white px-3 py-1 rounded transition-colors duration-200"
                to="/#teachers">الأساتذة</NuxtLink>
            </li>
            <li>
              <NuxtLink @click="isMenuOpen = false"
                class="text-xl mb-4 hover:bg-red hover:text-white px-3 py-1 rounded transition-colors duration-200"
                to="/#code">رمز التفعيل</NuxtLink>
            </li>
            <!-- Admin Links -->
            <template v-if="userStore.isAdmin">
              <li class="text-xl font-bold mt-4 mb-2">لوحة المسؤول</li>
              <li>
                <NuxtLink @click="isMenuOpen = false"
                  class="text-lg hover:bg-red hover:text-white px-3 py-1 rounded transition-colors duration-200"
                  to="/admin">لوحة التحكم</NuxtLink>
              </li>
              <li>
                <NuxtLink @click="isMenuOpen = false"
                  class="text-lg hover:bg-red hover:text-white px-3 py-1 rounded transition-colors duration-200"
                  to="/admin/users">إدارة طلاب</NuxtLink>
              </li>
              <li>
                <NuxtLink @click="isMenuOpen = false"
                  class="text-lg hover:bg-red hover:text-white px-3 py-1 rounded transition-colors duration-200"
                  to="/admin/courses">إدارة الدورات</NuxtLink>
              </li>
            </template>
          </ul>
        </div>
        <div class="bg-black bg-opacity-50 h-full flex-1" @click="isMenuOpen = false"></div>
      </div>

      <!-- Desktop Menu -->
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1 gap-4 text-white">
          <li>
            <NuxtLink to="/" class="hover:bg-red hover:text-white px-3 py-1 rounded transition-colors duration-200">
              الصفحة الرئيسية</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/my-courses"
              class="hover:bg-red hover:text-white px-3 py-1 rounded transition-colors duration-200">
              الدورات التدريسية</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/#teachers"
              class="hover:bg-red hover:text-white px-3 py-1 rounded transition-colors duration-200">
              الأساتذة</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/#code"
              class="hover:bg-red hover:text-white px-3 py-1 rounded transition-colors duration-200">
              رمز التدريسية</NuxtLink>
          </li>
          <!-- Admin Links -->
          <template v-if="userStore.isAdmin">
            <li>
              <NuxtLink to="/admin"
                class="hover:bg-red hover:text-white px-3 py-1 rounded transition-colors duration-200">
                لوحة التحكم</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/admin/users"
                class="hover:bg-red hover:text-white px-3 py-1 rounded transition-colors duration-200">
                إدارة طلاب</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/admin/courses"
                class="hover:bg-red hover:text-white px-3 py-1 rounded transition-colors duration-200">
                إدارة الدورات</NuxtLink>
            </li>
          </template>
        </ul>
      </div>

      <!-- Right Section -->
      <div class="navbar-end rounded-xl gap-4">
        <div v-if="userStore.isLoggedIn" class="flex items-center gap-4 ">
          <transition name="fade">
            <span v-if="showWelcomeMessage" class="animate-fade-in">
              مرحبًا, {{ userStore.username.slice(0, 10) }}{{ userStore.username.length > 10 ? '...' : '' }}
            </span>
          </transition>
          <button @click="logout" class="btn btn-error hover:bg-red-700 text-white">
            <span class="hidden xl:block">تسجيل الخروج</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:ml-2" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M16 9v-4l8 7-8 7v-4h-8v-6h8zm-2 10v-.083c-1.178.685-2.542 1.083-4 1.083-4.411 0-8-3.589-8-8s3.589-8 8-8c1.458 0 2.822.398 4 1.083v-2.245c-1.226-.536-2.577-.838-4-.838-5.522 0-10 4.477-10 10s4.478 10 10 10c1.423 0 2.774-.302 4-.838v-2.162z" />
            </svg>
          </button>
        </div>
        <NuxtLink v-else to="/auth" class="btn btn-success text-white hover:bg-green-600">
          <span class="hidden md:inline">تسجيل الدخول</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:ml-2" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10-10-4.477-10-10 4.477-10 10-10zm0 18c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm-2-12h4v-2h-4v2zm0 4h4v-2h-4v2zm0 4h4v-2h-4v2z" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '~/stores/auth';
import { watch, ref, onMounted } from 'vue';

const userStore = useUserStore();
const showWelcomeMessage = ref(false);
const isMenuOpen = ref(false);

onMounted(() => {
  if (userStore.isLoggedIn) {
    setTimeout(() => {
      showWelcomeMessage.value = true;
    }, 10000); // 10 seconds
  }
});

const logout = () => {
  userStore.logout();
};

watch(() => userStore.isLoggedIn, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      showWelcomeMessage.value = true;
    }, 10000);
  } else {
    showWelcomeMessage.value = false;
  }
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>