<template>
    <div class="container mx-auto min-h-screen ">
        <!-- Mobile Navigation Buttons -->
        <div class="lg:hidden flex justify-between p-4">
            <button @click="showTeachers = !showTeachers" class="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                        d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                المعلمين
            </button>
            <button @click="showChapters = !showChapters" class="btn btn-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                </svg>
                الفصول
            </button>
        </div>

        <div class="flex flex-col-reverse lg:flex-row-reverse gap-6">
            <!-- Mobile Teachers Panel -->
            <div v-if="showTeachers" class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
                <div class="bg-tertiary h-full w-full p-4 overflow-y-auto">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold text-white">جميع المعلمين</h2>
                        <button @click="showTeachers = false" class="btn btn-ghost text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div class="space-y-2">
                        <div v-for="(teacher, index) in courses" :key="index"
                            class="bg-secondary text-primary rounded-lg p-3 flex items-center cursor-pointer relative"
                            :class="{ 'bg-white text-primary': selectedTeacher === teacher.id }"
                            @click="selectTeacher(teacher.id); showTeachers = false">
                            <div class="badge mr-2 absolute -top-4 left-2 border-none"
                                :style="{ backgroundColor: teacher.backgroundColor }">
                                {{ teacher.department }}
                            </div>
                            <div class="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden">
                                <img :src="teacher.avatar" alt="Teacher avatar" class="w-full h-full object-cover" />
                            </div>
                            <div class="mr-3 flex-grow">
                                <h3 class="text-slate-800 text-black" style="font-weight: 600;">{{ teacher.name }}</h3>
                                <p class="text-slate-600 text-gray-800 text-xs">عدد المحاضرات: {{ teacher.parts?.length
                                }}</p>
                                <div v-if="isCoursePurchased(teacher.id)"
                                    class="badge badge-success text-white text-xs mt-1 absolute -top-4 right-2">مشترك
                                </div>
                                <div v-else-if="teacher.isFree"
                                    class="badge badge-success text-white text-xs mt-1 absolute -top-4 right-2">مجاني
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Desktop Teachers Panel -->
            <div class="hidden lg:block bg-tertiary rounded-[30px] shadow-xl p-4 pb-8 lg:w-1/4">
                <h2 class="text-xl font-bold text-white mb-3" style="color: azure;">جميع المعلمين</h2>

                <div v-if="isLoadingCourses" class="flex justify-center items-center p-4">
                    <div class="loading loading-spinner loading-lg text-white"></div>
                    <p class="mr-2 text-white">جاري تحميل المعلمين...</p>
                </div>

                <div v-else class="h-[70vh] overflow-hidden">
                    <swiper :modules="modules" :slides-per-view="'auto'" :space-between="20" :direction="'vertical'"
                        :mousewheel="{
                            forceToAxis: true,
                            sensitivity: 1,
                            releaseOnEdges: true
                        }" :free-mode="{
                            enabled: true,
                            momentum: true,
                            momentumRatio: 0.8,
                            momentumVelocityRatio: 0.8
                        }" class="h-full">
                        <swiper-slide v-for="(teacher, index) in courses" :key="index" class="!h-auto ">
                            <div class="bg-secondary text-primary rounded-lg p-4 flex items-center cursor-pointer relative mt-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                                :class="{ 'bg-white text-primary shadow-md transform scale-[0.98]': selectedTeacher === teacher.id, 'mt-8': index === 0 }"
                                @click="selectTeacher(teacher.id)">
                                <div class="badge mr-2 absolute -top-4 left-2 border-none"
                                    :style="{ backgroundColor: teacher.backgroundColor }">
                                    {{ teacher.department }}
                                </div>
                                <div class="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden">
                                    <img :src="teacher.avatar" alt="Teacher avatar"
                                        class="w-full h-full object-cover" />
                                </div>
                                <div class="mr-3 flex-grow">
                                    <h3 class="text-slate-800 text-black" style="font-weight: 600;">{{ teacher.name }}
                                    </h3>
                                    <p class="text-slate-600 text-gray-800 text-xs">عدد المحاضرات: {{
                                        teacher.parts?.length }}</p>
                                    <div v-if="isCoursePurchased(teacher.id)"
                                        class="badge badge-success text-white text-xs mt-1 absolute -top-4 right-2">
                                        مشترك</div>
                                    <div v-else-if="hasFreeVideos(teacher.id)"
                                        class="badge badge-info text-white text-xs mt-1 absolute -top-4 right-2">
                                        {{ teacher.freeVideosCount || hasFreeVideos(teacher.id) }}
                                    </div>
                                </div>
                            </div>
                        </swiper-slide>
                    </swiper>
                </div>
            </div>

            <!-- Main Content Area -->
            <div class="lg:w-2/4">
                <div v-if="selectedCourse && selectedEpisode" class="mb-6 relative">
                    <!-- Video Player -->
                    <div class="bg-slate-800 rounded-lg overflow-hidden relative aspect-video">
                        <div ref="videoContainer" class="video-container relative w-full h-full">
                            <div v-if="userStore.isLoggedIn"
                                class="absolute watermark-text text-white text-opacity-70 select-none pointer-events-none">
                                {{ userStore.username }} <br> {{ userStore.email }} </div>
                            <iframe v-if="currentVideoUrl" class="w-full h-full" :src="currentVideoUrl" frameborder="0"
                                allowfullscreen
                                allow="accelerometer;clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
                            <button v-if="currentVideoUrl" @click="toggleFullscreen" class="custom-fullscreen">
                                <span v-if="!isFullscreen">⛶</span>
                                <span v-else>⤢</span>
                            </button>
                            <div v-else class="flex items-center justify-center h-full flex-col text-white p-4">
                                <div class="flex flex-col items-center justify-center space-y-3">
                                    <div class="relative">
                                        <div class="loading loading-spinner loading-lg mb-2"></div>
                                        <div
                                            class="absolute inset-0 border-4 border-t-transparent border-primary rounded-full animate-ping">
                                        </div>
                                    </div>
                                    <p class="text-white animate-pulse">جاري تحميل الفيديو...</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Video Info -->
                    <div class="mt-4 text-right">
                        <h2 class="text-xl font-bold">
                            {{
                                selectedEpisode.name
                            }}
                        </h2>
                        <p class="text-gray-600">الأستاذ {{ selectedTeacherName }}</p>
                        <div class="flex justify-end mt-2">
                            <div v-if="isCoursePurchased(selectedCourse.id)" class="badge badge-success text-white">
                                مشترك</div>
                            <div v-else-if="selectedEpisode.isFree" class="badge badge-info text-white">مجاني</div>
                            <div v-else class="badge badge-warning text-white">مدفوع</div>
                        </div>
                    </div>
                </div>

                <!-- No Selection Message -->
                <div v-else class="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                    <div v-if="isLoadingCourses" class="flex flex-col items-center justify-center">
                        <div class="loading loading-spinner loading-lg mb-2 text-secondary"></div>
                        <p class="text-slate-600">جاري تحميل الدورات...</p>
                    </div>
                    <div v-else-if="isLoadingTeacherContent" class="flex flex-col items-center justify-center">
                        <div class="loading loading-spinner loading-lg mb-2 text-secondary"></div>
                        <p class="text-slate-600">جاري تحميل محتوى المعلم...</p>
                    </div>
                    <p v-else class="text-xl text-gray-500">الرجاء اختيار محاضرة للمشاهدة</p>
                </div>
            </div>

            <!-- Mobile Chapters Panel -->
            <div v-if="showChapters" class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
                <div class="bg-secondary h-full w-full p-4 overflow-y-auto">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold text-slate-800">جميع الفصول</h2>
                        <button @click="showChapters = false" class="btn btn-ghost text-slate-800">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div class="space-y-2">
                        <div v-for="course in filteredCourses" :key="course.id" class="mb-4">
                            <div class="flex items-center gap-1 mb-2">
                                <h3 class="font-bold text-sm text-slate-800">{{ course.name }}</h3>
                                <div v-if="isCoursePurchased(course.id)" class="badge badge-success text-white text-xs">
                                    مشترك</div>

                            </div>
                            <div v-for="part in course.parts" :key="part.id" class="mb-2">
                                <h3 @click="togglePart(part.id)"
                                    class="bg-white rounded-[30px] p-4 flex items-center cursor-pointer text-slate-800 font-bold shadow-sm">
                                    <span>{{ part.name }}</span>
                                    <span class="mr-auto">
                                        <svg v-if="!openParts[part.id]" xmlns="http://www.w3.org/2000/svg"
                                            class="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M9 5l7 7-7 7" />
                                        </svg>
                                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-secondary"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </span>
                                </h3>

                                <div v-if="openParts[part.id]" class="space-y-2 mt-3 px-2">
                                    <transition-group name="staggered-fade" tag="div" class="space-y-2"
                                        v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:leave="leave">
                                        <div v-for="(episode, index) in part.episodes" :key="episode.id"
                                            :data-index="index" @click="playEpisode(course, part, episode)"
                                            class="bg-white rounded-[15px] p-3 flex items-center gap-2 relative transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                            :class="[
                                                isActive(course.id, part.id, episode.id) ? 'border-2 border-black scale-[1.02]' : 'border border-secondary',
                                                canAccessEpisode(course.id, episode) ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'
                                            ]">
                                            <div v-if="episode.isFree"
                                                class="badge badge-info text-white text-xs absolute -top-2 left-2">
                                                مجاني</div>
                                            <div class="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                                                :class="canAccessEpisode(course.id, episode) ? 'bg-secondary' : 'bg-gray-400'">
                                                <svg v-if="canAccessEpisode(course.id, episode)"
                                                    xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white"
                                                    viewBox="0 0 20 20" fill="currentColor">
                                                    <path fill-rule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                                <svg v-else xmlns="http://www.w3.org/2000/svg"
                                                    class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fill-rule="evenodd"
                                                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 bg-white2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </div>
                                            <div class="text-sm">
                                                <div class="font-semibold text-sm">{{ episode.name }}</div>
                                            </div>
                                        </div>
                                    </transition-group>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Desktop Chapters Panel -->
            <div class="hidden lg:block bg-secondary rounded-[30px] shadow-xl p-4 pb-8 lg:w-1/4">
                <h2 class="text-xl font-bold text-slate-800 mb-3">جميع الفصول</h2>

                <div v-if="isLoadingCourses" class="flex justify-center items-center p-4">
                    <div class="loading loading-spinner loading-lg text-secondary"></div>
                    <p class="mr-2 text-slate-800">جاري تحميل الفصول...</p>
                </div>

                <div v-else-if="isLoadingTeacherContent" class="flex justify-center items-center p-4">
                    <div class="loading loading-spinner loading-lg text-secondary"></div>
                    <p class="mr-2 text-slate-800">جاري تحميل محتوى المعلم...</p>
                </div>

                <div v-else class="h-[70vh] overflow-hidden">
                    <swiper :modules="modules" :slides-per-view="'auto'" :space-between="20" :direction="'vertical'"
                        :mousewheel="{
                            forceToAxis: true,
                            sensitivity: 1,
                            releaseOnEdges: true
                        }" :free-mode="{
                            enabled: true,
                            momentum: true,
                            momentumRatio: 0.8,
                            momentumVelocityRatio: 0.8
                        }" class="h-full">
                        <swiper-slide v-for="course in filteredCourses" :key="course.id" class="!h-auto">
                            <div class="mb-2">
                                <div class="flex items-center gap-1 mb-1">
                                    <h3 class="font-bold text-sm text-slate-800">{{ course.name }}</h3>
                                    <div v-if="isCoursePurchased(course.id)"
                                        class="badge badge-success text-white text-xs">
                                        مشترك</div>
                                </div>
                                <div v-for="part in course.parts" :key="part.id" class="mb-2">
                                    <h3 @click="togglePart(part.id)"
                                        class="bg-white rounded-[30px] p-4 flex items-center cursor-pointer text-slate-800 font-bold shadow-sm hover:bg-gray-50 transition-colors duration-200">
                                        <span>{{ part.name }}</span>
                                        <span class="mr-auto">
                                            <svg v-if="!openParts[part.id]" xmlns="http://www.w3.org/2000/svg"
                                                class="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M9 5l7 7-7 7" />
                                            </svg>
                                            <svg v-else xmlns="http://www.w3.org/2000/svg"
                                                class="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </span>
                                    </h3>

                                    <div v-if="openParts[part.id]" class="space-y-2 mt-3 px-2">
                                        <div v-if="isLoadingParts[part.id]" class="flex justify-center my-4">
                                            <div class="loading loading-spinner loading-md text-secondary"></div>
                                            <span class="mr-2 text-slate-800">جاري التحميل...</span>
                                        </div>
                                        <div v-else>
                                            <transition-group name="staggered-fade" tag="div" class="space-y-2"
                                                v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:leave="leave">
                                                <div v-for="(episode, index) in part.episodes" :key="episode.id"
                                                    :data-index="index" @click="playEpisode(course, part, episode)"
                                                    class="bg-white rounded-[15px] p-3 flex items-center gap-2 relative transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                                    :class="[
                                                        isActive(course.id, part.id, episode.id) ? 'border-2 border-black scale-[1.02]' : 'border border-secondary',
                                                        canAccessEpisode(course.id, episode) ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'
                                                    ]">
                                                    <div v-if="episode.isFree"
                                                        class="badge badge-info text-white text-xs absolute -top-2 left-2">
                                                        مجاني</div>
                                                    <div class="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                                                        :class="canAccessEpisode(course.id, episode) ? 'bg-secondary' : 'bg-gray-400'">
                                                        <svg v-if="canAccessEpisode(course.id, episode)"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            class="h-4 w-4 text-white" viewBox="0 0 20 20"
                                                            fill="currentColor">
                                                            <path fill-rule="evenodd"
                                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                                                clip-rule="evenodd" />
                                                        </svg>
                                                        <svg v-else xmlns="http://www.w3.org/2000/svg"
                                                            class="h-4 w-4 text-white" viewBox="0 0 20 20"
                                                            fill="currentColor">
                                                            <path fill-rule="evenodd"
                                                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 bg-white2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                                                clip-rule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div class="text-sm">
                                                        <div class="font-semibold text-sm">{{ episode.name }}</div>
                                                    </div>
                                                </div>
                                            </transition-group>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </swiper-slide>
                    </swiper>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '~/stores/auth';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import * as anime from 'animejs';

