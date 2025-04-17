<template>
    <div class="bg-base-100 min-h-screen">
        <!-- Admin Dashboard -->
        <div class="container mx-auto p-4">
            <h1 class="text-2xl font-bold mb-6">لوحة تحكم المسؤول</h1>

            <!-- Stats Overview Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <!-- Users Card -->
                <div class="stat bg-base-200 shadow rounded-lg">
                    <div class="stat-figure text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div class="stat-title">طالب</div>
                    <div class="stat-value text-primary">{{ stats.totalUsers }}</div>
                    <div class="stat-desc">{{ stats.activeUsers }} طالبنشط</div>
                </div>
                <!-- Courses Card -->
                <div class="stat bg-base-200 shadow rounded-lg">
                    <div class="stat-figure text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <div class="stat-title">الدورات</div>
                    <div class="stat-value text-secondary">{{ stats.totalCourses }}</div>
                    <div class="stat-desc">{{ stats.totalParts }} أجزاء, {{ stats.totalEpisodes }} حلقات</div>
                </div>
                <!-- Departments Card -->
                <div class="stat bg-base-200 shadow rounded-lg">
                    <div class="stat-figure text-accent">
                        <div class="dropdown dropdown-bottom dropdown-end relative">
                            <label tabindex="0" class="cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </label>
                            <div tabindex="0"
                                class="dropdown-content z-[100] menu p-2 shadow-lg bg-base-100 rounded-box w-72 absolute right-0">
                                <div class="p-2">
                                    <h3 class="font-bold text-lg mb-2 text-primary">الأقسام</h3>
                                    <div class="max-h-64 overflow-y-auto">
                                        <div v-for="(department, index) in departments" :key="index"
                                            class="mb-3 p-2 bg-base-200 rounded-lg">
                                            <div class="flex justify-between items-center">
                                                <h4 class="font-semibold">{{ department.name }}</h4>
                                                <div class="dropdown dropdown-left">
                                                    <button tabindex="0" class="btn btn-xs btn-ghost btn-circle">
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3"
                                                            viewBox="0 0 20 20" fill="currentColor">
                                                            <path
                                                                d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                        </svg>
                                                    </button>
                                                    <ul tabindex="0"
                                                        class="dropdown-content z-[101] menu p-1 shadow bg-base-100 rounded-box w-40">
                                                        <li><a @click="viewDepartmentCourses(department)">عرض
                                                                الدورات</a></li>
                                                        <li><a @click="editDepartment(department)">تعديل</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="flex gap-2 mt-1">
                                                <div class="badge badge-primary badge-sm">{{ department.courseCount }}
                                                    دورة</div>
                                                <div class="badge badge-secondary badge-sm">{{ department.episodeCount
                                                }} حلقة</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="stat-title">الأقسام</div>
                    <div class="stat-value text-accent">{{ departments.length }}</div>
                    <div class="stat-desc">اضغط للتفاصيل</div>
                </div>
                <!-- Last Activity Card -->
                <div class="stat bg-base-200 shadow rounded-lg">
                    <div class="stat-figure text-info">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="stat-title">آخر تحديث</div>
                    <div class="stat-value text-info">{{ stats.lastActivityFormatted }}</div>
                    <div class="stat-desc">{{ stats.lastActivityRelative }}</div>
                </div>
            </div>

            <!-- Main Sections -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Recent Users Section -->
                <div class="card bg-base-200 shadow-lg">
                    <div class="card-body">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="card-title">آخر طالب</h2>
                            <NuxtLink to="/admin/users" class="btn btn-primary btn-sm">عرض الكل</NuxtLink>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="table w-full">
                                <thead>
                                    <tr>
                                        <th>اسم المستخدم</th>
                                        <th>الرمز</th>
                                        <th>الحالة</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="user in recentUsers" :key="user.id" class="hover">
                                        <td>{{ user.username }}</td>
                                        <td>{{ user.code }}</td>
                                        <td>
                                            <div class="badge"
                                                :class="user.isActive ? 'badge-success' : 'badge-warning'">
                                                {{ user.isActive ? 'نشط' : 'غير نشط' }}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Recent Courses Section -->
                <div class="card bg-base-200 shadow-lg">
                    <div class="card-body">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="card-title">آخر الدورات</h2>
                            <NuxtLink to="/admin/courses" class="btn btn-primary btn-sm">عرض الكل</NuxtLink>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="table w-full">
                                <thead>
                                    <tr>
                                        <th>اسم الدورة</th>
                                        <th>القسم</th>
                                        <th>الحلقات</th>
                                        <th>الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="course in recentCourses" :key="course.id" class="hover">
                                        <td>{{ course.name }}</td>
                                        <td>{{ course.department }}</td>
                                        <td>{{ getEpisodeCount(course) }}</td>
                                        <td>
                                            <div class="dropdown dropdown-left">
                                                <button tabindex="0" class="btn btn-sm btn-circle btn-ghost">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                                                        viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                        <path fill-rule="evenodd"
                                                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                            clip-rule="evenodd" />
                                                    </svg>
                                                </button>
                                                <div tabindex="0"
                                                    class="dropdown-content z-[100] card compact shadow bg-base-200 rounded-box w-72">
                                                    <div class="card-body">
                                                        <h3 class="card-title text-primary">{{ course.name }}</h3>
                                                        <div class="text-sm">
                                                            <div class="grid grid-cols-2 gap-2">
                                                                <div>
                                                                    <span class="font-bold">القسم:</span>
                                                                    <div class="badge badge-primary mt-1">{{
                                                                        course.department || 'غير محدد' }}</div>
                                                                </div>
                                                                <div>
                                                                    <span class="font-bold">الأجزاء:</span>
                                                                    <div class="badge badge-secondary mt-1">{{
                                                                        course.parts?.length || 0 }}</div>
                                                                </div>
                                                                <div>
                                                                    <span class="font-bold">الحلقات:</span>
                                                                    <div class="badge badge-accent mt-1">{{
                                                                        getEpisodeCount(course) }}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="card-actions justify-end mt-2">
                                                            <button class="btn btn-primary btn-sm"
                                                                @click="showCourseDetails(course)">
                                                                عرض التفاصيل
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="mt-8">
                <h2 class="text-xl font-bold mb-4">إجراءات سريعة</h2>
                <div class="flex flex-wrap gap-2">
                    <NuxtLink to="/admin/users" class="btn btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path
                                d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                        إدارة طالب
                    </NuxtLink>
                    <NuxtLink to="/admin/courses" class="btn btn-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path
                                d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                        إدارة الدورات
                    </NuxtLink>
                    <button class="btn btn-accent" @click="refreshStats">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                clip-rule="evenodd" />
                        </svg>
                        تحديث الإحصائيات
                    </button>

                    <!-- New Dropdown Menu -->
                    <div class="dropdown dropdown-end">
                        <div tabindex="0" role="button" class="btn btn-info m-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z"
                                    clip-rule="evenodd" />
                            </svg>
                            المزيد من الخيارات
                        </div>
                        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52">
                            <li><a @click="showSystemSettings">إعدادات النظام</a></li>
                            <li><a @click="showNotifications">إشعارات طالب</a></li>
                            <li><a @click="showBackupOptions">النسخ الاحتياطي</a></li>
                            <li><a @click="showLogs">سجلات النظام</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- Course Details Modal -->
        <dialog class="modal" :class="{ 'modal-open': showCourseModal }">
            <div class="modal-box w-11/12 max-w-2xl bg-base-100 rounded-lg shadow-2xl">
                <div class="flex justify-between items-center border-b pb-4 mb-6">
                    <h3 class="font-bold text-2xl text-primary">تفاصيل الدورة</h3>
                    <button class="btn btn-sm btn-circle btn-ghost hover:bg-base-200"
                        @click="showCourseModal = false">✕</button>
                </div>
                <div v-if="selectedCourse" class="space-y-6">
                    <div class="bg-base-200 p-4 rounded-lg">
                        <h4 class="text-lg font-bold mb-2">{{ selectedCourse.name }}</h4>
                        <p><span class="font-semibold">القسم:</span> {{ selectedCourse.department || 'غير محدد' }}</p>
                        <p><span class="font-semibold">عدد الأجزاء:</span> {{ selectedCourse.parts?.length || 0 }}</p>
                        <p><span class="font-semibold">إجمالي الحلقات:</span> {{ getEpisodeCount(selectedCourse) }}</p>
                    </div>

                    <div v-if="selectedCourse.parts && selectedCourse.parts.length > 0">
                        <h4 class="text-lg font-bold mb-2">الأجزاء والحلقات</h4>
                        <div class="collapse collapse-arrow bg-base-200 mb-2"
                            v-for="(part, index) in selectedCourse.parts" :key="index">
                            <input type="checkbox" />
                            <div class="collapse-title text-medium font-medium">
                                {{ part.name || `الجزء ${index + 1}` }}
                                <span class="badge badge-primary ml-2">{{ part.episodes?.length || 0 }} حلقة</span>
                            </div>
                            <div class="collapse-content">
                                <ul v-if="part.episodes && part.episodes.length > 0"
                                    class="list-disc list-inside space-y-1">
                                    <li v-for="(episode, eIndex) in part.episodes" :key="eIndex">
                                        {{ episode.name || `الحلقة ${eIndex + 1}` }}
                                    </li>
                                </ul>
                                <p v-else class="text-sm opacity-70">لا توجد حلقات</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-action pt-4">
                    <button class="btn btn-primary hover:bg-primary-focus"
                        @click="showCourseModal = false">إغلاق</button>
                </div>
            </div>
        </dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from '#imports'
