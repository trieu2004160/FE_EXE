// Image Utilities - Handle image URLs from backend

/**
 * Get the first image URL from product response
 * Backend may return ImageUrls (array) or imageUrl (single string)
 */
export function getProductImageUrl(product: {
  imageUrl?: string;
  imageUrls?: string[];
  ImageUrls?: string[];
}): string | undefined {
  console.log('getProductImageUrl - Product data:', {
    name: (product as any).name || 'Unknown',
    imageUrl: product.imageUrl,
    imageUrls: product.imageUrls,
    ImageUrls: product.ImageUrls,
  });

  // Priority: imageUrl > imageUrls > ImageUrls > first from array
  if (product.imageUrl) {
    return normalizeImageUrl(product.imageUrl);
  }
  
  const images = product.imageUrls || product.ImageUrls || [];
  console.log('getProductImageUrl - Found images array:', images);
  if (images.length > 0) {
    const normalized = normalizeImageUrl(images[0]);
    console.log('getProductImageUrl - Normalized URL:', normalized);
    return normalized;
  }
  
  console.log('getProductImageUrl - No images found');
  return undefined;
}

/**
 * Normalize image URL - handle relative paths from backend
 * Backend returns paths like /images/products/xxx.jpg
 * Use proxy in development, or full URL in production
 */
function normalizeImageUrl(url: string | undefined | null): string | undefined {
  if (!url || url.trim() === '') {
    console.log('normalizeImageUrl: Empty URL');
    return undefined;
  }

  // If already absolute URL (http:// or https://), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    console.log('normalizeImageUrl: Already absolute URL:', url);
    return url;
  }

  // Ensure URL starts with / for relative paths
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;

  // In development, use proxy (vite.config.ts proxies /images to backend)
  // In production, need full backend URL
  if (import.meta.env.DEV) {
    // Development: use proxy - vite will proxy /images/* to https://localhost:5001/images/*
    console.log('normalizeImageUrl: Dev mode, using proxy URL:', cleanUrl);
    return cleanUrl;
  }

  // Production: construct full URL
  let backendBaseUrl = 'https://localhost:5001';
  
  if (import.meta.env.VITE_API_BASE_URL) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    if (apiUrl.startsWith('http://') || apiUrl.startsWith('https://')) {
      // Full URL like https://localhost:5001/api
      backendBaseUrl = apiUrl.replace('/api', '');
    } else if (apiUrl.startsWith('/api')) {
      // Relative path like /api, use default backend
      backendBaseUrl = 'https://localhost:5001';
    }
  } else if (import.meta.env.VITE_BACKEND_URL) {
    backendBaseUrl = import.meta.env.VITE_BACKEND_URL;
  }
  
  // Construct full URL: https://localhost:5001/images/products/xxx.jpg
  return `${backendBaseUrl}${cleanUrl}`;
}

/**
 * Get all image URLs from product
 */
export function getAllProductImages(product: {
  imageUrl?: string;
  imageUrls?: string[];
  ImageUrls?: string[];
}): string[] {
  const images: string[] = [];
  
  // Add single imageUrl if exists
  if (product.imageUrl) {
    const normalized = normalizeImageUrl(product.imageUrl);
    if (normalized) images.push(normalized);
  }
  
  // Add array of images
  const imageArray = product.imageUrls || product.ImageUrls || [];
  imageArray.forEach(img => {
    const normalized = normalizeImageUrl(img);
    if (normalized && !images.includes(normalized)) {
      images.push(normalized);
    }
  });
  
  return images;
}

