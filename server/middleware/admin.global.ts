import { useAdminAuth } from '../api/admin/middleware/auth'

export default defineEventHandler(async (event) => {
  // Only intercept requests to /api/admin endpoints and admin pages
  if (!event.path.startsWith('/api/admin') && !event.path.startsWith('/admin')) return

  // Skip auth check for login endpoint
  if (event.path === '/api/admin/login') return

  // API requests: return 401 error
  if (event.path.startsWith('/api/admin')) {
    try {
      const { checkUserIsAdmin } = useAdminAuth()

      // Check if user is logged in and is an admin
      const isAdmin = await checkUserIsAdmin(event)
      if (isAdmin) return // User is admin, allow access
      
      // No admin access - return 401
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
  } 
  // Admin page requests: redirect to login page
  else if (event.path.startsWith('/admin')) {
    try {
      const { checkUserIsAdmin } = useAdminAuth()
      const isAdmin = await checkUserIsAdmin(event)
      
      // If admin, allow access
      if (isAdmin) return
      
      // Otherwise redirect to login page
      return sendRedirect(event, '/auth', 302)
    } catch (error) {
      // Any error, redirect to login
      return sendRedirect(event, '/auth', 302)
    }
  }
}) 