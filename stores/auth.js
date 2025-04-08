// stores/user.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { navigateTo } from '#app';

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    username: null,
    intervalId: null,
    email: '',
    courses: [], // User's purchased courses
    isAdmin: false
  }),
  actions: {
    async checkAuthStatus() {
      try {
        const response = await axios.get('/api/auth/session');
        if (response.data.valid) {
          this.isLoggedIn = true;
          this.username = response.data.username;
          this.courses = response.data.courses || []; // Update courses list
          this.isAdmin = response.data.isAdmin;
          this.email = response.data.email;
        } else {
          this.logout();
        }
      } catch (error) {
        this.logout();
      }
    },
    login(userData) {
      this.isLoggedIn = true;
      this.username = userData.username;
      this.courses = userData.courses || []; // Set purchased courses
      this.isAdmin = userData.isAdmin;
      this.email = userData.email;

      this.startInterval();
    },
    async logout() {
      try {
        await axios.post('/api/auth/logout');
      } catch (error) {
        console.error('logout error', error);
      }
      this.isLoggedIn = false;
      this.username = null;
      this.courses = []; // Clear purchased courses
      this.stopInterval();
      await navigateTo('/');
    },
    startInterval() {
      this.intervalId = setInterval(async () => {
        try {
          await this.checkAuthStatus();
          if (!this.isLoggedIn) {
            this.stopInterval();
            await navigateTo('/');
          }
        } catch (error) {
          console.error('Error checking auth status:', error);
          this.stopInterval();
          await navigateTo('/auth');
        }
      }, 3 * 60 * 4000); // 3 Minuten
    },
    stopInterval() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },
  },
});