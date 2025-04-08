import { adminDb } from '../units/firebase-admin'
import type { Course, Part, Episode } from '~/types'

export class CourseService {
  private coursesCollection = adminDb.collection('courses')

  async createCourse(courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
    const now = new Date()
    const courseRef = this.coursesCollection.doc()
    const course: Course = {
      id: courseRef.id,
      ...courseData,
      createdAt: now,
      updatedAt: now,
      parts: [],
    }
    await courseRef.set(course)
    return course
  }

  async getCourses(): Promise<Course[]> {
    const snapshot = await this.coursesCollection.get()
    return snapshot.docs.map(doc => doc.data() as Course)
  }

  async getCourse(id: string): Promise<Course | null> {
    const doc = await this.coursesCollection.doc(id).get()
    return doc.exists ? (doc.data() as Course) : null
  }

  async addPart(courseId: string, partData: Omit<Part, 'id' | 'episodes' | 'createdAt' | 'updatedAt'>): Promise<Part> {
    const courseRef = this.coursesCollection.doc(courseId)
    const course = await courseRef.get()
    
    if (!course.exists) {
      throw new Error('Course not found')
    }

    const now = new Date()
    const newPart: Part = {
      id: crypto.randomUUID(),
      ...partData,
      episodes: [],
      createdAt: now,
      updatedAt: now,
    }

    const courseData = course.data() as Course
    await courseRef.update({
      parts: [...courseData.parts, newPart],
      updatedAt: now,
    })

    return newPart
  }

  async addEpisode(
    courseId: string, 
    partId: string, 
    episodeData: Omit<Episode, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Episode> {
    const courseRef = this.coursesCollection.doc(courseId)
    const course = await courseRef.get()
    
    if (!course.exists) {
      throw new Error('Course not found')
    }

    const courseData = course.data() as Course
    const partIndex = courseData.parts.findIndex(p => p.id === partId)
    
    if (partIndex === -1) {
      throw new Error('Part not found')
    }

    const now = new Date()
    const newEpisode: Episode = {
      id: crypto.randomUUID(),
      ...episodeData,
      createdAt: now,
      updatedAt: now,
    }

    courseData.parts[partIndex].episodes.push(newEpisode)
    courseData.updatedAt = now

    await courseRef.update(courseData)
    return newEpisode
  }

  async updateEpisodeVideo(
    courseId: string,
    partId: string,
    episodeId: string,
    videoId: string,
    videoUrl: string,
  ): Promise<void> {
    const courseRef = this.coursesCollection.doc(courseId)
    const course = await courseRef.get()
    
    if (!course.exists) {
      throw new Error('Course not found')
    }

    const courseData = course.data() as Course
    const part = courseData.parts.find(p => p.id === partId)
    if (!part) {
      throw new Error('Part not found')
    }

    const episode = part.episodes.find(e => e.id === episodeId)
    if (!episode) {
      throw new Error('Episode not found')
    }

    episode.videoId = videoId
    episode.link = videoUrl
    episode.updatedAt = new Date()

    await courseRef.update(courseData)
  }

  async updatePart(
    courseId: string,
    partId: string,
    partData: Partial<Omit<Part, 'id' | 'episodes' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Part> {
    const courseRef = this.coursesCollection.doc(courseId)
    const course = await courseRef.get()
    
    if (!course.exists) {
      throw new Error('Course not found')
    }

    const courseData = course.data() as Course
    const partIndex = courseData.parts.findIndex(p => p.id === partId)
    
    if (partIndex === -1) {
      throw new Error('Part not found')
    }

    // Update part fields
    const updatedPart = {
      ...courseData.parts[partIndex],
      ...partData,
      updatedAt: new Date()
    }

    courseData.parts[partIndex] = updatedPart
    courseData.updatedAt = new Date()

    await courseRef.update(courseData)
    return updatedPart
  }

  async deletePart(
    courseId: string,
    partId: string
  ): Promise<void> {
    const courseRef = this.coursesCollection.doc(courseId)
    const course = await courseRef.get()
    
    if (!course.exists) {
      throw new Error('Course not found')
    }

    const courseData = course.data() as Course
    const partIndex = courseData.parts.findIndex(p => p.id === partId)
    
    if (partIndex === -1) {
      throw new Error('Part not found')
    }

    // Remove the part
    courseData.parts.splice(partIndex, 1)
    courseData.updatedAt = new Date()

    await courseRef.update(courseData)
  }

  async updateEpisode(
    courseId: string,
    partId: string,
    episodeId: string,
    episodeData: Partial<Omit<Episode, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Episode> {
    const courseRef = this.coursesCollection.doc(courseId)
    const course = await courseRef.get()
    
    if (!course.exists) {
      throw new Error('Course not found')
    }

    const courseData = course.data() as Course
    const part = courseData.parts.find(p => p.id === partId)
    
    if (!part) {
      throw new Error('Part not found')
    }

    const episodeIndex = part.episodes.findIndex(e => e.id === episodeId)
    
    if (episodeIndex === -1) {
      throw new Error('Episode not found')
    }

    // Update episode fields
    const updatedEpisode = {
      ...part.episodes[episodeIndex],
      ...episodeData,
      updatedAt: new Date()
    }

    part.episodes[episodeIndex] = updatedEpisode
    courseData.updatedAt = new Date()

    await courseRef.update(courseData)
    return updatedEpisode
  }

  async deleteEpisode(
    courseId: string,
    partId: string,
    episodeId: string
  ): Promise<void> {
    const courseRef = this.coursesCollection.doc(courseId)
    const course = await courseRef.get()
    
    if (!course.exists) {
      throw new Error('Course not found')
    }

    const courseData = course.data() as Course
    const part = courseData.parts.find(p => p.id === partId)
    
    if (!part) {
      throw new Error('Part not found')
    }

    const episodeIndex = part.episodes.findIndex(e => e.id === episodeId)
    
    if (episodeIndex === -1) {
      throw new Error('Episode not found')
    }

    // Remove the episode
    part.episodes.splice(episodeIndex, 1)
    courseData.updatedAt = new Date()

    await courseRef.update(courseData)
  }

  async updateCourse(
    courseId: string,
    courseData: Partial<Omit<Course, 'id' | 'parts' | 'createdAt' | 'updatedAt'>>
  ): Promise<Course> {
    const courseRef = this.coursesCollection.doc(courseId)
    const courseDoc = await courseRef.get()
    
    if (!courseDoc.exists) {
      throw new Error('Course not found')
    }

    const existingCourse = courseDoc.data() as Course
    const updatedCourse = {
      ...existingCourse,
      ...courseData,
      updatedAt: new Date()
    }
    
    await courseRef.update(updatedCourse)
    return updatedCourse
  }

  async deleteCourse(courseId: string): Promise<void> {
    const courseRef = this.coursesCollection.doc(courseId)
    const course = await courseRef.get()
    
    if (!course.exists) {
      throw new Error('Course not found')
    }
    
    await courseRef.delete()
  }
} 