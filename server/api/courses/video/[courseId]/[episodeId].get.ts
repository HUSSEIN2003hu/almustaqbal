import { adminAuth, adminDb } from "~/server/units/firebase-admin";
import { CourseService } from '~/server/services/courseService';

// Initialize course service
const courseService = new CourseService();

export default defineEventHandler(async (event) => {
  // Get route parameters
  const courseId = getRouterParam(event, 'courseId');
  const episodeId = getRouterParam(event, 'episodeId');

  // Validate required parameters
  if (!courseId || !episodeId) {
    throw createError({
      statusCode: 400,
      message: 'Course ID and Episode ID are required'
    });
  }

  try {
    // Get the course data
    const course = await courseService.getCourse(courseId);
    
    if (!course) {
      throw createError({
        statusCode: 404,
        message: 'Course not found'
      });
    }

    // Find the episode across all parts
    let targetEpisode = null;
    let targetPart = null;

    // Make sure parts exists and is an array
    const parts = Array.isArray(course.parts) ? course.parts : [];

    // Iterate through parts to find the episode
    for (const part of parts) {
      // Skip if part is null or episodes is not an array
      if (!part || !Array.isArray(part.episodes)) continue;
      
      const episode = part.episodes.find(ep => ep && ep.id === episodeId);
      if (episode) {
        targetEpisode = episode;
        targetPart = part;
        break;
      }
    }

    if (!targetEpisode) {
      throw createError({
        statusCode: 404,
        message: 'Episode not found'
      });
    }

    // Check if the episode is free - anyone can access it
    if (targetEpisode.isFree === true) {
      // Ensure we have a link to return
      if (!targetEpisode.link) {
        return {
          success: false,
          message: 'Video link not available'
        };
      }
      
      return {
        success: true,
        videoUrl: targetEpisode.link
      };
    }

    // If episode is not free, check user authentication
    const sessionCookie = getCookie(event, '__session');
    if (!sessionCookie) {
      return {
        success: false,
        message: 'Authentication required to access this video'
      };
    }

    // Verify the session cookie
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      return {
        success: false,
        message: 'User not found'
      };
    }

    const userData = userDoc.data();
    const userCourses = Array.isArray(userData?.courses) ? userData.courses : [];

    // Check if the user has purchased the course
    if (!userCourses.includes(courseId)) {
      return {
        success: false,
        message: 'You need to purchase this course to access this video'
      };
    }

    // User has permission to access the video, but ensure we have a link to return
    if (!targetEpisode.link) {
      return {
        success: false,
        message: 'Video link not available'
      };
    }
    
    return {
      success: true,
      videoUrl: targetEpisode.link
    };

  } catch (error) {
    console.error('Error accessing video:', error);
    
    // Handle token verification errors
    if (error.code === 'auth/session-cookie-expired' || 
        error.code === 'auth/session-cookie-revoked' || 
        error.code === 'auth/argument-error') {
      // Clear invalid session cookie
      deleteCookie(event, '__session');
      return {
        success: false,
        message: 'Authentication expired, please log in again'
      };
    }
    
    throw createError({
      statusCode: 500,
      message: 'Error accessing video content'
    });
  }
}); 