import { readFiles } from 'h3-formidable'
import { createError } from 'h3'
import { readFile } from '~/server/utils/file'
import { HttpStatusCode } from 'axios'

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
    // Parse the multipart form data
    const { files } = await readFiles(event, {
      includeFields: false,
      maxFiles: 1,
      maxFileSize: 10 * 1024 * 1024 // 10MB max file size
    })

    const thumbnailFile = files.thumbnail?.[0]
    if (!thumbnailFile) {
      throw createError({
        statusCode: 400,
        message: 'No thumbnail file provided'
      })
    }

    // Read the file contents
    const fileContents = await readFile(thumbnailFile.filepath)

    // Upload the thumbnail to Bunny.net
    const response = await $fetch(`https://video.bunnycdn.com/library/${bunnyLibraryId}/videos/${videoId}/thumbnail`, {
      method: 'POST',
      headers: {
        'AccessKey': bunnyApiKey,
        'Content-Type': thumbnailFile.mimetype || 'image/jpeg'
      },
      body: fileContents
    })

    // Return the thumbnail URL
    return  HttpStatusCode.Created
  } catch (error) {
    console.error('Thumbnail upload error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to upload thumbnail'
    })
  }
}) 