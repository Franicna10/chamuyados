import { Heart, Sparkles } from "lucide-react";
type HeaderProps = { score: number; lives: number };
export function Header({ score, lives }: HeaderProps) {
  return <header className="site-header">
    <a className="brand" href="#game-title" aria-label="Chamuyados inicio"><span className="brand-mark"><Sparkles size={20} /></span><span>CHAMUYADOS</span></a>
    <div className="player-stats" aria-label="Estado de la partida"><span className="score-pill">⭐ {score} puntos</span><span className="lives-pill"><Heart size={18} fill="currentColor" /> {lives}</span></div>
  </header>;
}
