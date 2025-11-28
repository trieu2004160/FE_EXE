// Image Utilities - Handle image URLs from backend

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
export function getAllProductImages(product: any): string[] {
  const images: string[] = [];
  
  // Check for single imageUrl (camelCase or PascalCase)
  const imageUrl = product.imageUrl || product.ImageUrl;
  if (imageUrl && typeof imageUrl === 'string') {
    const normalized = normalizeImageUrl(imageUrl);
    if (normalized) images.push(normalized);
  }
  
  // Check for array of images (camelCase or PascalCase) - List<string>
  const imageArray = product.imageUrls || product.ImageUrls || [];
  if (Array.isArray(imageArray)) {
    imageArray.forEach((img: any) => {
      if (img && typeof img === 'string') {
        const normalized = normalizeImageUrl(img);
        if (normalized && !images.includes(normalized)) {
          images.push(normalized);
        }
      }
    });
  }

  // Check for array of image objects (camelCase or PascalCase) - List<ImageDto>
  // Backend returns: public List<ImageDto> Images { get; set; }
  // ImageDto: { Url: string }
  const imageObjects = product.images || product.Images || [];
  if (Array.isArray(imageObjects)) {
    imageObjects.forEach((imgObj: any) => {
      // Handle object with Url/url property
      const imgUrl = imgObj.url || imgObj.Url;
      if (imgUrl && typeof imgUrl === 'string') {
        const normalized = normalizeImageUrl(imgUrl);
        if (normalized && !images.includes(normalized)) {
          images.push(normalized);
        }
      }
    });
  }
  
  return images;
}

/**
 * Get the first image URL from product response
 * Backend returns ImageUrls (PascalCase array) from ProductResponseDto
 */
export function getProductImageUrl(product: any): string | undefined {
  try {
    if (!product) return undefined;
    
    // Backend returns ImageUrls (PascalCase) as List<string>
    // Check all possible field names
    const imageUrl = product.imageUrl || product.ImageUrl;
    const imageUrls = product.imageUrls || product.ImageUrls || [];
    const imageObjects = product.images || product.Images || [];
    
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
      const firstImageUrl = firstImageObj.url || firstImageObj.Url;
      if (firstImageUrl && typeof firstImageUrl === 'string') {
        return normalizeImageUrl(firstImageUrl);
      }
    }
    
    return undefined;
  } catch (error) {
    console.error('Error getting product image URL:', error, product);
    return undefined;
  }
}

