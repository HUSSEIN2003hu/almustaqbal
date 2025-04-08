import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const { bunnyApiKey, bunnyLibraryId } = useRuntimeConfig()
  const videoId = event.context.params?.videoId

  if (!videoId) {
    throw createError({
      statusCode: 400,
      message: 'Video ID is required'
    })
  }

  try {
    // Delete the video from Bunny.net
    await $fetch(`https://video.bunnycdn.com/library/${bunnyLibraryId}/videos/${videoId}`, {
      method: 'DELETE',
      headers: {
        'AccessKey': bunnyApiKey
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to delete video from Bunny.net:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete video from Bunny.net'
    })
  }
}) 