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
    case 'GET':
      return await courseService.getCourse(courseId)
    
    case 'PUT':
      const body = await readBody(event)
      return await courseService.updateCourse(courseId, body)
    
    case 'DELETE':
      await courseService.deleteCourse(courseId)
      return { success: true }
    
    default:
      throw createError({
        statusCode: 405,
        message: 'Method not allowed'
      })
  }
}) 