import { useAdminApi } from '~/composables/useAdminApi'
import { useToast } from '~/composables/useToast'
import type { Course, User } from '~/types/admin'

// State
const isLoading = ref(false)
const users = ref<User[]>([])
const courses = ref<Course[]>([])
const recentUsers = ref<User[]>([])
const recentCourses = ref<Course[]>([])
const lastActivity = ref<Date | null>(null)
const { toast, showToast } = useToast()

// Course details modal state
const showCourseModal = ref(false)
const selectedCourse = ref<Course | null>(null)

// Initialize API
const adminApi = useAdminApi()

// Update error handler
const handleApiError = (error: unknown, defaultMessage: string) => {
    console.error(defaultMessage, error)
    if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status: number; data?: { message?: string } } }
        const errorMessage = axiosError.response?.data?.message || defaultMessage

        if (axiosError.response?.status === 401) {
            // If unauthorized, the middleware will handle redirection
            showToast('غير مصرح للوصول', 'error')
        } else if (axiosError.response?.status === 429) {
            showToast('تم تجاوز عدد المحاولات المسموح به', 'error')
        } else if (axiosError.response?.status === 404) {
            showToast('العنصر غير موجود', 'error')
        } else {
            showToast(errorMessage, 'error')
        }
    } else if (error && typeof error === 'object' && 'request' in error) {
        showToast('خطأ في الاتصال بالخادم', 'error')
    } else {
        showToast(defaultMessage, 'error')
    }
}

