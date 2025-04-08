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
      message: 'Course ID, Part ID and Episode ID are required'
    })
  }

  switch (method) {
    case 'PUT':
      const body = await readBody(event)
      return await courseService.updateEpisode(courseId, partId, episodeId, body)
    
    case 'DELETE':
      await courseService.deleteEpisode(courseId, partId, episodeId)
      return { success: true }
    
    default:
      throw createError({
        statusCode: 405,
        message: 'Method not allowed'
      })
  }
}) 