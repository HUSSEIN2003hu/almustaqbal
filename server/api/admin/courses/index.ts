import { CourseService } from '~/server/services/courseService'

const courseService = new CourseService()

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  switch (method) {
    case 'GET':
      return await courseService.getCourses()
    
    case 'POST':
      const body = await readBody(event)
      return await courseService.createCourse(body)
    
    default:
      throw createError({
        statusCode: 405,
        message: 'Method not allowed'
      })
  }
}) 