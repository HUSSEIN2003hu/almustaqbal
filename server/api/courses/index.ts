import { adminAuth, adminDb } from "~/server/units/firebase-admin";
import { CourseService } from '~/server/services/courseService';

// Initialize course service
const courseService = new CourseService();

export default defineEventHandler(async (event) => {
  try {
    // Get all courses from the database
    const courses = await courseService.getCourses();
    
    // Check if the user is logged in
    const sessionCookie = getCookie(event, '__session');
    let userCourses = [];
    
    if (sessionCookie) {
      try {
        // Verify the session cookie
        const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
        const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
        
        if (userDoc.exists) {
          userCourses = userDoc.data()?.courses || [];
        }
      } catch (error) {
        console.error('Session verification error:', error);
        // Just continue with empty userCourses if authentication fails
      }
    }

    // Filter the courses data to remove links for episodes that the user doesn't have access to
    const filteredCourses = (courses || []).map(course => {
      if (!course) return null;

      try {
        // Check if the user has access to this course
        const hasAccess = userCourses.includes(course.id);
        
        // Process all parts and episodes
        // First ensure that course.parts exists and is an array
        const parts = Array.isArray(course.parts) ? course.parts : [];
        
        const processedParts = parts.map(part => {
          if (!part) return null;

          try {
            // Ensure episodes exists and is an array
            const episodes = Array.isArray(part.episodes) ? part.episodes : [];
            
            const processedEpisodes = episodes.map(episode => {
              if (!episode) return null;

              try {
                // If episode is free or user has purchased the course, keep the link
                if ((episode.isFree === true) || hasAccess) {
                  return episode;
                } else {
                  // For paid episodes that user doesn't have access to, remove the link
                  return {
                    ...episode,
                    link: null
                  };
                }
              } catch (episodeError) {
                console.error('Error processing episode:', episodeError);
                return episode; // Return original episode as fallback
              }
            }).filter(Boolean); // Remove any null episodes
            
            return {
              ...part,
              episodes: processedEpisodes
            };
          } catch (partError) {
            console.error('Error processing part:', partError);
            return part; // Return original part as fallback
          }
        }).filter(Boolean); // Remove any null parts
        
        return {
          ...course,
          parts: processedParts
        };
      } catch (courseError) {
        console.error('Error processing course:', courseError);
        return course; // Return original course as fallback
      }
    }).filter(Boolean); // Remove any null courses

    return filteredCourses;
    
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw createError({
      statusCode: 500,
      message: 'Error fetching courses'
    });
  }
}); 