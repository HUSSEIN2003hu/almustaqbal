import axios from 'axios'
import type { Course, Part, Episode, NewCourse, NewPart, User } from '~/types/admin'

const api = axios.create({
  baseURL: '/api/admin',
  validateStatus: (status: number) => status < 500
})

export function useAdminApi() {
  const login = async () => {
    interface LoginResponse {
      success: boolean;
      message?: string;
    }
    return await api.get<LoginResponse>('/login')
  }

  const getCourses = async () => {
    return await api.get<Course[]>('/courses')
  }

  const createCourse = async (courseData: NewCourse) => {
    return await api.post<Course>('/courses', courseData)
  }

  const updateCourse = async (courseId: string, courseData: Partial<Course>) => {
    return await api.put<Course>(`/courses/${courseId}`, courseData)
  }

  const deleteCourse = async (courseId: string) => {
    return await api.delete(`/courses/${courseId}`)
  }

  const createPart = async (courseId: string, partData: NewPart) => {
    return await api.post<Part>(`/courses/${courseId}/parts`, partData)
  }

  const updatePart = async (courseId: string, partId: string, partData: Partial<Part>) => {
    return await api.put<Part>(`/courses/${courseId}/parts/${partId}`, partData)
  }

  const deletePart = async (courseId: string, partId: string) => {
    return await api.delete(`/courses/${courseId}/parts/${partId}`)
  }

  const createEpisode = async (courseId: string, partId: string, name: string, isFree: boolean) => {
    return await api.post<Episode>(`/courses/${courseId}/parts/${partId}/episodes`, {
      name,
      isFree
    })
  }

  const updateEpisode = async (courseId: string, partId: string, episodeId: string, episodeData: Partial<Episode>) => {
    return await api.put<Episode>(`/courses/${courseId}/parts/${partId}/episodes/${episodeId}`, episodeData)
  }

  const deleteEpisode = async (courseId: string, partId: string, episodeId: string) => {
    return await api.delete(`/courses/${courseId}/parts/${partId}/episodes/${episodeId}`)
  }

  const renamePart = async (courseId: string, partId: string, newName: string) => {
    return await updatePart(courseId, partId, { name: newName })
  }

  const renameEpisode = async (courseId: string, partId: string, episodeId: string, newName: string) => {
    return await updateEpisode(courseId, partId, episodeId, { name: newName })
  }

  const updateEpisodeIsFree = async (courseId: string, partId: string, episodeId: string, isFree: boolean) => {
    return await updateEpisode(courseId, partId, episodeId, { isFree })
  }

  const getUsers = async () => {
    return await api.get<User[]>('/users')
  }

  return {
    login,
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    createPart,
    updatePart,
    deletePart,
    createEpisode,
    updateEpisode,
    deleteEpisode,
    renamePart,
    renameEpisode,
    updateEpisodeIsFree,
    getUsers
  }
} 