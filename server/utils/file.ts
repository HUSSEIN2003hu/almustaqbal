import { promises as fs } from 'fs'

export async function readFile(filepath: string): Promise<Buffer> {
  return await fs.readFile(filepath)
} 