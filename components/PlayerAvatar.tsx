export function PlayerAvatar({ value, color, small = false }: { value: string; color: string; small?: boolean }) {
  return <span className={`avatar ${small ? "small" : ""}`} style={{ background: color }}>{value}</span>;
}
