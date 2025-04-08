<template>
  <div class="w-full">
    <div v-if="!videoUploaded" class="mb-4">
      <label class="block text-sm font-medium mb-2">Video</label>
      <div class="flex flex-col md:flex-row gap-2">
        <input type="file" accept="video/*" class="file-input file-input-bordered w-full" @change="handleFileChange"
          :disabled="uploading" />
        <button type="button" class="btn btn-primary" @click="uploadSelectedFile" :disabled="uploading || !selectedFile"
          :class="{ 'btn-disabled': !selectedFile || uploading }">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
              clip-rule="evenodd" />
          </svg>
          Upload Video
        </button>
      </div>
      <p v-if="selectedFile" class="text-xs text-info mt-1">Selected: {{ selectedFile.name }}</p>
    </div>

    <div v-if="videoUploaded" class="mb-4 p-4 bg-success/10 rounded-lg">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-medium text-success">Video uploaded successfully!</h3>
          <p class="text-xs mt-1">Your video is now available for viewing</p>
        </div>
        <!-- oben in ifram in pupup -->
      </div>
    </div>

    <div v-if="!videoUploaded" class="mb-4">
      <label class="block text-sm font-medium mb-2">Custom Thumbnail (Optional)</label>
      <input type="file" accept="image/*" class="file-input file-input-bordered w-full" @change="handleThumbnailChange"
        :disabled="uploading" />
    </div>

    <div v-if="uploading" class="mt-4 p-4 bg-base-200 rounded-lg">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm font-medium">Uploading video...</span>
        <span class="text-sm">{{ progress }}%</span>
      </div>
      <progress class="progress progress-primary w-full" :value="progress" max="100"></progress>
      <p class="text-xs text-center mt-2 text-base-content/70">Please do not close this window during upload</p>
    </div>

    <div v-if="isEncoding" class="mt-4 p-4 bg-base-200 rounded-lg">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm font-medium">Processing video...</span>
        <span class="text-sm">{{ encodingProgress }}%</span>
      </div>
      <progress class="progress progress-warning w-full" :value="encodingProgress" max="100"></progress>
      <p class="text-xs text-center mt-2 text-base-content/70">
        Transcoding video. This may take several minutes depending on the video size and format.
      </p>
    </div>

    <div v-if="error" class="alert alert-error mt-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd" />
      </svg>
      <span>{{ error }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Upload } from 'tus-js-client'

interface UploadResponse {
  videoId: string
  signature: string
  expirationTime: string
}

interface VideoStatus {
  guid: string
  title: string
  status: number
  statusText: string
  encodeProgress: number
}

// In Nuxt, wir können diese Macros direkt verwenden
const props = defineProps<{
  courseId: string
  partId: string
  episodeId: string
}>()

const emit = defineEmits<{
  (e: 'success', videoUrl: string): void
  (e: 'error', error: string): void
}>()

const uploading = ref(false)
const progress = ref(0)
const error = ref('')
const selectedFile = ref<File | null>(null)
const customThumbnail = ref<File | null>(null)
const videoUploaded = ref(false)
const videoUrl = ref('')
const encodingProgress = ref(0)
const isEncoding = ref(false)

function handleThumbnailChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files?.length) return
  customThumbnail.value = target.files[0]
}

async function uploadThumbnail(videoId: string) {
  if (!customThumbnail.value) {
    return
  }

  const formData = new FormData()
  formData.append('thumbnail', customThumbnail.value)

  try {
    const response = await fetch(`/api/admin/upload/thumbnail/${videoId}`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Failed to upload thumbnail')
    }
  } catch (err) {
    console.error('Thumbnail upload failed:', err)
  }
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files?.length) return

  const file = target.files[0]
  const fileName = file.name.toLowerCase()

  // Check for problematic formats that might cause transcoding issues
  if (fileName.endsWith('.wmv') || fileName.endsWith('.flv') || fileName.endsWith('.mov')) {
    error.value = 'This video format may cause transcoding issues. Please convert to MP4 before uploading.'
    return
  }

  // Check file size (100MB max)
  if (file.size > 100 * 1024 * 1024) {
    error.value = 'Video file is too large (max 100MB). Please compress or split your video.'
    return
  }

  selectedFile.value = file
  error.value = '' // Clear any previous errors
}

