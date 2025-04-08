export default defineEventHandler(async (event) => {
    try {
      // حذف الكوكي
      deleteCookie(event, '__session');
      
      return { success: true };
      
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: 'فشل تسجيل الخروج'
      });
    }
  });