import { adminDb } from "~/server/units/firebase-admin";
import { generateActivationCode } from "../../utils/code-generator";
import { useAdminAuth } from "./middleware/auth";
import { H3Event, createError } from 'h3';

// Types
interface User {
  id?: string;
  username: string;
  code: string;
  courses: string[];
  createdAt: number;
  isActive: boolean;
  isAdmin?: boolean;
}

interface Course {
  id?: string;
  name: string;
  department: string;
  parts?: Part[];
}

interface Part {
  id?: string;
  name: string;
  episodes?: Episode[];
}

interface Episode {
  id?: string;
  name: string;
  isFree: boolean;
  isLocked?: boolean;
  videoId?: string;
  videoUrl?: string;
}

// Helper function for error handling
function handleError(error: unknown, defaultMessage: string) {
  console.error(defaultMessage, error);
  if (error instanceof Error) {
    throw createError({
      statusCode: (error as any).statusCode || 401,
      message: error.message || defaultMessage,
    });
  }
  throw createError({
    statusCode: 401,
    message: defaultMessage,
  });
}

// User APIs
export async function getUsers(event: H3Event, search?: string) {
  const { validateAdminPassword } = useAdminAuth();
  validateAdminPassword(event);

  try {
    // Get all users
    const usersSnapshot = await adminDb.collection("users").get();
    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as User[];

    // Filter users if search query is provided
    if (search) {
      const searchLower = search.toLowerCase();
      return users.filter(
        (user) =>
          user.username.toLowerCase().includes(searchLower) ||
          user.code.toLowerCase().includes(searchLower)
      );
    }

    return users;
  } catch (error) {
    handleError(error, "Failed to fetch users");
  }
}

export async function createUser(event: H3Event, username: string, courses: string[]) {
  const { validateAdminPassword } = useAdminAuth();
  validateAdminPassword(event);

  try {
    if (!username || !courses || !Array.isArray(courses)) {
      throw createError({
        statusCode: 400,
        message: "Invalid input data. Username and courses array are required.",
      });
    }

    // Generate a unique activation code
    let code: string = "";
    let exists = true;

    while (exists) {
      code = await generateActivationCode();
      const codeDoc = await adminDb.collection("activationCodes").doc(code).get();
      exists = codeDoc.exists;
    }

    const timestamp = Date.now();

    // Create a batch write
    const batch = adminDb.batch();

    // Add to activationCodes collection
    const codeRef = adminDb.collection("activationCodes").doc(code);
    batch.set(codeRef, {
      username,
      code,
      used: false,
      courses,
      createdAt: timestamp,
    });

    // If you plan to also create a placeholder user in `users` collection:
    const userRef = adminDb.collection("users").doc(code);
    batch.set(userRef, {
      username,
      code,
      courses,
      createdAt: Date.now(),
      isActive: false,
    });
    // Commit the batch
    await batch.commit();

    return {
      id: code,
      username,
      code,
      courses,
      createdAt: timestamp,
      isActive: false,
    };
  } catch (error) {
    handleError(error, "Failed to create user");
  }
}


export async function updateUser(event: H3Event, userId: string, data: { username?: string; courses?: string[]; isAdmin?: boolean }) {
  const { validateAdminPassword } = useAdminAuth();
  validateAdminPassword(event);

  try {
    const userRef = adminDb.collection("users").doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      throw createError({
        statusCode: 404,
        message: "User not found",
      });
    }

    const updateData: Record<string, any> = {};
    if (data.username) updateData.username = data.username;
    if (data.courses) updateData.courses = data.courses;
    if (data.isAdmin !== undefined) updateData.isAdmin = data.isAdmin;
    updateData.updatedAt = Date.now();

    // Create a batch write
    const batch = adminDb.batch();

    // Update user in users collection
    batch.update(userRef, updateData);

    // Update in activationCodes collection if user has a code
    const codeRef = adminDb.collection("activationCodes").doc(userId);
    const codeDoc = await codeRef.get();
    
    if (codeDoc.exists) {
      batch.update(codeRef, updateData);
    }

    // Commit the batch
    await batch.commit();

    // Get the updated user
    const updatedUserDoc = await userRef.get();
    return {
      id: updatedUserDoc.id,
      ...updatedUserDoc.data(),
    };
  } catch (error) {
    handleError(error, "Failed to update user");
  }
}

