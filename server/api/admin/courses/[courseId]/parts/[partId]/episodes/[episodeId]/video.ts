import { CourseService } from '~/server/services/courseService'

const courseService = new CourseService()

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const courseId = getRouterParam(event, 'courseId')
  const partId = getRouterParam(event, 'partId')
  const episodeId = getRouterParam(event, 'episodeId')

  if (!courseId || !partId || !episodeId) {
    throw createError({
      statusCode: 400,
      message: 'Course ID, Part ID, and Episode ID are required'
    })
  }

  if (method !== 'PATCH') {
    throw createError({
      statusCode: 405,
      message: 'Method not allowed'
    })
  }

  const body = await readBody(event)
  const { videoId, videoUrl } = body

  if (!videoId || !videoUrl) {
    throw createError({
      statusCode: 400,
      message: 'Video ID, URL, and thumbnail URL are required'
    })
  }

  await courseService.updateEpisodeVideo(
    courseId,
    partId,
    episodeId,
    videoId,
    videoUrl,
  )

  return { success: true }
}) 