function uploadSelectedFile() {
  if (!selectedFile.value) {
    error.value = 'Please select a video file first'
    return
  }
  startUpload(selectedFile.value)
}

async function checkVideoStatus(videoId: string): Promise<boolean> {
  try {
    isEncoding.value = true
    const response = await fetch(`/api/admin/upload/status/${videoId}`)
    if (!response.ok) {
      throw new Error('Failed to check video status')
    }

    const status = await response.json() as VideoStatus

    if (status.status === 4) { // Failed 
      throw new Error('Video transcoding failed: ' + status.statusText)
    }

    if (status.status === 5) { // Unknown status
      throw new Error('Video processing has an unknown status: ' + status.statusText)
    }

    if (status.status === 3) { // Success
      return true
    }

    // Status 1 (Queued) or 2 (Processing) or any other unhandled status
    encodingProgress.value = status.encodeProgress || 0

    // Continue checking
    await new Promise(resolve => setTimeout(resolve, 3000))
    return await checkVideoStatus(videoId)
  } catch (err: any) {
    console.error('Status check error:', err)
    error.value = err.message || 'Video processing failed'
    emit('error', error.value)
    isEncoding.value = false
    return false
  }
}

async function startUpload(file: File) {
  uploading.value = true
  error.value = ''
  progress.value = 0
  encodingProgress.value = 0

  try {
    // Get upload credentials
    const response = await fetch('/api/admin/upload')
    if (!response.ok) {
      throw new Error('Failed to get upload credentials')
    }
    const { videoId, signature, expirationTime } = await response.json() as UploadResponse

    // Create upload instance
    const upload = new Upload(file, {
      endpoint: 'https://video.bunnycdn.com/tusupload',
      headers: {
        'AuthorizationSignature': signature,
        'AuthorizationExpire': expirationTime,
        'LibraryId': '399731',
        'VideoId': videoId,
      },
      metadata: {
        filetype: file.type,
        title: `${props.courseId}_${props.partId}_${props.episodeId}`,
      },
      onError(err: Error) {
        error.value = err.message || 'Upload failed'
        emit('error', error.value)
        uploading.value = false
      },
      onProgress(bytesUploaded: number, bytesTotal: number) {
        progress.value = Math.round((bytesUploaded / bytesTotal) * 100)
      },
      async onSuccess() {
        try {
          uploading.value = false

          // Check video transcoding status
          const transcodingSuccess = await checkVideoStatus(videoId)

          if (!transcodingSuccess) {
            throw new Error('Video processing failed')
          }

          const newVideoUrl = `https://iframe.mediadelivery.net/embed/399731/${videoId}`
          videoUrl.value = newVideoUrl

          await uploadThumbnail(videoId)

          // Update the episode with video information
          const updateResponse = await fetch(
            `/api/admin/courses/${props.courseId}/parts/${props.partId}/episodes/${props.episodeId}/video`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                videoId,
                videoUrl: newVideoUrl,
              })
            }
          )

          if (!updateResponse.ok) {
            throw new Error('Failed to update episode')
          }

          videoUploaded.value = true
          emit('success', newVideoUrl)
          selectedFile.value = null
        } catch (err: any) {
          error.value = err.message || 'Failed to update episode with video information'
          emit('error', error.value)
        } finally {
          uploading.value = false
          isEncoding.value = false
        }
      }
    })

    // Start the upload
    upload.start()
  } catch (err: any) {
    error.value = err.message || 'Failed to initialize upload'
    emit('error', error.value)
    uploading.value = false
    isEncoding.value = false
  }
}
</script>