export async function deleteUser(event: H3Event, userId: string) {
  const { validateAdminPassword } = useAdminAuth();
  validateAdminPassword(event);

  try {
    // Create a batch write
    const batch = adminDb.batch();

    // Delete from users collection
    const userRef = adminDb.collection("users").doc(userId);
    batch.delete(userRef);

    // Delete from activationCodes collection
    const codeRef = adminDb.collection("activationCodes").doc(userId);
    batch.delete(codeRef);

    // Commit the batch
    await batch.commit();
    
    return { success: true };
  } catch (error) {
    handleError(error, "Failed to delete user");
  }
}

// Course APIs
export async function getCourses(event: H3Event) {
  const { validateAdminPassword } = useAdminAuth();
  validateAdminPassword(event);

  try {
    const coursesSnapshot = await adminDb.collection("courses").get();
    const courses = await Promise.all(
      coursesSnapshot.docs.map(async (doc) => {
        const course = { id: doc.id, ...doc.data() } as Course;
        
        // // Get parts
        // const partsSnapshot = await adminDb
        //   .collection("courses")
        //   .doc(doc.id)
        //   .collection("parts")
        //   .get();
        
        // course.parts = await Promise.all(
        //   partsSnapshot.docs.map(async (partDoc) => {
        //     const part = { id: partDoc.id, ...partDoc.data() } as Part;
            
        //     // Get episodes
        //     const episodesSnapshot = await adminDb
        //       .collection("courses")
        //       .doc(doc.id)
        //       .collection("parts")
        //       .doc(partDoc.id)
        //       .collection("episodes")
        //       .get();
            
        //     part.episodes = episodesSnapshot.docs.map((episodeDoc) => ({
        //       id: episodeDoc.id,
        //       ...episodeDoc.data(),
        //     })) as Episode[];
            
        //     return part;
        //   })
        // );
        
        return course;
      })
    );
    
    return courses;
  } catch (error) {
    handleError(error, "Failed to fetch courses");
  }
}

export async function createCourse(event: H3Event, name: string, department: string) {
  const { validateAdminPassword } = useAdminAuth();
  validateAdminPassword(event);

  try {
    if (!name || !department) {
      throw createError({
        statusCode: 400,
        message: "Course name and department are required",
      });
    }

    const courseRef = await adminDb.collection("courses").add({
      name,
      department,
      createdAt: Date.now(),
    });

    const courseDoc = await courseRef.get();
    return {
      id: courseDoc.id,
      ...courseDoc.data(),
      parts: [],
    };
  } catch (error) {
    handleError(error, "Failed to create course");
  }
}

// Part APIs
export async function createPart(event: H3Event, courseId: string, name: string) {
  const { validateAdminPassword } = useAdminAuth();
  validateAdminPassword(event);

  try {
    if (!courseId || !name) {
      throw createError({
        statusCode: 400,
        message: "Course ID and part name are required",
      });
    }

    const partRef = await adminDb
      .collection("courses")
      .doc(courseId)
      .collection("parts")
      .add({
        name,
        createdAt: Date.now(),
      });

    const partDoc = await partRef.get();
    return {
      id: partDoc.id,
      ...partDoc.data(),
      episodes: [],
    };
  } catch (error) {
    handleError(error, "Failed to create part");
  }
}

export async function updatePart(event: H3Event, courseId: string, partId: string, name: string) {
  const { validateAdminPassword } = useAdminAuth();
  validateAdminPassword(event);

  try {
    if (!courseId || !partId || !name) {
      throw createError({
        statusCode: 400,
        message: "Course ID, part ID, and name are required",
      });
    }

    const partRef = adminDb
      .collection("courses")
      .doc(courseId)
      .collection("parts")
      .doc(partId);

    await partRef.update({ name });

    const updatedPartDoc = await partRef.get();
    return {
      id: updatedPartDoc.id,
      ...updatedPartDoc.data(),
    };
  } catch (error) {
    handleError(error, "Failed to update part");
  }
}

