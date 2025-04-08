export default defineEventHandler(async (event) => {
    const sessionCookie = getCookie(event, '__session')
    return { valid: !!sessionCookie }
  })