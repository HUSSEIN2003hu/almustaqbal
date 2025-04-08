export interface Episode {
  id: string
  name: string
  link?: string
  videoId?: string
  isFree: boolean
  createdAt: string
  updatedAt: string
}

export interface Part {
  id: string
  name: string
  episodes: Episode[]
  createdAt: string
  updatedAt: string
}

export interface Course {
  id: string
  name: string
  department: string
  parts: Part[]
  createdAt: string
  updatedAt: string
}

export interface VideoUploadResponse {
  videoUrl: string
  videoId: string
}

export interface ToastState {
  show: boolean
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}

export interface NewCourse {
  name: string
  department: string
}

export interface NewPart {
  name: string
}

export interface RenamePartData {
  partId: string
  newName: string
  oldName: string
}

export interface DeletePartData {
  partId: string
  name: string
}

export interface RenameEpisodeData {
  partId: string
  episodeId: string
  newName: string
  oldName: string
}

export interface DeleteEpisodeData {
  partId: string
  episodeId: string
  name: string
}

export interface User {
  id: string
  username: string
  code: string
  courses: string[]
  createdAt: number
  isActive: boolean
  isAdmin?: boolean
} 