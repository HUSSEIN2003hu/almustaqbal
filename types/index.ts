export interface Episode {
  id: string
  name: string
  link?: string
  videoId?: string
  isFree: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Part {
  id: string
  name: string
  episodes: Episode[]
  createdAt: Date
  updatedAt: Date
}

export interface Course {
  id: string
  name: string
  department: string
  parts: Part[]
  createdAt: Date
  updatedAt: Date
} 