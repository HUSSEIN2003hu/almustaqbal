import { H3Event, createError, getCookie, setCookie, deleteCookie } from 'h3'
import { RuntimeConfig } from 'nuxt/schema'
import { adminAuth, adminDb } from "~/server/units/firebase-admin";

// Types
interface LoginAttempt {
  count: number
  timestamp: number
  lockedUntil: number
}

interface LoginAttempts {
  [ip: string]: LoginAttempt
}

// Constants
const RATE_LIMIT = {
  WINDOW: 300000, // 5 minutes in milliseconds
  MAX_ATTEMPTS: 5,
  LOCK_DURATION: 300000 // 5 minutes in milliseconds
}

// Store for tracking login attempts
const loginAttempts: LoginAttempts = {}

// Helper functions
function getClientIp(event: H3Event): string {
  return getRequestIP(event, { xForwardedFor: true }) || 'unknown'
}

function isIpLocked(ip: string): { locked: boolean; timeLeft?: number } {
  const attempts = loginAttempts[ip]
  if (!attempts?.lockedUntil) return { locked: false }

  const timeLeft = attempts.lockedUntil - Date.now()
  return {
    locked: timeLeft > 0,
    timeLeft: Math.ceil(timeLeft / 1000)
  }
}

function updateLoginAttempts(ip: string, success: boolean): void {
  const now = Date.now()
  const attempts = loginAttempts[ip] || { count: 0, timestamp: now, lockedUntil: 0 }

  if (success) {
    // Reset on successful login
    delete loginAttempts[ip]
    return
  }

  // Reset attempts if window has expired
  if (now - attempts.timestamp > RATE_LIMIT.WINDOW) {
    attempts.count = 0
    attempts.timestamp = now
  }

  // Increment attempt counter
  attempts.count++

  // Lock if too many attempts
  if (attempts.count >= RATE_LIMIT.MAX_ATTEMPTS) {
    attempts.lockedUntil = now + RATE_LIMIT.LOCK_DURATION
  }

  loginAttempts[ip] = attempts
}

// New function to check if user is an admin
async function checkUserIsAdmin(event: H3Event): Promise<boolean> {
  try {
    const sessionCookie = getCookie(event, '__session');
    if (!sessionCookie) return false;

    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userDoc = await adminDb.collection('users').where('uid', '==', decodedToken.uid).limit(1).get();
    if (userDoc.empty) return false; // User not found
    const userData = userDoc.docs[0]?.data();

    return !!userData?.isAdmin; // Return true if the user has isAdmin flag
  } catch (error) {
    return false;
  }
}

// Modified function to validate admin access via user session or admin password
async function validateAdminAccess(event: H3Event): Promise<void> {
  // First, check if the user is logged in and is an admin
  const isAdmin = await checkUserIsAdmin(event);
  if (isAdmin) {
    // User is an admin, allow access
    return;
  }

  // Fall back to password check if user is not an admin
  const config = useRuntimeConfig()
  const adminPassword = config.adminPassword
  
  if (!adminPassword) {
    throw createError({
      statusCode: 500,
      message: 'خطأ في تكوين كلمة المرور'
    })
  }

  // Get password either from header or from body
  const headerPassword = getHeader(event, 'x-admin-password')
  const bodyPassword = event.context.body?.password
  const clientIp = getClientIp(event)
  
  // Check if IP is locked
  const { locked, timeLeft } = isIpLocked(clientIp)
  if (locked) {
    throw createError({
      statusCode: 429,
      message: `تم تجاوز عدد المحاولات المسموح به. يرجى الانتظار ${timeLeft} ثانية`
    })
  }

  // Validate password
  if ((!headerPassword && !bodyPassword) || (headerPassword !== adminPassword && bodyPassword !== adminPassword)) {
    updateLoginAttempts(clientIp, false)
    const attempts = loginAttempts[clientIp]
    const remainingAttempts = RATE_LIMIT.MAX_ATTEMPTS - attempts.count

    throw createError({
      statusCode: 401,
      message: `كلمة المرور غير صحيحة. ${remainingAttempts} محاولات متبقية`
    })
  }

  // Reset attempts on successful login
  updateLoginAttempts(clientIp, true)
}

export function useAdminAuth() {
  return {
    validateAdminPassword: async (event: H3Event) => {
      // Just use checkUserIsAdmin now
      const isAdmin = await checkUserIsAdmin(event);
      if (!isAdmin) {
        throw createError({
          statusCode: 401,
          message: 'غير مصرح للوصول'
        });
      }
    },
    checkUserIsAdmin
  }
}

// Default export for middleware compatibility
export default useAdminAuth 