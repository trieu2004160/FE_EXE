// Image Utilities - Handle image URLs from backend

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getProp(obj: Record<string, unknown>, key: string): unknown {
  return obj[key];
}

function tryExtractGoogleDriveFileId(url: string): string | null {
  if (!url) return null;
  const u = url.trim();

  // https://drive.google.com/file/d/<id>/view?...
  const m1 = u.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (m1?.[1]) return m1[1];

  // https://drive.google.com/open?id=<id>
  const m2 = u.match(/drive\.google\.com\/(?:open|uc)\?[^#]*\bid=([a-zA-Z0-9_-]+)/i);
  if (m2?.[1]) return m2[1];

  // https://drive.usercontent.google.com/download?id=<id>&...
  const m2b = u.match(/drive\.usercontent\.google\.com\/(?:download|uc)\?[^#]*\bid=([a-zA-Z0-9_-]+)/i);
  if (m2b?.[1]) return m2b[1];

  // https://lh3.googleusercontent.com/d/<id>
  const m3 = u.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/i);
  if (m3?.[1]) return m3[1];

  return null;
}

function normalizeGoogleDriveImageUrl(url: string): string {
  const id = tryExtractGoogleDriveFileId(url);
  if (!id) return url;

  // Direct-view URL for <img>. Note: file must be shared/public.
  // Use Google's content CDN; in practice this is more reliably embeddable than drive.google.com/uc.
  return `https://lh3.googleusercontent.com/d/${id}`;
}

/**
 * Normalize image URL - handle relative paths, absolute URLs, and base64 data URLs from backend
 * Backend returns:
 * - Base64 data URLs: data:image/jpeg;base64,/9j/4AAQSkZJRg... (stored in database)
 * - Absolute URLs: http:// or https://
 * - Relative paths: /images/products/xxx.jpg (if still using file system)
 * Use proxy in development, or full URL in production
 */
export function normalizeImageUrl(url: string | undefined | null): string | undefined {
  try {
    if (!url || typeof url !== 'string' || url.trim() === '') {
      return undefined;
    }

    const trimmedUrl = url.trim();

    // If base64 data URL (stored in database), return as is
    // Format: data:image/[type];base64,[base64string]
    if (trimmedUrl.startsWith('data:image/')) {
      return trimmedUrl;
    }

    // Google Drive share links are not directly embeddable; convert to a direct-view URL.
    // This helps both previews (ShopDashboard) and product display (ProductDetail).
    const driveNormalized = normalizeGoogleDriveImageUrl(trimmedUrl);
    if (driveNormalized !== trimmedUrl) {
      return driveNormalized;
    }

    // If already absolute URL (http:// or https://), return as is
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
      return trimmedUrl;
    }

    // If relative path starting with /images/, handle it (for backward compatibility)
    // Note: This assumes BE might still return relative paths temporarily
    if (trimmedUrl.startsWith('/images/')) {
      const cleanUrl = trimmedUrl;

      // In development, use proxy (vite.config.ts proxies /images to backend)
      if (import.meta.env.DEV) {
        // Development: use proxy - vite will proxy /images/* to https://localhost:5001/images/*
        return cleanUrl;
      }

      // Production: construct full URL
      let backendBaseUrl = 'https://localhost:5001';
      
      if (import.meta.env.VITE_API_BASE_URL) {
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        if (apiUrl.startsWith('http://') || apiUrl.startsWith('https://')) {
          // Full URL like https://localhost:5001/api
          backendBaseUrl = apiUrl.replace('/api', '').replace(/\/$/, '');
        } else if (apiUrl.startsWith('/api')) {
          // Relative path like /api, use default backend
          backendBaseUrl = 'https://localhost:5001';
        }
      } else if (import.meta.env.VITE_BACKEND_URL) {
        backendBaseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '');
      }
      
      // Construct full URL: https://localhost:5001/images/products/xxx.jpg
      return `${backendBaseUrl}${cleanUrl}`;
    }

    // For other relative paths, ensure they start with /
    const cleanUrl = trimmedUrl.startsWith('/') ? trimmedUrl : `/${trimmedUrl}`;
    
    // In development, use proxy
    if (import.meta.env.DEV) {
      return cleanUrl;
    }

    // Production: construct full URL
    let backendBaseUrl = 'https://localhost:5001';
    
    if (import.meta.env.VITE_API_BASE_URL) {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      if (apiUrl.startsWith('http://') || apiUrl.startsWith('https://')) {
        backendBaseUrl = apiUrl.replace('/api', '').replace(/\/$/, '');
      }
    } else if (import.meta.env.VITE_BACKEND_URL) {
      backendBaseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '');
    }
    
    return `${backendBaseUrl}${cleanUrl}`;
  } catch (error) {
    console.error('Error normalizing image URL:', error, url);
    return undefined;
  }
}

