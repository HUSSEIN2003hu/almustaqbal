import { useAdminAuth } from './middleware/auth'
import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const { checkUserIsAdmin } = useAdminAuth()
  
  try {
    // Check if the user is already logged in and is an admin
    const isAdmin = await checkUserIsAdmin(event);
    if (isAdmin) {
      return {
        success: true,
        message: 'صلاحيات المسؤول متاحة'
      }
    }
    
    // User is not an admin
    throw createError({
      statusCode: 401,
      message: 'غير مصرح للوصول'
    })
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 401,
      message: error.message || 'غير مصرح للوصول'
    })
  }
}) 