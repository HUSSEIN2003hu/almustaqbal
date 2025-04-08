import crypto from 'crypto';
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  /// get 
  const { bunnyApiKey, bunnyLibraryId } = useRuntimeConfig();
  
  try {
    // 1. Create a video object with transcoding enabled
    const createResponse = await $fetch('https://video.bunnycdn.com/library/' + bunnyLibraryId + '/videos', {
      method: 'POST',
      headers: {
        'AccessKey': bunnyApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `upload_${Date.now()}`,
        enabledResolutions: "480p,720p,1080p", // Reduced resolutions for better compatibility
        transcodeSettings: {
          // Use web-optimized profile for better compatibility
          transcodeProfile: "WebOptimized",
          forceEncoding: true,
          encodeProgressiveDownload: true, // Enable progressive download
          encoder: "H264"  // Use H264 which has better compatibility
        }
      })
    });
    
    const videoId = createResponse.guid;

    // 2. Create the pre-signature for tus upload
    const expirationTime = Math.floor(Date.now() / 1000) + 86400; // 24 hours later
    const stringToSign = `${bunnyLibraryId}${bunnyApiKey}${expirationTime}${videoId}`;
    const signature = crypto.createHash('sha256').update(stringToSign).digest('hex').toUpperCase();
    
    return {
      videoId: videoId,
      signature: signature,
      expirationTime: expirationTime
    };
  } catch (error) {
    console.error('Bunny API Error:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to create video for upload.'
    });
  }
});
