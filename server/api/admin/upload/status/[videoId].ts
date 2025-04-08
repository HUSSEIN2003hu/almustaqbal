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
    // Get video status from Bunny.net
    const videoStatus = await $fetch(`https://video.bunnycdn.com/library/${bunnyLibraryId}/videos/${videoId}`, {
      method: 'GET',
      headers: {
        'AccessKey': bunnyApiKey
      }
    })

    return videoStatus
  } catch (error) {
    console.error('Failed to get video status from Bunny.net:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get video status from Bunny.net'
    })
  }
}) 