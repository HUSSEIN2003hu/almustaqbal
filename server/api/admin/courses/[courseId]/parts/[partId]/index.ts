import { CourseService } from '~/server/services/courseService'

const courseService = new CourseService()

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const courseId = getRouterParam(event, 'courseId')
  const partId = getRouterParam(event, 'partId')

  if (!courseId || !partId) {
    throw createError({
      statusCode: 400,
      message: 'Course ID and Part ID are required'
    })
  }

  switch (method) {
    case 'PUT':
      const body = await readBody(event)
      return await courseService.updatePart(courseId, partId, body)
    
    case 'DELETE':
      await courseService.deletePart(courseId, partId)
      return { success: true }
    
    default:
      throw createError({
        statusCode: 405,
        message: 'Method not allowed'
      })
  }
}) 