// Define Swiper modules
const modules = [Pagination, Mousewheel];

// State
const courses = ref([]);
const selectedTeacher = ref(null);
const selectedCourse = ref(null);
const selectedPart = ref(null);
const selectedEpisode = ref(null);
const openParts = ref({});
const currentVideoUrl = ref(null);
const isLoadingVideo = ref(false);
const videoError = ref(null);
const isLoadingCourses = ref(true);
const isLoadingTeacherContent = ref(false);
const isLoadingParts = ref({});
const isFullscreen = ref(false);
const videoContainer = ref(null);
const freeVideosCount = ref(0);

// User store for authentication
const userStore = useUserStore();

// Add new state for mobile menus
const showTeachers = ref(false);
const showChapters = ref(false);

// Fetch courses from API
onMounted(async () => {
    try {
        isLoadingCourses.value = true;
        const response = await fetch('/api/courses');
        const data = await response.json();

        // Ensure data is valid array before mapping
        if (!Array.isArray(data)) {
            console.error('Invalid courses data received:', data);
            courses.value = [];
            return;
        }

        // Add fullscreen change event listeners
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
        // sort data by byed 
        courses.value = data
            .filter(course => course && typeof course === 'object') // Filter out invalid courses
            .map(course => ({
                ...course,
                id: course.id || crypto.randomUUID(), // Ensure each course has an id
                parts: Array.isArray(course.parts) ? course.parts : [] // Ensure parts is always an array
            }));

        // Auto-select first teacher - only proceed if we have valid courses
        if (courses.value.length > 0) {
            selectedTeacher.value = courses.value[0].id;

            // Auto-open first part if exists
            const firstCourse = courses.value[0];
            if (firstCourse.parts && firstCourse.parts.length > 0) {
                const firstPart = firstCourse.parts[0];
                if (firstPart && firstPart.id) {
                    openParts.value[firstPart.id] = true;

                    // Auto-select first episode if it exists
                    if (Array.isArray(firstPart.episodes) && firstPart.episodes.length > 0) {
                        const firstEpisode = firstPart.episodes[0];
                        if (firstEpisode) {
                            selectedCourse.value = firstCourse;
                            selectedPart.value = firstPart;

                            // Only select the first episode if it's free or user has access
                            if (canAccessEpisode(firstCourse.id, firstEpisode)) {
                                selectedEpisode.value = firstEpisode;

                                // Check if we need to load video URL from API or if we already have it
                                if (firstEpisode.link) {
                                    currentVideoUrl.value = firstEpisode.link;
                                } else if (canAccessEpisode(firstCourse.id, firstEpisode)) {
                                    // If we don't have the link but user should have access, fetch it
                                    loadVideoUrl(firstCourse.id, firstEpisode.id);
                                }
                            }
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error('Failed to fetch courses:', error);
    } finally {
        isLoadingCourses.value = false;
    }
});

// Add transition hooks
const beforeEnter = (el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
};

const enter = (el, done) => {
    const delay = el.dataset.index * 50;
    setTimeout(() => {
        el.style.transition = 'all 400ms ease-out';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.addEventListener('transitionend', done, { once: true });
    }, delay);
};

const leave = (el, done) => {
    el.style.transition = 'all 200ms ease-in';
    el.style.opacity = '0';
    el.style.transform = 'translateY(-20px)';
    el.addEventListener('transitionend', done, { once: true });
};

// Improved video loading logic
async function loadVideoUrl(courseId, episodeId) {
    try {
        isLoadingVideo.value = true
        videoError.value = null

        // Abort previous request if still loading
        if (window.videoRequestController) {
            window.videoRequestController.abort()
        }
        window.videoRequestController = new AbortController()

        const response = await fetch(`/api/courses/video/${courseId}/${episodeId}`, {
            signal: window.videoRequestController.signal
        })

        if (!response.ok) throw new Error('فشل تحميل الفيديو')

        const data = await response.json()

        if (data.success) {
            currentVideoUrl.value = data.videoUrl
            // Trigger video fade-in animation
            anime.default({
                targets: document.querySelector('.video-container'),
                opacity: [0, 1],
                duration: 500
            })
        } else {
            throw new Error(data.message || 'خطأ غير معروف')
        }
    } catch (error) {
        if (error.name !== 'AbortError') {
            videoError.value = error.message
            console.error('Failed to load video:', error)
        }
    } finally {
        isLoadingVideo.value = false
        window.videoRequestController = null
    }
}

// Computed properties
const filteredCourses = computed(() => {
    if (!selectedTeacher.value) {
        return courses.value;
    }
    return courses.value.filter(course => course.id === selectedTeacher.value);
});

const selectedTeacherName = computed(() => {
    const course = courses.value.find(c => c.id === selectedTeacher.value);
    return course ? course.name : '';
});

// hasfreevideos and cont 
// Determine if a course has free videos
const hasFreeVideos = computed(() => {
    // rturen the haow many free videos in the course 
    return (courseId) => {
        const course = courses.value.find(c => c.id === courseId);
        if (!course) return false;
        const freeVideos = course.parts.reduce((count, part) => {
            return count + (part.episodes.filter(episode => episode.isFree).length || 0);
        }, 0);
        return freeVideos > 0 ? `${freeVideos} محاضرات مجانية` : false;
    };

});

// Determine if a course is purchased by the user
const isCoursePurchased = computed(() => {
    return (courseId) => {
        if (!userStore.isLoggedIn) return false;
        return userStore.courses.includes(courseId);
    };
});

// User access control methods
function canAccessEpisode(courseId, episode) {
    // Safety check for null/undefined episodes
    if (!episode) return false;

    // Free episodes are always accessible
    if (episode.isFree === true) {
        return true;
    }

    // If user is not logged in, they can only access free episodes
    if (!userStore.isLoggedIn) {
        return false;
    }

    // Get user's purchased courses from the session
    const userCourses = userStore.courses || [];

    // If the user has purchased this course, they can access all episodes
    return userCourses.includes(courseId);
}

// Methods
function selectTeacher(teacherId) {
    isLoadingTeacherContent.value = true;
    selectedTeacher.value = teacherId;

    // Reset selections when changing teacher
    selectedCourse.value = null;
    selectedPart.value = null;
    selectedEpisode.value = null;
    currentVideoUrl.value = null;
    videoError.value = null;

    // Find the selected course
    const course = courses.value.find(c => c.id === teacherId);
    if (course && Array.isArray(course.parts) && course.parts.length > 0) {
        // Auto-open first part
        const firstPart = course.parts[0];
        if (firstPart && firstPart.id) {
            openParts.value = {};
            openParts.value[firstPart.id] = true;

            // Auto-select first episode if exists and user can access it
            if (Array.isArray(firstPart.episodes) && firstPart.episodes.length > 0) {
                const firstEpisode = firstPart.episodes[0];
                if (firstEpisode) {
                    selectedCourse.value = course;
                    selectedPart.value = firstPart;

                    // Only select the episode if user has access
                    if (canAccessEpisode(course.id, firstEpisode)) {
                        selectedEpisode.value = firstEpisode;

                        // Check if we already have the link in the episode data
                        if (firstEpisode.link) {
                            currentVideoUrl.value = firstEpisode.link;
                            isLoadingVideo.value = false;
                            videoError.value = null;
                        } else {
                            // Otherwise, fetch it from the API
                            loadVideoUrl(course.id, firstEpisode.id);
                        }
                    }
                }
            }
        }
    }

    // Short delay to simulate loading and show transition
    setTimeout(() => {
        isLoadingTeacherContent.value = false;
    }, 500);
}

function togglePart(partId) {
    // Set loading state for this specific part
    isLoadingParts.value[partId] = true;

    // Toggle the part open/closed state
    openParts.value[partId] = !openParts.value[partId];

    // Short delay to simulate loading
    setTimeout(() => {
        isLoadingParts.value[partId] = false;
    }, 300);
}

function playEpisode(course, part, episode) {
    if (!course || !part || !episode) return;

    // Reset video player
    currentVideoUrl.value = null;
    videoError.value = null;

    // Close mobile menus when selecting a video
    showTeachers.value = false;
    showChapters.value = false;

    selectedCourse.value = course;
    selectedPart.value = part;

    // Only play the episode if the user has access
    if (canAccessEpisode(course.id, episode)) {
        selectedEpisode.value = episode;

        // Add a fade-in animation to the video player
        const videoPlayerEl = document.querySelector('.video-container');
        if (videoPlayerEl) {
            videoPlayerEl.style.opacity = '0';
            setTimeout(() => {
                videoPlayerEl.style.opacity = '1';
                videoPlayerEl.style.transition = 'opacity 0.5s ease';
            }, 100);
        }

        // Check if we already have the link or need to fetch it
        if (episode.link) {
            isLoadingVideo.value = true;
            // Add a small delay to show loading state even for cached links 
            // for a more consistent UX
            setTimeout(() => {
                currentVideoUrl.value = episode.link;
                isLoadingVideo.value = false;
            }, 300);
        } else {
            // If we don't have the link, fetch it from the API
            loadVideoUrl(course.id, episode.id);
        }
    }
}

function isActive(courseId, partId, episodeId) {
    return selectedCourse.value?.id === courseId &&
        selectedPart.value?.id === partId &&
        selectedEpisode.value?.id === episodeId;
}

function toggleFullscreen() {
    if (currentVideoUrl.value) {
        if (!isFullscreen.value) {
            // Enter fullscreen mode
            if (videoContainer.value) {
                videoContainer.value.requestFullscreen();
            }
        } else {
            // Exit fullscreen mode
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
        isFullscreen.value = !isFullscreen.value;
    }
}

function handleFullscreenChange() {
    // Update fullscreen state based on document.fullscreenElement
    isFullscreen.value = !!document.fullscreenElement ||
        !!document.webkitFullscreenElement ||
        !!document.mozFullScreenElement ||
        !!document.msFullscreenElement;
}
</script>

<style scoped>
/* Right-to-left support for Arabic text */
* {
    direction: rtl;
}

/* Smooth scroll behavior for entire component */
html {
    scroll-behavior: smooth;
}

/* Optimized container transitions */
.video-container {
    position: relative;
    width: 100%;
    height: 100%;
    transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: transform, opacity;
    backface-visibility: hidden;
}

/* Improved watermark */
.watermark-text {
    opacity: 0.5;
    transform: rotate(-15deg);
    user-select: none;
    color: #ffffff8a;
    text-shadow: 1px 1px 2px rgba(226, 0, 0, 0.356);
    font-size: 14px;
    white-space: nowrap;
    z-index: 2;
    position: absolute;
    animation: watermark-pulse 4s ease-in-out infinite, moveWatermark 30s ease-in-out infinite;
}

@keyframes watermark-pulse {
    0% {
        opacity: 0.3;
    }

    50% {
        opacity: 0.6;
    }

    100% {
        opacity: 0.3;
    }
}

@keyframes moveWatermark {

    0%,
    100% {
        top: 20%;
        left: 10%;
    }

    25% {
        top: 70%;
        left: 30%;
    }

    50% {
        top: 40%;
        left: 70%;
    }

    75% {
        top: 20%;
        left: 80%;
    }
}

/* Ensure watermark stays visible in fullscreen */
.video-container:-webkit-full-screen .watermark-text,
.video-container:-ms-fullscreen .watermark-text,
.video-container:fullscreen .watermark-text {
    display: block !important;
    font-size: 24px;
}

/* Custom fullscreen button */
button.custom-fullscreen {
    position: absolute;
    bottom: 15px;
    right: 15px;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.2s ease;
}

button.custom-fullscreen:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: scale(1.05);
}

/* Optimized swiper containers */
.teachers-swiper,
.chapters-swiper {
    height: 100%;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-y;
    scroll-behavior: smooth;
    overscroll-behavior: contain;
}

/* Hardware-accelerated slides */
.swiper-slide {
    backface-visibility: hidden;
    transform: translateZ(0);
    will-change: transform;
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Cleaned up scrollbars */
.teachers-swiper::-webkit-scrollbar,
.chapters-swiper::-webkit-scrollbar {
    width: 4px;
    background: transparent;
}

.teachers-swiper::-webkit-scrollbar-thumb,
.chapters-swiper::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
}

/* Improved swiper pagination */
.swiper-pagination {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 4px;
    z-index: 10;
    padding: 8px 4px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
}

.swiper-pagination-bullet {
    width: 6px;
    height: 6px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    opacity: 0.5;
}

.swiper-pagination-bullet-active {
    background: #fff;
    transform: scale(1.2);
    opacity: 1;
}

/* Enhanced staggered transitions */
.staggered-fade-move {
    transition: all 500ms cubic-bezier(0.22, 1, 0.36, 1);
}

.staggered-fade-enter-active {
    transition: all 300ms ease-out;
}

.staggered-fade-leave-active {
    transition: all 200ms ease-in;
    position: absolute;
}

.staggered-fade-enter-from,
.staggered-fade-leave-to {
    opacity: 0;
    transform: translateY(30px);
}

/* Loading spinner animation */
.loading-spinner {
    animation: spin 1.5s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* Mobile-specific styles */
@media (max-width: 1024px) {
    .video-container {
        aspect-ratio: 16/9;
        width: 100%;
        height: auto;
    }

    .watermark-text {
        font-size: 12px;
    }

    .lg\:hidden.fixed>div {
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
    }

    .space-y-2>div {
        padding: 12px;
        margin-bottom: 8px;
    }

    /* Smoother mobile transitions */
    .teachers-swiper .swiper-slide,
    .chapters-swiper .swiper-slide {
        transition: transform 0.3s ease;
    }
}

/* Full height mobile menus */
.lg\:hidden.fixed {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
}

/* Panel slide transitions */
.lg\:hidden.fixed>div {
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Smooth course selection transitions */
[class*="cursor-pointer"] {
    transition: all 0.3s ease;
}
</style>