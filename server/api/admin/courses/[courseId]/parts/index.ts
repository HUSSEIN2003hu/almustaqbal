import { CourseService } from '~/server/services/courseService'

const courseService = new CourseService()

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const courseId = getRouterParam(event, 'courseId')

  if (!courseId) {
    throw createError({
      statusCode: 400,
      message: 'Course ID is required'
    })
  }

  switch (method) {
    case 'POST':
      const body = await readBody(event)
      return await courseService.addPart(courseId, body)
    
    default:
      throw createError({
        statusCode: 405,
        message: 'Method not allowed'
      })
  }
}) 