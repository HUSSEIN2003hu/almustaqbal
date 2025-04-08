<template>
    <div class="container mx-auto min-h-screen ">
        <div class="flex flex-col-reverse lg:flex-row-reverse gap-6">
            <!-- Teachers Panel -->
            <div class="bg-tertiary rounded-[30px] shadow-xl p-4 lg:w-1/4">
                <h2 class="text-xl font-bold text-white mb-4" style="color: azure;">جميع المعلمين</h2>

                <div v-if="isLoadingCourses" class="flex justify-center items-center p-6">
                    <div class="loading loading-spinner loading-lg text-white"></div>
                    <p class="mr-2 text-white">جاري تحميل المعلمين...</p>
                </div>

                <div v-else class="space-y-8">
                    <div v-for="(teacher, index) in courses" :key="index"
                        class="bg-secondary text-primary rounded-lg p-3 flex items-center cursor-pointer relative mt-12"
                        :class="{ 'bg-white text-primary': selectedTeacher === teacher.id }" @click="selectTeacher(teacher.id)">
                        <div class="badge mr-3 absolute -top-5 left-2 border-none"
                            :style="{ backgroundColor: teacher.backgroundColor }">
                            {{ teacher.department }}
                        </div>
                        <div class="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden">
                            <img :src="teacher.avatar" alt="Teacher avatar" class="w-full h-full object-cover" />
                        </div>
                        <div class="mr-3 flex-grow">
                            <h3 class="text-slate-800 text-black" style="    font-weight: 600;">{{ teacher.name }}</h3>
                            <p class="text-slate-600 text-gray-800 text-xs">عدد المحاضرات: {{ teacher.parts?.length }}</p>
                            <div v-if="isCoursePurchased(teacher.id)"
                                class="badge badge-success text-white text-xs mt-1 absolute -top-5 right-2">مشترك</div>
                        </div>
                    </div>
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
                                <div v-if="isLoadingVideo" class="flex flex-col items-center justify-center">
                                    <div class="loading loading-spinner loading-lg mb-2"></div>
                                    <p class="text-white">جاري تحميل الفيديو...</p>
                                </div>
                                <div v-else-if="videoError" class="flex flex-col items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mb-2"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <p class="text-red-400 text-center">{{ videoError }}</p>
                                    <div v-if="!userStore.isLoggedIn" class="mt-4">
                                        <NuxtLink to="/auth" class="btn btn-primary btn-sm">تسجيل الدخول للمشاهدة
                                        </NuxtLink>
                                    </div>
                                    <div v-else-if="selectedEpisode && !selectedEpisode.isFree && !isCoursePurchased(selectedCourse.id)"
                                        class="mt-4">
                                        <button class="btn btn-accent btn-sm">شراء الدورة</button>
                                    </div>
                                </div>
                                <div v-else class="flex flex-col items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-yellow-500 mb-2"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <p class="text-yellow-400 text-center">هذا المحتوى مقفل</p>
                                    <div v-if="!userStore.isLoggedIn" class="mt-4">
                                        <NuxtLink to="/auth" class="btn btn-primary btn-sm">تسجيل الدخول للمشاهدة
                                        </NuxtLink>
                                    </div>
                                    <div v-else-if="selectedEpisode && !selectedEpisode.isFree" class="mt-4">
                                        <button class="btn btn-accent btn-sm">شراء الدورة</button>
                                    </div>
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

            <!-- Lectures List -->
            <div class="bg-secondary rounded-[30px] shadow-xl p-4 lg:w-1/4">
                <h2 class="text-xl font-bold text-slate-800 mb-4">جميع الفصول</h2>

                <div v-if="isLoadingCourses" class="flex justify-center items-center p-6">
                    <div class="loading loading-spinner loading-lg text-secondary"></div>
                    <p class="mr-2 text-slate-800">جاري تحميل الفصول...</p>
                </div>

                <div v-else-if="isLoadingTeacherContent" class="flex justify-center items-center p-6">
                    <div class="loading loading-spinner loading-lg text-secondary"></div>
                    <p class="mr-2 text-slate-800">جاري تحميل محتوى المعلم...</p>
                </div>

                <div v-else class="space-y-4">
                    <div v-for="course in filteredCourses" :key="course.id" class="mb-6">
                        <div class="flex items-center gap-2 mb-2">
                            <h3 class="font-bold text-sm text-slate-800">{{ course.name }}</h3>
                            <div v-if="isCoursePurchased(course.id)" class="badge badge-success text-white text-xs">
                                مشترك</div>
                        </div>
                        <div v-for="part in course.parts" :key="part.id" class="mb-4">
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
                                <div v-if="isLoadingParts[part.id]" class="flex justify-center my-4">
                                    <div class="loading loading-spinner loading-md text-secondary"></div>
                                    <span class="mr-2 text-slate-800">جاري التحميل...</span>
                                </div>
                                <div v-else v-for="episode in part.episodes" :key="episode.id"
                                    @click="playEpisode(course, part, episode)"
                                    class="bg-white rounded-[15px] p-3 flex items-center gap-2" :class="[
                                        isActive(course.id, part.id, episode.id) ? 'border-2 border-black' : 'border border-secondary',
                                        canAccessEpisode(course.id, episode) ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'
                                    ]">
                                    <div class="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                                        :class="canAccessEpisode(course.id, episode) ? 'bg-secondary' : 'bg-gray-400'">
                                        <svg v-if="canAccessEpisode(course.id, episode)"
                                            xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white"
                                            viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white"
                                            viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd"
                                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 bg-white2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                    <div class="text-sm">
                                        <div class="font-semibold text-sm">{{ episode.name }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '~/stores/auth';

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

// User store for authentication
const userStore = useUserStore();

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

// Fetch video URL securely from the API
async function loadVideoUrl(courseId, episodeId) {
    try {
        isLoadingVideo.value = true;
        videoError.value = null;
        currentVideoUrl.value = null;

        const response = await fetch(`/api/courses/video/${courseId}/${episodeId}`);
        const data = await response.json();

        if (data.success) {
            currentVideoUrl.value = data.videoUrl;
        } else {
            videoError.value = data.message || 'Could not load video. Access denied.';
            console.error('Video access error:', data.message);
        }
    } catch (error) {
        videoError.value = 'An error occurred while loading the video.';
        console.error('Failed to load video URL:', error);
    } finally {
        isLoadingVideo.value = false;
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

    selectedCourse.value = course;
    selectedPart.value = part;

    // Only play the episode if the user has access
    if (canAccessEpisode(course.id, episode)) {
        selectedEpisode.value = episode;

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

.watermark-text {
    opacity: 0.7;
    transform: rotate(-15deg);
    user-select: none;
    color: #ffffff8a;
    text-shadow: 1px 1px 2px rgba(226, 0, 0, 0.356);
    font-size: 14px;
    white-space: nowrap;
    z-index: 2;
    position: absolute;
    animation: moveWatermark 30s ease-in-out infinite;
}

@keyframes moveWatermark {
    0% {
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

    100% {
        top: 20%;
        left: 10%;
    }
}

.video-container {
    position: relative;
    width: 100%;
    height: 100%;
}

/* Ensure watermark stays visible in fullscreen */
.video-container:-webkit-full-screen .watermark-text,
.video-container:-ms-fullscreen .watermark-text,
.video-container:fullscreen .watermark-text {
    display: block !important;
}

/* Add a custom fullscreen button if needed */
button.custom-fullscreen {
    position: absolute;
    bottom: 10px;
    right: 10px;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    cursor: pointer;
}
</style>