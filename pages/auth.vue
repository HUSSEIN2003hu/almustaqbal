<template>
    <div class="min-h-screen flex items-center justify-center bg-primary p-4" dir="rtl">
        <div class="w-full max-w-screen-xl bg-base-100 shadow-xl rounded-3xl overflow-hidden mt-20">
            <div class="flex flex-col lg:flex-row flex-wrap-reverse h-full">
                <div class="lg:w-[30%] bg-secondary  md:h-[70vh]  p-8 flex flex-col justify-center items-center">
                    <h2 class="text-3xl font-bold mb-6 self-start"> {{ !login ? 'مرحبا بك' : 'أهلاً بعودتك!' }}</h2>
                    <div class="w-full max-w-md">
                        <!-- Global Error Message -->
                        <div v-if="errorMessage" class="mb-4 text-error text-center animate-fade-in break-words">
                            ⚠️ {{ errorMessage }}
                        </div>

                        <!-- Email Input -->
                        <div class="mb-4 relative">
                            <div class="relative">
                                <input type="email" placeholder="البريد الإلكتروني"
                                    class="input input-bordered w-full rounded-full pl-12 pr-4 transition-all duration-300 focus:ring-2 focus:ring-primary"
                                    v-model="email" :class="{ 'input-error': emailError }" required
                                    @focus="resetError('email')" aria-label="البريد الإلكتروني" autocomplete="email" />
                                <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                                    <svg class="w-5 h-5" viewBox="0 0 22 16" fill="currentColor">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M0.5 1.25L1.25 0.5H20.75L21.5 1.25V14.75L20.75 15.5H1.25L0.5 14.75V1.25ZM2 2.8025V14H20V2.804L11.465 9.35H10.55L2 2.8025ZM18.545 2H3.455L11 7.8035L18.545 2Z"
                                            fill="gray" />
                                    </svg>
                                </span>
                            </div>
                            <transition name="fade">
                                <label v-if="emailError" class="label text-error pt-1 animate-shake">
                                    ⚠️ {{ emailError }}
                                </label>
                            </transition>
                        </div>

                        <!-- Password Input -->
                        <div class="mb-4 relative">
                            <div class="relative">
                                <input :type="showPassword ? 'text' : 'password'" placeholder="كلمة المرور"
                                    class="input input-bordered w-full rounded-full pl-12 pr-12 transition-all duration-300 focus:ring-2 focus:ring-primary"
                                    v-model="password" :class="{ 'input-error': passwordError }" required
                                    @focus="resetError('password')" aria-label="كلمة المرور"
                                    autocomplete="new-password" />
                                <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                                    <svg class="w-5 h-5" viewBox="0 0 16 20" fill="currentColor">
                                        <path
                                            d="M16 10C16 8.897 15.103 8 14 8H13V5C13 2.243 10.757 0 8 0C5.243 0 3 2.243 3 5V8H2C0.897 8 0 8.897 0 10V18C0 19.103 0.897 20 2 20H14C15.103 20 16 19.103 16 18V10ZM5 5C5 3.346 6.346 2 8 2C9.654 2 11 3.346 11 5V8H5V5Z"
                                            fill="gray" />
                                    </svg>
                                </span>
                                <span class="absolute inset-y-0 right-0 flex items-center pl-4 text-gray-400">
                                    <button @click="showPassword = !showPassword"
                                        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary transition-colors"
                                        type="button" aria-label="تبديل رؤية كلمة المرور">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path v-if="showPassword" stroke-linecap="round" stroke-linejoin="round"
                                                stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>
                                </span>
                            </div>
                            <transition name="fade">
                                <label v-if="passwordError" class="label text-error pt-1 animate-shake">
                                    ⚠️ {{ passwordError }}
                                </label>
                            </transition>
                        </div>

                        <!-- Confirm Password -->
                        <div class="mb-4 relative" v-if="!login">
                            <div class="relative">
                                <input :type="showConfirmPassword ? 'text' : 'password'" placeholder="تأكيد كلمة المرور"
                                    class="input input-bordered w-full rounded-full pl-12 pr-12 transition-all duration-300 focus:ring-2 focus:ring-primary"
                                    v-model="confirmPassword" :class="{ 'input-error': confirmPasswordError }" required
                                    @focus="resetError('confirmPassword')" aria-label="تأكيد كلمة المرور"
                                    autocomplete="new-password" />
                                <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                                    <svg class="w-5 h-5" viewBox="0 0 16 20" fill="currentColor">
                                        <path
                                            d="M16 10C16 8.897 15.103 8 14 8H13V5C13 2.243 10.757 0 8 0C5.243 0 3 2.243 3 5V8H2C0.897 8 0 8.897 0 10V18C0 19.103 0.897 20 2 20H14C15.103 20 16 19.103 16 18V10ZM5 5C5 3.346 6.346 2 8 2C9.654 2 11 3.346 11 5V8H5V5Z"
                                            fill="gray" />
                                    </svg>
                                </span>
                                <button @click="showConfirmPassword = !showConfirmPassword"
                                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary transition-colors"
                                    type="button" aria-label="تبديل رؤية تأكيد كلمة المرور">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path v-if="showConfirmPassword" stroke-linecap="round" stroke-linejoin="round"
                                            stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </button>
                            </div>
                            <transition name="fade">
                                <label v-if="confirmPasswordError" class="label text-error pt-1 animate-shake">
                                    ⚠️ {{ confirmPasswordError }}
                                </label>
                            </transition>
                        </div>

                        <!-- Activation Code -->
                        <div class="mb-4 relative" v-if="!login">
                            <div class="relative">
                                <input type="text" placeholder="رمز التفعيل"
                                    class="input input-bordered w-full rounded-full pl-12 pr-4 transition-all duration-300 focus:ring-2 focus:ring-primary"
                                    v-model="activationCode" :class="{ 'input-error': codeError }" required
                                    @focus="resetError('code')" aria-label="رمز التفعيل" autocomplete="one-time-code" />
                                <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                                    <svg class="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
                                        <path
                                            d="M10.0001 1.5C12.4854 1.5 14.5001 3.51472 14.5001 6C14.5001 8.48528 12.4854 10.5 10.0001 10.5C9.40737 10.5 8.8415 10.3852 8.32325 10.1769L7.00012 11.5H6.00012V13H4.50012V14.5H1.50012V11.5L5.69315 7.30697C5.56484 6.88319 5.4998 6.44278 5.50012 6C5.50012 3.51472 7.51484 1.5 10.0001 1.5ZM10.0001 0C6.68653 0 4.00012 2.68606 4.00012 6C4.00012 6.276 4.01893 6.55072 4.05634 6.82244L0.219778 10.659C0.0791422 10.7997 0.000131984 10.9904 0.00012207 11.1893L0.00012207 15.25C0.00012207 15.6642 0.335903 16 0.750122 16H5.25012C5.66434 16 6.00012 15.6642 6.00012 15.25V14.5H6.75012C7.16434 14.5 7.50012 14.1642 7.50012 13.75V13.125L8.75165 11.8698C9.15969 11.9564 9.57703 12 10.0001 12C13.3137 12 16.0001 9.31394 16.0001 6C16.0001 2.68641 13.3141 0 10.0001 0ZM10.0001 4.5C10.0001 5.32844 10.6717 6 11.5001 6C12.3286 6 13.0001 5.32844 13.0001 4.5C13.0001 3.67156 12.3286 3 11.5001 3C10.6717 3 10.0001 3.67156 10.0001 4.5Z"
                                            fill="gray" />
                                    </svg>
                                </span>
                            </div>
                            <transition name="fade">
                                <label v-if="codeError" class="label text-error pt-1 animate-shake">
                                    ⚠️ {{ codeError }}
                                </label>
                            </transition>
                        </div>

                        <button @click="handleRegister"
                            class="btn btn-primary w-full rounded-full transition-transform hover:scale-[1.02]"
                            :disabled="isLoading" :class="{ 'opacity-75 cursor-not-allowed': isLoading }">
                            <span v-if="isLoading" class="loading loading-spinner"></span>
                            {{ isLoading ? 'جاري إنشاء...' : login ? 'تسجيل الدخول' : 'إنشاء حساب' }}
                        </button>
                    </div>
                    <div class="text-center mt-6">
                        <span class=" ml-2"> {{ login ? 'ليس لديك حساب؟' : 'لديك حساب؟' }}</span>
                        <a @click="login = !login; errorMessage = ''"
                            class="link link-primary hover:text-primary-focus transition-colors">
                            {{ login ? 'إنشاء حساب ' : 'تسجيل الدخول ' }}
                        </a>
                    </div>
                </div>
                <div class="lg:w-7/12 p-8 flex justify-center items-center relative z-10">
                    <img src="/assess/icon/Bg-1.svg" alt="Online Learning" class="top-0 left-0 absolute -z-10 md:block hidden" />
                    <img src="/assess/icon/Bg-2.svg" alt="Online Learning" class="bottom-4 right-20 absolute -z-10 md:block hidden" />
                    <div class="absolute inset-0 bg-black bg-opacity-50"></div>
                    <div>
                        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2"
                            style="line-height: unset !important">
                            أصبح التعلم عبر الإنترنت
                        </h1>
                        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
                            style="line-height: unset !important">
                            <span class="text-secondary"> أسهل </span> بكثير الآن
                        </h1>
                        <p class="text-lg text-gray-600">
                            ابدأ رحلتك التعليمية اليوم وسجل للحصول على حساب.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useUserStore  } from '~/stores/auth'


