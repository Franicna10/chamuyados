export function BackButton({ onClick, light = false }: { onClick: () => void; light?: boolean }) {
  return <button className={`back ${light ? "light" : ""}`} aria-label="Volver" onClick={onClick}>← <span>Volver</span></button>;
}
