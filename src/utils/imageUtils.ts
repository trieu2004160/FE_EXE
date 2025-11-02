// Image Utilities - Handle image URLs from backend

/**
 * Normalize image URL - handle relative paths from backend
 * Backend returns paths like /images/products/xxx.jpg or full URLs
 * Use proxy in development, or full URL in production
 */
export function normalizeImageUrl(url: string | undefined | null): string | undefined {
  try {
    if (!url || typeof url !== 'string' || url.trim() === '') {
      return undefined;
    }

    const trimmedUrl = url.trim();

    // If already absolute URL (http:// or https://), return as is
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
      return trimmedUrl;
    }

    // Ensure URL starts with / for relative paths
    const cleanUrl = trimmedUrl.startsWith('/') ? trimmedUrl : `/${trimmedUrl}`;

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
  
  // Check for array of images (camelCase or PascalCase)
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
    
    // Priority: single imageUrl > first from ImageUrls array
    if (imageUrl && typeof imageUrl === 'string') {
      return normalizeImageUrl(imageUrl);
    }
    
    // Check array of images
    if (Array.isArray(imageUrls) && imageUrls.length > 0) {
      const firstImage = imageUrls[0];
      if (firstImage && typeof firstImage === 'string') {
        return normalizeImageUrl(firstImage);
      }
    }
    
    return undefined;
  } catch (error) {
    console.error('Error getting product image URL:', error, product);
    return undefined;
  }
}

