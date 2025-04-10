<template>
  <div class="bg-base-100 min-h-screen">
    <!-- Admin Dashboard -->
    <div class="container mx-auto p-4">
      <!-- <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Course Management</h1>
        <button class="btn btn-primary" @click="showNewCourseModal = true">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clip-rule="evenodd" />
          </svg>
          Add New Course
        </button>
      </div> -->

      <!-- Course List or Detail View -->
      <div v-if="!selectedCourse">
        <!-- Course List Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          <div v-for="course in courses" :key="course.id"
            class="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 hover:border-primary">
            <div class="card-body">
              <h2 class="card-title">{{ course.name }}</h2>
              <div class="badge mr-2 absolute -top-2 left-2 border-none"
                :style="{ backgroundColor: course?.backgroundColor }">
                {{ course.department }}
              </div>
              <p class="text-sm mt-2">
                {{ course?.parts?.length }} جزء,
                {{course?.parts?.reduce((acc, part) => acc + part.episodes.length, 0)}} حلقة
              </p>
              <div class="card-actions justify-end mt-4">
                <button class="btn btn-sm btn-primary" @click="selectCourse(course)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  إدارة المحتوى
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col">
        <!-- Course Header with Back Button -->
        <div class="flex items-center mb-6 bg-base-200 p-4 rounded-lg">
          <button class="btn btn-circle btn-ghost mr-4" @click="selectedCourse = null">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h2 class="text-2xl font-bold">{{ selectedCourse.name }}</h2>
            <div class="badge badge-primary mt-1">{{ selectedCourse.department }}</div>
          </div>
        </div>

        <!-- Two Panel Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Left Panel - Parts Navigation -->
          <div class="lg:col-span-3">
            <div class="bg-base-200 rounded-lg p-4 sticky top-4">
              <h3 class="text-lg font-bold mb-4">الأجزاء</h3>

              <!-- Add New Part Form -->
              <form @submit.prevent="createPart" class="mb-4">
                <div class="flex flex-col gap-2">
                  <input v-model="newPart.name" type="text" placeholder="اسم الجزء الجديد"
                    class="input input-bordered w-full" required />
                  <button type="submit" class="btn btn-primary w-full" :disabled="isAddingPart">
                    <span v-if="isAddingPart" class="loading loading-spinner loading-sm mr-1"></span>
                    إضافة جزء
                  </button>
                </div>
              </form>

              <div class="divider"></div>

              <!-- Parts List -->
              <div class="divider mb-2"></div>

              <div v-if="selectedCourse.parts.length === 0" class="p-4 text-center bg-base-300 rounded-lg">
                <p class="text-sm opacity-70">لا توجد أجزاء بعد. أضف الجزء الأول أعلاه.</p>
              </div>

              <ul class="menu w-full gap-1">
                <li v-for="part in selectedCourse.parts" :key="part.id" class="mb-1">
                  <button @click="activePart = part.id"
                    class="flex justify-between items-center py-3 rounded-lg transition-all" :class="{
                      'bg-primary text-primary-content font-medium': activePart === part.id,
                      'hover:bg-base-300': activePart !== part.id
                    }">
                    <div class="flex items-center">
                      <span class="mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                        </svg>
                      </span>
                      <span class="truncate max-w-[120px]">{{ part.name }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="badge badge-sm" :class="{ 'badge-ghost': activePart !== part.id }">
                        {{ part.episodes.length }}
                      </span>
                      <div class="dropdown dropdown-end">
                        <label tabindex="0" class="btn btn-xs btn-ghost btn-circle" @click.stop>
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path
                              d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </label>
                        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32">
                          <li><a @click.stop="renamePart(part)" class="text-primary">إعادة تسمية</a></li>
                          <li><a @click.stop="deletePart(part)" class="text-error">حذف</a></li>
                        </ul>
                      </div>
                    </div>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <!-- Right Panel - Episodes Content -->
          <div class="lg:col-span-9">
            <div v-if="activePart && getActivePart">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold">{{ getActivePart.name }}</h3>
              </div>

              <!-- Add Episode Form -->
              <form @submit.prevent="createEpisode(activePart)" class="mb-6 bg-base-200 p-4 rounded-lg">
                <h4 class="font-medium mb-3">إضافة حلقة جديدة</h4>
                <div class="flex flex-col sm:flex-row gap-3">
                  <input v-model="newEpisode[activePart]" type="text" placeholder="اسم الحلقة"
                    class="input input-bordered flex-1" required />
                  <button type="submit" class="btn btn-secondary" :disabled="isAddingEpisode[activePart]">
                    <span v-if="isAddingEpisode[activePart]" class="loading loading-spinner loading-sm mr-1"></span>
                    إضافة حلقة
                  </button>
                </div>
              </form>

              <!-- Episodes List -->
              <div class="space-y-4">
                <div v-for="episode in getActivePart.episodes" :key="episode.id"
                  class="bg-base-200 p-4 rounded-lg shadow-sm">
                  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div class="flex items-center gap-4">
                      <div class="w-20 h-12 bg-base-300 rounded flex-shrink-0 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-base-content/50" viewBox="0 0 20 20"
                          fill="currentColor">
                          <path fill-rule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm0 4H4v2h1V9zm-1 4h1v2H4v-2z"
                            clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h5 class="font-semibold">{{ episode.name }}</h5>
                        <div class="text-xs text-base-content/70 mt-1">
                          {{ episode.videoId ? 'تم رفع الفيديو' : 'لم يتم رفع فيديو' }}
                        </div>
                      </div>
                    </div>

                    <div class="flex gap-2 items-center">
                      <label class="label cursor-pointer flex gap-2">
                        <span class="label-text">مجاني</span>
                        <input type="checkbox" v-model="episode.isFree" class="toggle toggle-primary toggle-sm"
                          @change="updateEpisodeIsFree(activePart, episode)" />
                      </label>
                      <label class="label cursor-pointer flex gap-2">
                        <span class="label-text">قفل</span>
                        <input type="checkbox" v-model="episode.isLocked" class="toggle toggle-warning toggle-sm"
                          @change="updateEpisodeIsLocked(activePart, episode)" />
                      </label>
                      <div v-if="!episode.videoId" class="ml-4">
                        <VideoUploader :course-id="selectedCourse?.id" :part-id="activePart || ''"
                          :episode-id="episode.id" @success="(videoUrl) => handleVideoUploadEvent(episode, videoUrl)"
                          @error="handleVideoUploadError" />
                      </div>
                      <div v-else class="flex items-center gap-2 ml-4">
                        <!-- <a :href="episode.link" target="_blank" class="btn btn-sm btn-primary btn-outline">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                              clip-rule="evenodd" />
                          </svg>
                          Play
                        </a> -->
                        <button class="btn btn-sm btn-ghost btn-circle" @click="renameEpisode(activePart, episode)">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path
                              d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button class="btn btn-sm btn-ghost btn-circle text-error"
                          @click="deleteEpisode(activePart, episode)">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clip-rule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="flex flex-col items-center justify-center py-16 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-base-content/30 mb-4" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              <h3 class="text-xl font-semibold mb-2">اختر جزءًا</h3>
              <p class="text-base-content/70 max-w-md">
                اختر جزءًا من القائمة على اليسار، أو أنشئ جزءًا جديدًا للبدء.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- New Course Modal -->
      <dialog class="modal" :class="{ 'modal-open': showNewCourseModal }">
        <div class="modal-box">
          <h3 class="font-bold text-lg mb-4">إنشاء دورة جديدة</h3>
          <form @submit.prevent="createCourse">
            <div class="form-control">
              <label class="label">
                <span class="label-text">اسم الدورة</span>
              </label>
              <input v-model="newCourse.name" type="text" class="input input-bordered" required />
            </div>
            <div class="form-control mt-4">
              <label class="label">
                <span class="label-text">القسم</span>
              </label>
              <input v-model="newCourse.department" type="text" class="input input-bordered" required />
            </div>
            <div class="modal-action">
              <button type="button" class="btn" @click="showNewCourseModal = false">إلغاء</button>
              <button type="submit" class="btn btn-primary">إنشاء</button>
            </div>
          </form>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button @click="showNewCourseModal = false">close</button>
        </form>
      </dialog>

      <!-- Rename Part Modal -->
      <dialog class="modal" :class="{ 'modal-open': showRenamePartModal }">
        <div class="modal-box">
          <h3 class="font-bold text-lg mb-4">إعادة تسمية الجزء</h3>
          <form @submit.prevent="confirmRenamePart">
            <div class="form-control">
              <label class="label">
                <span class="label-text">اسم الجزء الجديد</span>
              </label>
              <input v-model="renamePartData.newName" type="text" class="input input-bordered" required />
            </div>
            <div class="modal-action">
              <button type="button" class="btn" @click="cancelRenamePart">إلغاء</button>
              <button type="submit" class="btn btn-primary">إعادة تسمية</button>
            </div>
          </form>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button @click="cancelRenamePart">close</button>
        </form>
      </dialog>

      <!-- Delete Part Confirmation Modal -->
      <dialog class="modal" :class="{ 'modal-open': showDeletePartModal }">
        <div class="modal-box">
          <h3 class="font-bold text-lg mb-4">حذف الجزء</h3>
          <p>هل أنت متأكد أنك تريد حذف "<span class="font-semibold">{{ deletePartData.name }}</span>" وجميع حلقاته؟</p>
          <p class="text-sm text-error mt-2">لا يمكن التراجع عن هذا الإجراء.</p>
          <div class="modal-action">
            <button class="btn" @click="cancelDeletePart">إلغاء</button>
            <button class="btn btn-error" @click="confirmDeletePart">حذف</button>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button @click="cancelDeletePart">close</button>
        </form>
      </dialog>

      <!-- Rename Episode Modal -->
      <dialog class="modal" :class="{ 'modal-open': showRenameEpisodeModal }">
        <div class="modal-box">
          <h3 class="font-bold text-lg mb-4">إعادة تسمية الحلقة</h3>
          <form @submit.prevent="confirmRenameEpisode">
            <div class="form-control">
              <label class="label">
                <span class="label-text">اسم الحلقة الجديد</span>
              </label>
              <input v-model="renameEpisodeData.newName" type="text" class="input input-bordered" required />
            </div>
            <div class="modal-action">
              <button type="button" class="btn" @click="cancelRenameEpisode">إلغاء</button>
              <button type="submit" class="btn btn-primary">إعادة تسمية</button>
            </div>
          </form>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button @click="cancelRenameEpisode">close</button>
        </form>
      </dialog>

      <!-- Delete Episode Confirmation Modal -->
      <dialog class="modal" :class="{ 'modal-open': showDeleteEpisodeModal }">
        <div class="modal-box">
          <h3 class="font-bold text-lg mb-4">حذف الحلقة</h3>
          <p>هل أنت متأكد أنك تريد حذف "<span class="font-semibold">{{ deleteEpisodeData.name }}</span>"؟</p>
          <p class="text-sm text-error mt-2">لا يمكن التراجع عن هذا الإجراء.</p>
          <div class="modal-action">
            <button class="btn" @click="cancelDeleteEpisode">إلغاء</button>
            <button class="btn btn-error" @click="confirmDeleteEpisode">حذف</button>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button @click="cancelDeleteEpisode">close</button>
        </form>
      </dialog>

      <!-- Toast Notification -->
      <div v-if="toast.show" class="toast toast-end toast-bottom z-[100]">
        <div :class="`alert alert-${toast.type}`">
          <span>{{ toast.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from '#imports'
import { useAdminApi } from '~/composables/useAdminApi'
import { useToast } from '~/composables/useToast'
import type { Course, Part, Episode, NewCourse, NewPart, RenamePartData, DeletePartData, RenameEpisodeData, DeleteEpisodeData } from '~/types/admin'

// State
const courses = ref<Course[]>([])
const showNewCourseModal = ref(false)
const selectedCourse = ref<Course | null>(null)
const newCourse = ref<NewCourse>({ name: '', department: '' })
const newPart = ref<NewPart>({ name: '' })
const newEpisode = ref<Record<string, string>>({})
const isAddingPart = ref(false)
const isAddingEpisode = ref<Record<string, boolean>>({})
const activePart = ref<string | null>(null)

// Modal states and data
const showRenamePartModal = ref(false)
const showDeletePartModal = ref(false)
const showRenameEpisodeModal = ref(false)
const showDeleteEpisodeModal = ref(false)

const renamePartData = ref<RenamePartData>({ partId: '', newName: '', oldName: '' })
const deletePartData = ref<DeletePartData>({ partId: '', name: '' })
const renameEpisodeData = ref<RenameEpisodeData>({ partId: '', episodeId: '', newName: '', oldName: '' })
const deleteEpisodeData = ref<DeleteEpisodeData>({ partId: '', episodeId: '', name: '' })

// Initialize composables
const adminApi = useAdminApi()
const { toast, showToast } = useToast()

// Add type definition
interface LoginResponse {
  success: boolean;
  message?: string;
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
async function fetchCourses() {
  try {
    const { data } = await adminApi.getCourses()
    courses.value = Array.isArray(data) ? data : [data]
  } catch (error) {
    handleApiError(error, 'فشل في تحميل البيانات')
  }
}

// Lifecycle
onMounted(async () => {
  try {
    await fetchCourses()
  } catch (error) {
    handleApiError(error, 'فشل في تحميل البيانات')
  }
})

async function createCourse() {
  try {
    const { data } = await adminApi.createCourse(newCourse.value)
    courses.value.push(data)
    newCourse.value = { name: '', department: '' }
    showNewCourseModal.value = false
    showToast('تم إنشاء الدورة بنجاح')
  } catch (error) {
    handleApiError(error, 'فشل في إنشاء الدورة')
  }
}

async function createPart() {
  if (!selectedCourse.value) return

  isAddingPart.value = true
  try {
    const { data } = await adminApi.createPart(selectedCourse.value.id, newPart.value)
    selectedCourse.value.parts.push(data)
    newPart.value = { name: '' }
    activePart.value = data.id

    // Update the course in the main list
    const courseIndex = courses.value.findIndex((c: Course) => c.id === selectedCourse.value?.id)
    if (courseIndex !== -1) {
      courses.value[courseIndex] = { ...selectedCourse.value }
    }
    showToast('تم إنشاء الجزء بنجاح')
  } catch (error) {
    handleApiError(error, 'فشل في إنشاء الجزء')
  } finally {
    isAddingPart.value = false
  }
}

// Create new episode
async function createEpisode(partId: string) {
  if (!selectedCourse.value || !selectedCourse.value.parts) return

  // Initialize if not exists
  if (!isAddingEpisode.value[partId]) {
    isAddingEpisode.value[partId] = false
  }

  isAddingEpisode.value[partId] = true
  try {
    const { data } = await adminApi.createEpisode(selectedCourse.value.id, partId, newEpisode.value[partId], false, false)

    const part = selectedCourse.value.parts.find((p: Part) => p.id === partId)
    if (part) {
      part.episodes.push(data)
      newEpisode.value[partId] = ''

      // Update the course in the main list
      const courseIndex = courses.value.findIndex((c: Course) => c.id === selectedCourse.value?.id)
      if (courseIndex !== -1 && selectedCourse.value) {
        courses.value[courseIndex] = { ...selectedCourse.value }
      }
      showToast('تم إنشاء الحلقة بنجاح')
    }
  } catch (error) {
    handleApiError(error, 'فشل في إنشاء الحلقة')
  } finally {
    isAddingEpisode.value[partId] = false
  }
}

// Handle video upload events
function handleVideoUploadEvent(episode: Episode, videoUrl: string) {
  if (!selectedCourse.value || !activePart.value) return
  handleVideoUploadSuccess(activePart.value, episode.id, videoUrl)
}

function handleVideoUploadSuccess(partId: string, episodeId: string, videoUrl: string) {
  if (!selectedCourse.value || !selectedCourse.value.parts) return

  const part = selectedCourse.value.parts.find((p: Part) => p.id === partId)
  if (!part) return

  const episode = part.episodes.find((e: Episode) => e.id === episodeId)
  if (!episode) return

  episode.link = videoUrl

  // Update the course in the main list
  const courseIndex = courses.value.findIndex((c: Course) => c.id === selectedCourse.value?.id)
  if (courseIndex !== -1 && selectedCourse.value) {
    courses.value[courseIndex] = { ...selectedCourse.value }
  }
  showToast('تم رفع الفيديو بنجاح')
}

// Handle video upload error
function handleVideoUploadError(error: string) {
  console.error('Video upload failed:', error)
  showToast('فشل في رفع الفيديو', 'error')
}

// Select course for editing
function selectCourse(course: Course) {
  selectedCourse.value = { ...course }

  // Auto-select first part if available
  if (course.parts && course.parts.length > 0) {
    activePart.value = course.parts[0].id
  } else {
    activePart.value = null
  }
}

// Part management functions
const renamePart = (part: Part) => {
  renamePartData.value = {
    partId: part.id,
    newName: part.name,
    oldName: part.name
  }
  showRenamePartModal.value = true
}

const cancelRenamePart = () => {
  showRenamePartModal.value = false
  renamePartData.value = { partId: '', newName: '', oldName: '' }
}

const confirmRenamePart = async () => {
  if (!selectedCourse.value || !selectedCourse.value.parts || !renamePartData.value.newName || renamePartData.value.newName === renamePartData.value.oldName) {
    showRenamePartModal.value = false
    return
  }

  try {
    const { data } = await adminApi.renamePart(selectedCourse.value.id, renamePartData.value.partId, renamePartData.value.newName)

    // Update in local state
    const partIndex = selectedCourse.value.parts.findIndex((p: Part) => p.id === renamePartData.value.partId)
    if (partIndex !== -1) {
      selectedCourse.value.parts[partIndex].name = renamePartData.value.newName

      // Update course in main list
      const courseIndex = courses.value.findIndex((c: Course) => c.id === selectedCourse.value?.id)
      if (courseIndex !== -1 && selectedCourse.value) {
        courses.value[courseIndex] = { ...selectedCourse.value }
      }
    }
    showToast('تم إعادة تسمية الجزء بنجاح')
  } catch (error) {
    handleApiError(error, 'فشل في إعادة تسمية الجزء')
  } finally {
    showRenamePartModal.value = false
    renamePartData.value = { partId: '', newName: '', oldName: '' }
  }
}

const deletePart = (part: Part) => {
  deletePartData.value = {
    partId: part.id,
    name: part.name
  }
  showDeletePartModal.value = true
}

const cancelDeletePart = () => {
  showDeletePartModal.value = false
  deletePartData.value = { partId: '', name: '' }
}

const confirmDeletePart = async () => {
  if (!selectedCourse.value || !selectedCourse.value.parts || !deletePartData.value.partId) {
    showDeletePartModal.value = false
    return
  }

  try {
    await adminApi.deletePart(selectedCourse.value.id, deletePartData.value.partId)

    // Remove from local state
    selectedCourse.value.parts = selectedCourse.value.parts.filter((p: Part) => p.id !== deletePartData.value.partId)

    // Update course in main list
    const courseIndex = courses.value.findIndex((c: Course) => c.id === selectedCourse.value?.id)
    if (courseIndex !== -1 && selectedCourse.value) {
      courses.value[courseIndex] = { ...selectedCourse.value }
    }

    // Reset active part if it was the deleted one
    if (activePart.value === deletePartData.value.partId) {
      activePart.value = selectedCourse.value.parts.length > 0 ? selectedCourse.value.parts[0].id : null
    }
    showToast('تم حذف الجزء بنجاح')
  } catch (error) {
    handleApiError(error, 'فشل في حذف الجزء')
  } finally {
    showDeletePartModal.value = false
    deletePartData.value = { partId: '', name: '' }
  }
}

// Episode management functions
const renameEpisode = (partId: string, episode: Episode) => {
  renameEpisodeData.value = {
    partId: partId,
    episodeId: episode.id,
    newName: episode.name,
    oldName: episode.name
  }
  showRenameEpisodeModal.value = true
}

const cancelRenameEpisode = () => {
  showRenameEpisodeModal.value = false
  renameEpisodeData.value = { partId: '', episodeId: '', newName: '', oldName: '' }
}

const confirmRenameEpisode = async () => {
  if (!selectedCourse.value || !selectedCourse.value.parts || !renameEpisodeData.value.newName || renameEpisodeData.value.newName === renameEpisodeData.value.oldName) {
    showRenameEpisodeModal.value = false
    return
  }

  try {
    const { data } = await adminApi.renameEpisode(selectedCourse.value.id, renameEpisodeData.value.partId, renameEpisodeData.value.episodeId, renameEpisodeData.value.newName)

    // Update in local state
    const part = selectedCourse.value.parts.find((p: Part) => p.id === renameEpisodeData.value.partId)
    if (part) {
      const episodeIndex = part.episodes.findIndex((e: Episode) => e.id === renameEpisodeData.value.episodeId)
      if (episodeIndex !== -1) {
        part.episodes[episodeIndex].name = renameEpisodeData.value.newName
      }
    }

    // Update course in main list
    const courseIndex = courses.value.findIndex((c: Course) => c.id === selectedCourse.value?.id)
    if (courseIndex !== -1 && selectedCourse.value) {
      courses.value[courseIndex] = { ...selectedCourse.value }
    }
    showToast('تم إعادة تسمية الحلقة بنجاح')
  } catch (error) {
    handleApiError(error, 'فشل في إعادة تسمية الحلقة')
  } finally {
    showRenameEpisodeModal.value = false
    renameEpisodeData.value = { partId: '', episodeId: '', newName: '', oldName: '' }
  }
}

const deleteEpisode = (partId: string, episode: Episode) => {
  deleteEpisodeData.value = {
    partId: partId,
    episodeId: episode.id,
    name: episode.name
  }
  showDeleteEpisodeModal.value = true
}

const cancelDeleteEpisode = () => {
  showDeleteEpisodeModal.value = false
  deleteEpisodeData.value = { partId: '', episodeId: '', name: '' }
}

const confirmDeleteEpisode = async () => {
  if (!selectedCourse.value || !selectedCourse.value.parts || !deleteEpisodeData.value.episodeId) {
    showDeleteEpisodeModal.value = false
    return
  }

  try {
    await adminApi.deleteEpisode(selectedCourse.value.id, deleteEpisodeData.value.partId, deleteEpisodeData.value.episodeId)

    // Remove from local state
    const part = selectedCourse.value.parts.find((p: Part) => p.id === deleteEpisodeData.value.partId)
    if (part) {
      part.episodes = part.episodes.filter((e: Episode) => e.id !== deleteEpisodeData.value.episodeId)
    }

    // Update course in main list
    const courseIndex = courses.value.findIndex((c: Course) => c.id === selectedCourse.value?.id)
    if (courseIndex !== -1 && selectedCourse.value) {
      courses.value[courseIndex] = { ...selectedCourse.value }
    }
    showToast('تم حذف الحلقة بنجاح')
  } catch (error) {
    handleApiError(error, 'فشل في حذف الحلقة')
  } finally {
    showDeleteEpisodeModal.value = false
    deleteEpisodeData.value = { partId: '', episodeId: '', name: '' }
  }
}

// Episode is free management
function updateEpisodeIsFree(partId: string, episode: Episode) {
  if (!selectedCourse.value || !selectedCourse.value.parts) return

  const part = selectedCourse.value.parts.find((p: Part) => p.id === partId)
  if (!part) return

  const episodeIndex = part.episodes.findIndex((e: Episode) => e.id === episode.id)
  if (episodeIndex !== -1) {
    part.episodes[episodeIndex].isFree = episode.isFree
  }

  // Update course in main list
  const courseIndex = courses.value.findIndex((c: Course) => c.id === selectedCourse.value?.id)
  if (courseIndex !== -1 && selectedCourse.value) {
    courses.value[courseIndex] = { ...selectedCourse.value }
  }

  // Update on the server
  adminApi.updateEpisodeIsFree(selectedCourse.value.id, partId, episode.id, episode.isFree).catch(error => {
    handleApiError(error, 'فشل في تحديث حالة مجانية الحلقة')
  })
}

function updateEpisodeIsLocked(partId: string, episode: Episode) {
  if (!selectedCourse.value || !selectedCourse.value.parts) {
    console.error('No selected course or parts available');
    return;
  }

  const part = selectedCourse.value.parts.find((p: Part) => p.id === partId);
  if (!part) {
    console.error('Part not found:', partId);
    return;
  }

  // Store the current value for potential rollback
  const currentLockValue = episode.isLocked;
  console.log('Updating episode lock status:', {
    courseId: selectedCourse.value.id,
    partId: partId,
    episodeId: episode.id,
    isLocked: currentLockValue
  });

  // Update UI immediately for responsiveness
  const episodeIndex = part.episodes.findIndex((e: Episode) => e.id === episode.id);
  if (episodeIndex !== -1) {
    part.episodes[episodeIndex].isLocked = currentLockValue;
  }

  // Update course in main list
  const courseIndex = courses.value.findIndex((c: Course) => c.id === selectedCourse.value?.id);
  if (courseIndex !== -1 && selectedCourse.value) {
    courses.value[courseIndex] = { ...selectedCourse.value };
  }

  // Update on the server
  try {
    adminApi.updateEpisodeIsLocked(selectedCourse.value.id, partId, episode.id, currentLockValue)
      .then(response => {
        console.log('Lock status update successful:', response);
        // Success toast can be added here if needed
      })
      .catch(error => {
        console.error('Lock status update error:', error);

        // Revert UI change on error
        if (episodeIndex !== -1) {
          part.episodes[episodeIndex].isLocked = !currentLockValue;

          // Also update in main list
          if (courseIndex !== -1 && selectedCourse.value) {
            courses.value[courseIndex] = { ...selectedCourse.value };
          }
        }

        handleApiError(error, 'فشل في تحديث حالة قفل الحلقة');
      });
  } catch (err) {
    console.error('Exception when calling API:', err);
    // Revert UI change on exception
    if (episodeIndex !== -1) {
      part.episodes[episodeIndex].isLocked = !currentLockValue;
    }
    showToast('فشل في تحديث حالة قفل الحلقة', 'error');
  }
}

// Computed property to get the active part
const getActivePart = computed(() => {
  if (!selectedCourse.value || !selectedCourse.value.parts || !activePart.value) return null
  return selectedCourse.value.parts.find((p: Part) => p.id === activePart.value)
})
</script>