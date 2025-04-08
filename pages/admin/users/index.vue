<template>
    <div class="bg-base-100 min-h-screen p-4" dir="rtl">
        <!-- Admin Dashboard -->
        <div class="container mx-auto">
            <!-- Header -->
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold">إدارة المستخدمين</h1>
                <button class="btn btn-primary" @click="showNewUserModal = true">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                            clip-rule="evenodd" />
                    </svg>
                    إضافة مستخدم جديد
                </button>
            </div>

            <!-- Search Bar -->
            <div class="mb-6">
                <div class="form-control f;e">
                    <div class="input-group flex">
                        <input v-model="searchQuery" type="text" placeholder="البحث عن المستخدمين..."
                            class="input input-bordered w-full" />
    
                    </div>
                </div>
            </div>

            <!-- Users Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="user in filteredUsers" :key="user.id"
                    class="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
                    <div class="card-body">
                        <div class="flex justify-between items-center mb-2">
                            <h2 class="card-title text-lg">{{ user.username }}</h2>
                            <div class="dropdown dropdown-end">
                                <label tabindex="0" class="btn btn-sm btn-ghost btn-circle">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                        fill="currentColor">
                                        <path
                                            d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                    </svg>
                                </label>
                                <ul tabindex="0"
                                    class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                    <li><a @click="editUser(user)">تعديل</a></li>
                                    <li><a @click="deleteUser(user)" class="text-error">حذف</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="flex gap-2 mb-2">
                            <div class="badge badge-primary">رمز التفعيل: {{ user.code }}</div>
                            <div v-if="user.isAdmin" class="badge badge-secondary">مسؤول</div>
                        </div>
                        <div class="text-sm">
                            <span class="font-semibold">الدورات:</span>
                            <div class="flex flex-wrap gap-1 mt-1">
                                <span v-for="courseId in user.courses" :key="courseId" class="badge badge-secondary">
                                    {{ getCourseName(courseId) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- New User Modal -->
            <dialog class="modal" :class="{ 'modal-open': showNewUserModal }">
                <div class="p-6 w-11/12 max-w-2xl bg-base-100 rounded-lg shadow-2xl">
                    <div class="flex justify-between items-center border-b pb-4 mb-6">
                        <h3 class="font-bold text-2xl text-primary">إنشاء مستخدم جديد</h3>
                        <button class="btn btn-sm btn-circle btn-ghost hover:bg-base-200"
                            @click="showNewUserModal = false">✕</button>
                    </div>
                    <form @submit.prevent="createUser" class="space-y-6">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text text-base font-medium mb-2">اسم المستخدم</span>
                            </label>
                            <input v-model="newUser.username" type="text"
                                class="input input-bordered input-primary w-full focus:ring-2 focus:ring-primary/20"
                                placeholder="ادخل اسم المستخدم" required />
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text text-base font-medium mb-2">الدورات</span>
                            </label>
                            <div class="dropdown w-full">
                                <div tabindex="0" role="button"
                                    class="btn btn-outline w-full justify-between hover:bg-base-200 h-12 text-base">
                                    <span>{{ newUser.courses.length > 0 ? newUser.courses.length + ' دورات مختارة' :
                                        'اختر الدورات' }}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                        fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <ul tabindex="0"
                                    class="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-full max-h-[300px] overflow-y-auto border border-base-300 mt-2 absolute top-full left-0">
                                    <li v-for="course in availableCourses" :key="course.id">
                                        <label class="cursor-pointer hover:bg-base-200 p-3 flex rounded-lg w-full">
                                            <div class="flex items-center gap-2 w-full">
                                                <input type="checkbox" class="checkbox checkbox-primary ml-2 h-5 w-5"
                                                    :checked="newUser.courses.includes(course.id)"
                                                    @change="toggleCourse(course.id, newUser.courses)" />
                                                <div class="flex content-between w-full">

                                                    <h1 class="flex-1 text-right text-base">{{ course.name }}</h1>
                                                    <div class="badge badge-primary mt-1">{{ course.department }}</div>
                                                </div>
                                            </div>
                                        </label>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="modal-action pt-4">
                            <button type="button" class="btn btn-ghost hover:bg-base-200"
                                @click="showNewUserModal = false">إلغاء</button>
                            <button type="submit" class="btn btn-primary hover:bg-primary-focus"
                                :disabled="isCreatingUser">
                                <span v-if="isCreatingUser" class="loading loading-spinner loading-sm ml-1"></span>
                                إنشاء
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>

            <!-- Generated Code Modal -->
            <dialog class="modal" :class="{ 'modal-open': showGeneratedCodeModal }">
                <div class="modal-box w-11/12 max-w-md bg-base-100 rounded-lg shadow-2xl">
                    <div class="flex justify-between items-center border-b pb-4 mb-6">
                        <h3 class="font-bold text-2xl text-success">تم إنشاء المستخدم بنجاح</h3>
                        <button class="btn btn-sm btn-circle btn-ghost hover:bg-base-200"
                            @click="showGeneratedCodeModal = false">✕</button>
                    </div>
                    <div class="bg-base-200 p-6 rounded-lg">
                        <p class="mb-4 text-lg font-medium">يرجى حفظ رمز التفعيل:</p>
                        <div class="bg-base-300 p-6 rounded-lg text-center">
                            <div class="text-3xl font-mono font-bold text-primary mb-4 select-all">
                                {{ generatedCode }}
                            </div>
                            <button class="btn btn-outline btn-primary hover:bg-primary/10"
                                @click="copyToClipboard(generatedCode)">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                    <path
                                        d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                </svg>
                                نسخ الرمز
                            </button>
                        </div>
                    </div>
                    <div class="modal-action pt-4">
                        <button class="btn btn-primary hover:bg-primary-focus"
                            @click="showGeneratedCodeModal = false">تم</button>
                    </div>
                </div>
            </dialog>

            <!-- Edit User Modal -->
            <dialog class="modal" :class="{ 'modal-open': showEditUserModal }">
                <div class="p-6 w-11/12 max-w-2xl bg-base-100 rounded-lg shadow-2xl">
                    <div class="flex justify-between items-center border-b pb-4 mb-6">
                        <h3 class="font-bold text-2xl text-primary mb-2">تعديل المستخدم</h3>
                        <button class="btn btn-sm btn-circle btn-ghost hover:bg-base-200"
                            @click="showEditUserModal = false">✕</button>
                    </div>
                    <form v-if="editingUser" @submit.prevent="updateUser" class="space-y-6">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text text-base font-medium mb-2">اسم المستخدم</span>
                            </label>
                            <input v-model="editingUser.username" type="text"
                                class="input input-bordered input-primary w-full focus:ring-2 focus:ring-primary/20"
                                placeholder="ادخل اسم المستخدم" required />
                        </div>
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text text-base font-medium  mb-2">الدورات</span>
                            </label>
                            <div class="dropdown w-full">
                                <div tabindex="0" role="button"
                                    class="btn btn-outline w-full justify-between hover:bg-base-200 h-12 text-base">
                                    <span>{{ dropdownText }}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                        fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <ul tabindex="0"
                                    class="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-full max-h-[300px] overflow-y-auto border border-base-300 mt-2 absolute top-full left-0">
                                    <li v-for="course in availableCourses" :key="course.id">
                                        <label class="cursor-pointer hover:bg-base-200 p-3 flex rounded-lg w-full">
                                            <div class="flex items-center gap-2 w-full">
                                                <input type="checkbox" class="checkbox checkbox-primary ml-2 h-5 w-5"
                                                    :checked="editingUser.courses.includes(course.id)"
                                                    @change="toggleCourse(course.id, editingUser.courses)" />
                                                <div class="flex content-between w-full">
                                                    <h1 class="flex-1 text-right text-base">{{ course.name }}</h1>
                                                    <div class="badge badge-primary mt-1">{{ course.department }}</div>
                                                </div>
                                            </div>
                                        </label>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <!-- Admin toggle -->
                        <div class="form-control">
                            <label class="label cursor-pointer">
                                <span class="label-text text-base font-medium">صلاحيات المسؤول</span>
                                <input type="checkbox" v-model="editingUser.isAdmin" class="toggle toggle-primary" />
                            </label>
                            <p class="text-sm text-warning mt-1">
                                تمنح هذه الصلاحية للمستخدم القدرة على الوصول إلى لوحة التحكم وإدارة المحتوى.
                            </p>
                        </div>

                        <div class="modal-action pt-4">
                            <button type="button" class="btn btn-ghost hover:bg-base-200"
                                @click="showEditUserModal = false">إلغاء</button>
                            <button type="submit" class="btn btn-primary hover:bg-primary-focus"
                                :disabled="isUpdatingUser">
                                <span v-if="isUpdatingUser" class="loading loading-spinner loading-sm ml-1"></span>
                                تحديث
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>

            <!-- Delete User Modal -->
            <dialog class="modal" :class="{ 'modal-open': showDeleteUserModal }">
                <div class="modal-box w-11/12 max-w-md bg-base-100 rounded-lg shadow-2xl">
                    <div class="flex justify-between items-center border-b pb-4 mb-6">
                        <h3 class="font-bold text-2xl text-error">حذف المستخدم</h3>
                        <button class="btn btn-sm btn-circle btn-ghost hover:bg-base-200"
                            @click="showDeleteUserModal = false">✕</button>
                    </div>
                    <div class="space-y-4">
                        <p class="text-lg">هل أنت متأكد من حذف المستخدم "<span class="font-semibold text-primary">{{
                            deletingUser?.username }}</span>"؟</p>
                        <p class="text-sm text-error">لا يمكن التراجع عن هذا الإجراء.</p>
                    </div>
                    <div class="modal-action pt-4">
                        <button class="btn btn-ghost hover:bg-base-200"
                            @click="showDeleteUserModal = false">إلغاء</button>
                        <button class="btn btn-error hover:bg-error-focus" @click="confirmDeleteUser"
                            :disabled="isDeletingUser">
                            <span v-if="isDeletingUser" class="loading loading-spinner loading-sm ml-1"></span>
                            حذف
                        </button>
                    </div>
                </div>
            </dialog>

            <!-- Toast Notification -->
            <div v-if="toast.show" class="toast toast-start toast-bottom z-[100]">
                <div :class="`alert alert-${toast.type}`">
                    <span>{{ toast.message }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from '#imports'
import axios from 'axios'
import { useUserStore } from '~/stores/auth'

// Types
interface User {
    id: string;
    username: string;
    code: string;
    courses: string[];
    createdAt: number;
    isActive: boolean;
    isAdmin?: boolean;
}

interface Course {
    id: string;
    name: string;
    department?: string;
    parts?: any[];
}

interface LoginResponse {
    success: boolean;
    message: string;
}

// Create axios instance with default config
const api = axios.create({
    baseURL: '/api/admin',
    validateStatus: (status: number) => status < 500
})

// State
const users = ref<User[]>([])
const availableCourses = ref<Course[]>([])
const searchQuery = ref('')
const showNewUserModal = ref(false)
const showEditUserModal = ref(false)
const showDeleteUserModal = ref(false)
const showGeneratedCodeModal = ref(false)
const generatedCode = ref('')
const isCreatingUser = ref(false)
const isUpdatingUser = ref(false)
const isDeletingUser = ref(false)

const newUser = ref({
    username: '',
    courses: [] as string[],
    isAdmin: false
})

const editingUser = ref<User | null>(null)
const deletingUser = ref<User | null>(null)

// Toast notification
const toast = ref({ show: false, message: '', type: 'success' })

const userStore = useUserStore()

const showToast = (message: string, type = 'success') => {
    const arabicMessages: Record<string, string> = {
        'User created successfully': 'تم إنشاء المستخدم بنجاح',
        'User updated successfully': 'تم تحديث المستخدم بنجاح',
        'User deleted successfully': 'تم حذف المستخدم بنجاح',
        'Failed to create user': 'فشل في إنشاء المستخدم',
        'Failed to update user': 'فشل في تحديث المستخدم',
        'Failed to delete user': 'فشل في حذف المستخدم',
        'Failed to fetch users': 'فشل في جلب المستخدمين',
        'Failed to fetch courses': 'فشل في جلب الدورات',
        'Invalid password': 'كلمة المرور غير صحيحة',
        'Network error': 'خطأ في الاتصال بالخادم'
    }
    toast.value = { show: true, message: arabicMessages[message] || message, type }
    setTimeout(() => {
        toast.value.show = false
    }, 3000)
}

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

// Methods
async function fetchUsers() {
    try {
        const params = searchQuery.value ? { search: searchQuery.value } : {}
        const { data } = await api.get<User[]>('/users', { params })
        users.value = data
    } catch (error) {
        handleApiError(error, 'Failed to fetch users')
    }
}

async function fetchCourses() {
    try {
        const { data } = await api.get<Course[]>('/courses')
        availableCourses.value = Array.isArray(data) ? data : [data]
    } catch (error) {
        handleApiError(error, 'Failed to fetch courses')
    }
}

async function createUser() {
    if (!newUser.value.username || !newUser.value.courses.length) return

    isCreatingUser.value = true
    try {
        const { data } = await api.post<User>('/users/create', {
            username: newUser.value.username,
            courses: newUser.value.courses,
            isAdmin: newUser.value.isAdmin
        })
        users.value.push(data)
        generatedCode.value = data.code
        showGeneratedCodeModal.value = true
        newUser.value = { username: '', courses: [], isAdmin: false }
        showNewUserModal.value = false
        showToast('User created successfully')
    } catch (error) {
        handleApiError(error, 'Failed to create user')
    } finally {
        isCreatingUser.value = false
    }
}

async function updateUser() {
    if (!editingUser.value) return

    isUpdatingUser.value = true
    try {
        const { data } = await api.put<User>(`/users/${editingUser.value.id}`, {
            username: editingUser.value.username,
            courses: editingUser.value.courses,
            isAdmin: editingUser.value.isAdmin
        })

        const index = users.value.findIndex((u: User) => u.id === editingUser.value?.id)
        if (index !== -1) {
            users.value[index] = data
        }
        showEditUserModal.value = false
        showToast('User updated successfully')
    } catch (error) {
        handleApiError(error, 'Failed to update user')
    } finally {
        isUpdatingUser.value = false
    }
}

async function confirmDeleteUser() {
    if (!deletingUser.value) return

    isDeletingUser.value = true
    try {
        await api.delete(`/users/${deletingUser.value.id}`)
        users.value = users.value.filter((u: User) => u.id !== deletingUser.value?.id)
        showDeleteUserModal.value = false
        showToast('User deleted successfully')
    } catch (error) {
        handleApiError(error, 'Failed to delete user')
    } finally {
        isDeletingUser.value = false
        deletingUser.value = null
    }
}

// Helper functions
function getCourseName(courseId: string): string {
    const course = availableCourses.value.find((c: Course) => c.id === courseId)
    return course?.name || courseId
}

function toggleCourse(courseId: string, coursesList: string[]) {
    const index = coursesList.indexOf(courseId)
    if (index === -1) {
        coursesList.push(courseId)
    } else {
        coursesList.splice(index, 1)
    }
}

async function copyToClipboard(text: string) {
    try {
        await navigator.clipboard.writeText(text)
        showToast('تم نسخ الرمز بنجاح')
    } catch (err) {
        showToast('فشل في نسخ الرمز', 'error')
    }
}

function editUser(user: User) {
    editingUser.value = { ...user }
    showEditUserModal.value = true
}

function deleteUser(user: User) {
    deletingUser.value = user
    showDeleteUserModal.value = true
}

// Watch for search query changes
watch(searchQuery, () => {
    if (userStore.isLoggedIn) {
        fetchUsers()
    }
})

// Lifecycle
onMounted(async () => {
    try {
        await Promise.all([fetchUsers(), fetchCourses()])
    } catch (error) {
        handleApiError(error, 'فشل في تحميل البيانات')
    }
})

// Computed properties
const filteredUsers = computed(() => {
    if (!searchQuery.value) return users.value
    const query = searchQuery.value.toLowerCase()
    return users.value.filter(
        (user: User) =>
            user.username.toLowerCase().includes(query) ||
            user.code.toLowerCase().includes(query)
    )
})

const dropdownText = computed(() => {
    if (!editingUser.value) return 'اختر الدورات'
    return editingUser.value.courses.length > 0
        ? `${editingUser.value.courses.length} دورات مختارة`
        : 'اختر الدورات'
})

</script>