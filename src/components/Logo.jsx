/** Logo: cakrawala bertingkat dengan matahari terbit (aruna = fajar). */
export function LogoMark({ size = 32, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <circle cx="20" cy="13" r="4.5" fill="var(--dawn)" />
      <ellipse cx="20" cy="26" rx="18" ry="7.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <ellipse cx="20" cy="26" rx="11.5" ry="4.6" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <ellipse cx="20" cy="26" rx="5" ry="2" fill="currentColor" />
    </svg>
  );
}

export default function Logo() {
  return (
    <span className="logo">
      <LogoMark />
      <span className="logo__word">
        Aruna<span className="logo__thin">Digital</span>
      </span>
    </span>
  );
}
