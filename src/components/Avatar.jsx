import Photo from './Photo.jsx';

const palette = ['#2E4BD8', '#0F7A6A', '#C2542D', '#7A3FA8', '#141A46', '#5E7A1F'];
const hash = (s = '') => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/** Foto anggota tim, atau monogram inisial bila foto belum diisi di CMS. */
export default function Avatar({ name, photo, size = 'md' }) {
  if (photo) {
    return (
      <div className={`avatar avatar--${size}`}>
        <Photo src={photo} alt={`Foto ${name}`} ratio={1} sizes="16rem" seed={name} />
      </div>
    );
  }
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  const c = palette[hash(name) % palette.length];
  return (
    <div className={`avatar avatar--${size} avatar--mono`} style={{ '--c': c }} aria-hidden="true">
      <span>{initials}</span>
    </div>
  );
}
