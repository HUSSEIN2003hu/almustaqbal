import { adminAuth, adminDb } from "~/server/units/firebase-admin";
import { CourseService } from '~/server/services/courseService';
import { Course } from "~/types";
import { getCookie } from 'h3'; // Stelle sicher, dass du `getCookie` importierst

// Initialize course service
const courseService = new CourseService();

export default defineEventHandler(async (event) => {
  try {
    const sessionCookie = getCookie(event, '__session');
    let userCourses: string[] = [];

    if (sessionCookie) {
      try {
        const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
        const userDoc = await adminDb.collection('users').where ('uid', '==', decodedToken.uid).limit(1).get();
        userCourses = !userDoc.empty ? userDoc.docs[0].data()?.courses || [] : [];
      } catch (error) {
        console.error('Session verification error:', error);
      }
    }

    // Alle Kurse laden
    const courses = await courseService.getCourses();

    // Links entfernen für Kurse ohne Zugriff
    const userCoursesSet = new Set(userCourses); // Use Set for faster lookups

    for (const course of courses) {
      const hasAccess = userCoursesSet.has(course.id);
      console.log('Course ID:', course.id, 'Has access:', hasAccess); // Debugging-Ausgabe

      course.parts.forEach(part => {
      part.episodes = part.episodes
        .map(episode => {
        if (!hasAccess && !episode.isFree) {
          return { ...episode, link: undefined }; // Remove link for locked episodes
        }
        return episode;
        })
        .filter(episode => !episode.isLocked); // Remove locked episodes
      });
    }

    return courses.sort((a, b) => {
      const aOwned = userCourses.includes(a.id) ? 1 : 0;
      const bOwned = userCourses.includes(b.id) ? 1 : 0;
      return bOwned - aOwned; // zuerst die mit 1 (true)
    });;

  } catch (error) {
    console.error('Error fetching courses:', error);
    throw createError({
      statusCode: 500,
      message: 'Error fetching courses'
    });
  }
});
