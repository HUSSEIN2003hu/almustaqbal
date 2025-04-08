# Course Management System

A modern course management system built with Nuxt 3, featuring video uploads via BunnyCDN and Firebase authentication.

## Features

- Course, part, and episode management
- Video upload and streaming via BunnyCDN
- Firebase authentication and Firestore database
- Modern UI with TailwindCSS and DaisyUI
- TypeScript support
- Secure admin API with password protection

## Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the following variables:

```env
# Admin Authentication
ADMIN_PASSWORD=your_secure_admin_password

# Firebase Admin Config (JSON string)
FIREBASE_ADMIN_CONFIG='{...}'

# BunnyCDN Configuration
BUNNY_API_KEY=your_api_key
BUNNY_LIBRARY_ID=your_library_id
```

4. Start the development server:

```bash
npm run dev
```

## Project Structure

- `pages/` - Vue pages and routing
- `components/` - Reusable Vue components
- `server/` - API routes and server-side logic
- `types/` - TypeScript type definitions
- `server/services/` - Business logic and database operations

## API Routes

All admin API routes are protected with password authentication. To access these routes, include the `x-admin-password` header with your request:

```bash
curl -H "x-admin-password: your_secure_admin_password" http://localhost:3000/api/admin/courses
```

Available routes:

- `GET /api/admin/courses` - List all courses
- `POST /api/admin/courses` - Create a new course
- `POST /api/admin/courses/:courseId/parts` - Add a new part to a course
- `POST /api/admin/courses/:courseId/parts/:partId/episodes` - Add a new episode to a part
- `PATCH /api/admin/courses/:courseId/parts/:partId/episodes/:episodeId/video` - Update video information for an episode

## Development

1. Make sure you have Node.js 16+ installed
2. Install the dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Visit `http://localhost:3000/admin/courses` to access the admin dashboard

## Production

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## License

MIT