/**
 * Get all image URLs from product
 */
export function getAllProductImages(product: unknown): string[] {
  const images: string[] = [];

  if (!isRecord(product)) return images;
  
  // Check for single imageUrl (camelCase or PascalCase)
  const imageUrl = getProp(product, "imageUrl") ?? getProp(product, "ImageUrl");
  if (imageUrl && typeof imageUrl === 'string') {
    const normalized = normalizeImageUrl(imageUrl);
    if (normalized) images.push(normalized);
  }
  
  // Check for array of images (camelCase or PascalCase) - List<string>
  const imageArray =
    (getProp(product, "imageUrls") ?? getProp(product, "ImageUrls")) as unknown;
  if (Array.isArray(imageArray)) {
    for (const img of imageArray) {
      if (typeof img === "string") {
        const normalized = normalizeImageUrl(img);
        if (normalized && !images.includes(normalized)) {
          images.push(normalized);
        }
      }
    }
  }

  // Check for array of image objects (camelCase or PascalCase) - List<ImageDto>
  // Backend returns: public List<ImageDto> Images { get; set; }
  // ImageDto: { Url: string }
  const imageObjects =
    (getProp(product, "images") ?? getProp(product, "Images")) as unknown;
  if (Array.isArray(imageObjects)) {
    for (const imgObj of imageObjects) {
      if (!isRecord(imgObj)) continue;
      const imgUrl = getProp(imgObj, "url") ?? getProp(imgObj, "Url");
      if (typeof imgUrl === "string") {
        const normalized = normalizeImageUrl(imgUrl);
        if (normalized && !images.includes(normalized)) {
          images.push(normalized);
        }
      }
    }
  }
  
  return images;
}

/**
 * Get the first image URL from product response
 * Backend returns ImageUrls (PascalCase array) from ProductResponseDto
 */
export function getProductImageUrl(product: unknown): string | undefined {
  try {
    if (!isRecord(product)) return undefined;
    
    // Backend returns ImageUrls (PascalCase) as List<string>
    // Check all possible field names
    const imageUrl = getProp(product, "imageUrl") ?? getProp(product, "ImageUrl");
    const imageUrls = (getProp(product, "imageUrls") ?? getProp(product, "ImageUrls")) as unknown;
    const imageObjects = (getProp(product, "images") ?? getProp(product, "Images")) as unknown;
    
    // Priority 1: single imageUrl
    if (imageUrl && typeof imageUrl === 'string') {
      return normalizeImageUrl(imageUrl);
    }
    
    // Priority 2: first from ImageUrls array (List<string>)
    if (Array.isArray(imageUrls) && imageUrls.length > 0) {
      const firstImage = imageUrls[0];
      if (firstImage && typeof firstImage === 'string') {
        return normalizeImageUrl(firstImage);
      }
    }

    // Priority 3: first from Images array (List<ImageDto>)
    if (Array.isArray(imageObjects) && imageObjects.length > 0) {
      const firstImageObj = imageObjects[0];
      if (isRecord(firstImageObj)) {
        const firstImageUrl = getProp(firstImageObj, "url") ?? getProp(firstImageObj, "Url");
        if (typeof firstImageUrl === "string") {
          return normalizeImageUrl(firstImageUrl);
        }
      }
    }
    
    return undefined;
  } catch (error) {
    console.error('Error getting product image URL:', error, product);
    return undefined;
  }
}