export async function deletePart(event: H3Event, courseId: string, partId: string) {
  const { validateAdminPassword } = useAdminAuth();
  validateAdminPassword(event);

  try {
    if (!courseId || !partId) {
      throw createError({
        statusCode: 400,
        message: "Course ID and part ID are required",
      });
    }

    // Get all episodes
    const episodesSnapshot = await adminDb
      .collection("courses")
      .doc(courseId)
      .collection("parts")
      .doc(partId)
      .collection("episodes")
      .get();

    // Delete all episodes
    const batch = adminDb.batch();
    episodesSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete the part
    batch.delete(
      adminDb.collection("courses").doc(courseId).collection("parts").doc(partId)
    );

    await batch.commit();
    return { success: true };
  } catch (error) {
    handleError(error, "Failed to delete part");
  }
}

// Episode APIs
export async function createEpisode(
  event: H3Event,
  courseId: string,
  partId: string,
  name: string,
  isFree: boolean = false,
  isLocked: boolean = false
) {
  const { validateAdminPassword } = useAdminAuth();
  validateAdminPassword(event);

  try {
    if (!courseId || !partId || !name) {
      throw createError({
        statusCode: 400,
        message: "Course ID, part ID, and episode name are required",
      });
    }

    const episodeRef = await adminDb
      .collection("courses")
      .doc(courseId)
      .collection("parts")
      .doc(partId)
      .collection("episodes")
      .add({
        name,
        isFree,
        isLocked,
        createdAt: Date.now(),
      });

    const episodeDoc = await episodeRef.get();
    return {
      id: episodeDoc.id,
      ...episodeDoc.data(),
    };
  } catch (error) {
    handleError(error, "Failed to create episode");
  }
}

export async function updateEpisode(
  event: H3Event,
  courseId: string,
  partId: string,
  episodeId: string,
  data: { name?: string; isFree?: boolean; isLocked?: boolean; videoId?: string; videoUrl?: string }
) {
  const { validateAdminPassword } = useAdminAuth();
  validateAdminPassword(event);

  try {
    if (!courseId || !partId || !episodeId) {
      throw createError({
        statusCode: 400,
        message: "Course ID, part ID, and episode ID are required",
      });
    }

    const episodeRef = adminDb
      .collection("courses")
      .doc(courseId)
      .collection("parts")
      .doc(partId)
      .collection("episodes")
      .doc(episodeId);

    const updateData: Record<string, any> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.isFree !== undefined) updateData.isFree = data.isFree;
    if (data.isLocked !== undefined) updateData.isLocked = data.isLocked;
    if (data.videoId !== undefined) updateData.videoId = data.videoId;
    if (data.videoUrl !== undefined) updateData.videoUrl = data.videoUrl;

    await episodeRef.update(updateData);

    const updatedEpisodeDoc = await episodeRef.get();
    return {
      id: updatedEpisodeDoc.id,
      ...updatedEpisodeDoc.data(),
    };
  } catch (error) {
    handleError(error, "Failed to update episode");
  }
}

export async function deleteEpisode(event: H3Event, courseId: string, partId: string, episodeId: string) {
  const { validateAdminPassword } = useAdminAuth();
  validateAdminPassword(event);

  try {
    if (!courseId || !partId || !episodeId) {
      throw createError({
        statusCode: 400,
        message: "Course ID, part ID, and episode ID are required",
      });
    }

    // Delete the episode
    await adminDb
      .collection("courses")
      .doc(courseId)
      .collection("parts")
      .doc(partId)
      .collection("episodes")
      .doc(episodeId)
      .delete();

    return { success: true };
  } catch (error) {
    handleError(error, "Failed to delete episode");
  }
}

// Upload handling
export async function deleteVideo(event: H3Event, videoId: string) {
  const { validateAdminPassword } = useAdminAuth();
  validateAdminPassword(event);

  try {
    if (!videoId) {
      throw createError({
        statusCode: 400,
        message: "Video ID is required",
      });
    }

    // Implement video deletion from storage (Bunny.net)
    // This is a placeholder - actual implementation will depend on your video service
    
    return { success: true };
  } catch (error) {
    handleError(error, "Failed to delete video");
  }
} 