// Fetch data
async function fetchData() {
    isLoading.value = true
    try {
        // Fetch users and courses in parallel
        const [usersResponse, coursesResponse] = await Promise.all([
            adminApi.getUsers(),
            adminApi.getCourses()
        ])

        users.value = usersResponse.data
        courses.value = coursesResponse.data

        // Get recent users and courses
        recentUsers.value = [...users.value]
            .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
            .slice(0, 5)

        recentCourses.value = [...courses.value].slice(0, 5)

        // Update last activity timestamp
        lastActivity.value = new Date()
    } catch (error) {
        handleApiError(error, 'فشل في تحميل البيانات')
    } finally {
        isLoading.value = false
    }
}

// Helper to count episodes in a course
function getEpisodeCount(course: Course): number {
    if (!course.parts) return 0

    return course.parts.reduce((total, part) => {
        return total + (part.episodes?.length || 0)
    }, 0)
}

// Compute stats
const stats = computed(() => {
    const totalUsers = users.value.length
    const activeUsers = users.value.filter((user: User) => user.isActive).length
    const adminUsers = users.value.filter((user: User) => user.isAdmin).length
    const totalCourses = courses.value.length

    let totalParts = 0
    let totalEpisodes = 0

    courses.value.forEach((course: Course) => {
        if (course.parts) {
            totalParts += course.parts.length

            course.parts.forEach((part) => {
                if (part.episodes) {
                    totalEpisodes += part.episodes.length
                }
            })
        }
    })

    // Format last activity
    const lastActivityFormatted = lastActivity.value ?
        new Intl.DateTimeFormat('ar-SA', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(lastActivity.value) : 'غير متوفر'

    // Calculate relative time
    let lastActivityRelative = 'غير متوفر'
    if (lastActivity.value) {
        const now = new Date()
        const diffMs = now.getTime() - lastActivity.value.getTime()
        const diffMins = Math.floor(diffMs / 60000)

        if (diffMins < 1) {
            lastActivityRelative = 'الآن'
        } else if (diffMins < 60) {
            lastActivityRelative = `منذ ${diffMins} دقيقة`
        } else {
            const diffHours = Math.floor(diffMins / 60)
            if (diffHours < 24) {
                lastActivityRelative = `منذ ${diffHours} ساعة`
            } else {
                const diffDays = Math.floor(diffHours / 24)
                lastActivityRelative = `منذ ${diffDays} يوم`
            }
        }
    }

    return {
        totalUsers,
        activeUsers,
        adminUsers,
        totalCourses,
        totalParts,
        totalEpisodes,
        lastActivityFormatted,
        lastActivityRelative
    }
})

// Refresh stats
async function refreshStats() {
    showToast('جاري تحديث البيانات...', 'info')
    await fetchData()
    showToast('تم تحديث البيانات بنجاح', 'success')
}

// Lifecycle
onMounted(async () => {
    await fetchData()
})

// At the bottom of the script setup section, add these new functions:
function showSystemSettings() {
    showToast('سيتم تنفيذ هذه الميزة قريبًا', 'info')
}

function showNotifications() {
    showToast('سيتم تنفيذ هذه الميزة قريبًا', 'info')
}

function showBackupOptions() {
    showToast('سيتم تنفيذ هذه الميزة قريبًا', 'info')
}

function showLogs() {
    showToast('سيتم تنفيذ هذه الميزة قريبًا', 'info')
}

function showCourseDetails(course: Course) {
    selectedCourse.value = course
    showCourseModal.value = true
}

// After the existing computed section, add this computed property for departments
// In your script section add:
interface Department {
    name: string;
    courseCount: number;
    episodeCount: number;
}

const departments = computed(() => {
    // Group courses by department and count them
    const deptMap = new Map<string, Department>()

    courses.value.forEach((course: Course) => {
        const deptName = course.department || 'غير مصنف'

        if (!deptMap.has(deptName)) {
            deptMap.set(deptName, {
                name: deptName,
                courseCount: 0,
                episodeCount: 0
            })
        }

        const dept = deptMap.get(deptName)!
        dept.courseCount++
        dept.episodeCount += getEpisodeCount(course)
    })

    return Array.from(deptMap.values())
})

// Add these new functions
function viewDepartmentCourses(department: Department) {
    showToast(`سيتم عرض دورات قسم ${department.name} قريباً`, 'info')
}

function editDepartment(department: Department) {
    showToast(`سيتم تنفيذ تعديل قسم ${department.name} قريباً`, 'info')
}
</script>