const router = useRouter();

const email = ref('');
const activationCode = ref('');
const password = ref('');
const confirmPassword = ref('');

const emailError = ref('');
const codeError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const login = ref(true);

// Add this method to reset errors when focusing on inputs
const resetError = (field) => {
    switch (field) {
        case 'email': emailError.value = ''; break;
        case 'password': passwordError.value = ''; break;
        case 'confirmPassword': confirmPasswordError.value = ''; break;
        case 'code': codeError.value = ''; break;
    }
    errorMessage.value = '';
};

const validateForm = () => {

    let isValid = true;
    emailError.value = '';
    codeError.value = '';
    passwordError.value = '';
    confirmPasswordError.value = '';

    if (!email.value) {
        emailError.value = 'البريد الإلكتروني مطلوب';
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email.value)) {
        emailError.value = 'البريد الإلكتروني غير صحيح';
        isValid = false;
    }

    if (!password.value) {
        passwordError.value = 'كلمة المرور مطلوبة';
        isValid = false;
    } else if (password.value.length < 6) {
        passwordError.value = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
        isValid = false;
    }
    if (!login.value) {
        if (!confirmPassword.value) {
            confirmPasswordError.value = 'تأكيد كلمة المرور مطلوب';
            isValid = false;
        } else if (password.value !== confirmPassword.value) {
            confirmPasswordError.value = 'كلمات المرور غير متطابقة';
            isValid = false;
        }

        if (!activationCode.value) {
            codeError.value = 'رمز التفعيل مطلوب';
            isValid = false;
        }

    }
    return isValid;
};

const handleRegister = async () => {
    if (!validateForm()) return;

    isLoading.value = true;
    errorMessage.value = '';

    try {
        if (login.value) {
            const response = await axios.post('/api/auth/login', {
                email: email.value,
                password: password.value,
            });
            if (response.data.success) {
                useUserStore().login(response.data.user);
                router.push('/')
            } else {
                errorMessage.value = response.data.message || 'حدث خطاء في تسجيل الدخول. يرجى المحاولة مرة أخرى.';
            }
            return;
        }

        const response = await axios.post('/api/auth/register', {
            email: email.value,
            code: activationCode.value,
            password: password.value,
        });

        if (response.data.success) {
            login.value = true;
            email.value = '';
            activationCode.value = '';
            password.value = '';
            confirmPassword.value = '';
        } else {
            errorMessage.value = response.data.message || 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.';
        }
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.';
        console.error('Registrierungsfehler:', error);
    } finally {
        isLoading.value = false;
    }
};
</script>

<style>
.animate-fade-in {
    animation: fadeIn 0.3s ease-in;
}

.animate-shake {
    animation: shake 0.4s ease-in-out;
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

@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-5px);
    }

    75% {
        transform: translateX(5px);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>