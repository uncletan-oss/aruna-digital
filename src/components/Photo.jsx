import { useEffect, useRef, useState } from 'react';
import ArenaArt from './ArenaArt.jsx';

const WIDTHS = [480, 768, 1080, 1440, 1920];
const isUnsplash = (src) => /^https:\/\/images\.unsplash\.com\//.test(src || '');

/** URL gambar dengan ukuran tertentu (Unsplash dipotong & dikompres otomatis oleh CDN-nya). */
export function imageUrl(src, w = 1200, h) {
  if (!src) return '';
  if (!isUnsplash(src)) return src;
  const base = src.split('?')[0];
  return `${base}?auto=format&fit=crop&q=72&w=${w}${h ? `&h=${h}` : ''}`;
}

/**
 * Foto responsif (srcset + lazy-load). Bila foto gagal dimuat atau kosong,
 * tampil ilustrasi generatif sebagai pengganti sehingga layout tidak rusak.
 */
export default function Photo({ src, alt = '', ratio, sizes = '100vw', priority = false, seed, accent, credit, className = '' }) {
  const [failed, setFailed] = useState(!src);
  const ref = useRef(null);

  useEffect(() => {
    setFailed(!src);
    // Gambar yang gagal sebelum React hydrate tidak memicu onError — periksa manual.
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, [src]);

  const h = (w) => (ratio ? Math.round(w / ratio) : undefined);
  return (
    <figure className={`photo ${className}`} style={ratio ? { aspectRatio: String(ratio) } : undefined}>
      {failed ? (
        <ArenaArt seed={seed || src || alt} accent={accent} title={alt || undefined} />
      ) : (
        <img
          ref={ref}
          src={imageUrl(src, 1440, h(1440))}
          srcSet={isUnsplash(src) ? WIDTHS.map((w) => `${imageUrl(src, w, h(w))} ${w}w`).join(', ') : undefined}
          sizes={sizes}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchpriority={priority ? 'high' : undefined}
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
      {credit && !failed && (
        <figcaption className="photo__credit">
          Foto: {credit} / Unsplash
        </figcaption>
      )}
    </figure>
  );
}
