/**
 * OptimizedImage — Cloudinary-aware lazy-loading image component.
 *
 * Features:
 * - Automatically transforms Cloudinary URLs with width, format & quality params
 * - Adds loading="lazy" by default (set priority for above-the-fold images)
 * - Generates srcSet for retina displays (1x + 2x)
 * - Uses decoding="async" for non-blocking decode
 */
export default function OptimizedImage({
  src,
  alt = '',
  width,
  className = '',
  priority = false,
  ...props
}) {
  // Transform Cloudinary URLs to include optimization params
  const optimizedSrc = transformCloudinaryUrl(src, width);
  const retinaUrl = width ? transformCloudinaryUrl(src, width * 2) : null;

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      {...(priority && { fetchPriority: 'high' })}
      {...(retinaUrl && { srcSet: `${optimizedSrc} 1x, ${retinaUrl} 2x` })}
      {...props}
    />
  );
}

/**
 * Injects Cloudinary transform params (f_auto, q_auto, w_<width>) into a
 * Cloudinary URL.  Non-Cloudinary URLs are returned unchanged.
 *
 * Example:
 *   https://res.cloudinary.com/demo/image/upload/v1234/photo.jpg
 *   → https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_400/v1234/photo.jpg
 */
function transformCloudinaryUrl(url, width) {
  if (!url || !url.includes('res.cloudinary.com')) return url;

  // Build transform string
  const transforms = ['f_auto', 'q_auto'];
  if (width) transforms.push(`w_${width}`);
  const transformStr = transforms.join(',');

  // Insert transforms after /upload/
  return url.replace('/upload/', `/upload/${transformStr}/`);
}
