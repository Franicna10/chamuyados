import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { BackButton as Back } from "@/components/BackButton";
import { PlayerAvatar as Avatar } from "@/components/PlayerAvatar";
import { answerOptions, createRound, gameCategories, type Question } from "./game-data";

type Screen = "home" | "profile" | "help" | "ranking" | "mode" | "categories" | "question" | "feedback" | "result";
type FinishReason = "completed" | "timeout" | "abandoned";
type MatchResult = {
  id: string;
  playedAt: string;
  player: string;
  avatar: string;
  color: string;
  category: string;
  score: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  average: number;
  rank: string;
};

const avatars = ["🐱", "🦋", "🐸", "🦄", "🦉"];
const colors = ["#ff4d86", "#8d5cff", "#26c6a1", "#ffad32", "#42a5f5"];
const gameDurationSeconds = 75;
const paths: Record<Screen, string> = {
  home: "/",
  profile: "/profile",
  help: "/help",
  ranking: "/ranking",
  mode: "/mode",
  categories: "/categories",
  question: "/game/question",
  feedback: "/game/feedback",
  result: "/result",
};
const rankingStorageKey = "chamuyados.matches.v1";

function isMatchResult(value: unknown): value is MatchResult {
  if (typeof value !== "object" || value === null) return false;
  const match = value as Record<string, unknown>;
  return typeof match.id === "string"
    && typeof match.playedAt === "string"
    && typeof match.player === "string"
    && typeof match.avatar === "string"
    && typeof match.color === "string"
    && typeof match.category === "string"
    && typeof match.score === "number"
    && typeof match.correct === "number"
    && typeof match.incorrect === "number"
    && typeof match.unanswered === "number"
    && typeof match.average === "number"
    && typeof match.rank === "string";
}

function readMatches(): MatchResult[] {
  try {
    const stored = window.localStorage.getItem(rankingStorageKey);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) throw new Error("El historial guardado no tiene el formato esperado.");
    const matches = parsed.filter(isMatchResult);
    if (matches.length !== parsed.length) {
      console.error("Se encontraron entradas inválidas en el ranking local de Chamuyados.");
    }
    return matches;
  } catch (error) {
    console.error("No se pudo leer el ranking local de Chamuyados.", error);
    return [];
  }
}

function rankFor(score: number): string {
  if (score >= 900) return "Leyenda del chamuyo";
  if (score >= 700) return "Crack del levante";
  if (score >= 300) return "Radar afinado";
  return "Aprendiz del chamuyo";
}

function sortMatches(matches: MatchResult[]): MatchResult[] {
  return [...matches].sort((a, b) => b.score - a.score || b.playedAt.localeCompare(a.playedAt));
}

export default function GameApp() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const screen = (Object.entries(paths).find(([, path]) => path === pathname)?.[0] ?? "home") as Screen;
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("🐱");
  const [color, setColor] = useState(colors[0]);
  const [category, setCategory] = useState("Red o Green Flag");
  const [questions, setQuestions] = useState<Question[]>(() => createRound("Red o Green Flag"));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameDurationSeconds);
  const [timerActive, setTimerActive] = useState(false);
  const [finishReason, setFinishReason] = useState<FinishReason | null>(null);
  const [lastResult, setLastResult] = useState<MatchResult | null>(null);
  const [shareMessage, setShareMessage] = useState("");
  const savedMatchesRef = useRef<MatchResult[]>([]);
  const [savedMatches, setSavedMatches] = useState<MatchResult[]>(() => {
    const matches = readMatches();
    savedMatchesRef.current = matches;
    return matches;
  });
  const deadline = useRef<number | null>(null);
  const answeredQuestions = useRef(new Set<number>());
  const correctCountRef = useRef(0);
  const incorrectCountRef = useRef(0);
  const scoreRef = useRef(0);
  const finished = useRef(false);

  const go = useCallback((nextScreen: Screen, replace = false) => {
    navigate(paths[nextScreen], { replace });
  }, [navigate]);

  const finishGame = useCallback((reason: FinishReason) => {
    if (finished.current) return;
    finished.current = true;
    deadline.current = null;
    setTimerActive(false);
    setFinishReason(reason);
    if (reason === "timeout") setTimeLeft(0);
    const correct = correctCountRef.current;
    const incorrect = incorrectCountRef.current;
    const unanswered = Math.max(0, questions.length - correct - incorrect);
    const result: MatchResult = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      playedAt: new Date().toISOString(),
      player: name.trim() || "Anónimo",
      avatar,
      color,
      category,
      score: scoreRef.current,
      correct,
      incorrect,
      unanswered,
      average: correct + incorrect === 0 ? 0 : Math.round((correct / (correct + incorrect)) * 100),
      rank: rankFor(scoreRef.current),
    };
    setLastResult(result);
    const matches = sortMatches([...savedMatchesRef.current, result]);
    savedMatchesRef.current = matches;
    setSavedMatches(matches);
    try {
      window.localStorage.setItem(rankingStorageKey, JSON.stringify(matches));
    } catch (error) {
      console.error("No se pudo guardar la partida en el ranking local.", error);
    }
    go("result");
  }, [avatar, category, color, go, name, questions.length]);

  useEffect(() => {
    if (!timerActive) return undefined;
    const interval = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil(((deadline.current ?? Date.now()) - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) finishGame("timeout");
    }, 250);
    return () => window.clearInterval(interval);
  }, [finishGame, timerActive]);

  useEffect(() => {
    if (screen === "question" && !timerActive) go("categories", true);
    if (screen === "feedback" && !timerActive) go("categories", true);
  }, [go, screen, selected, timerActive]);

  useEffect(() => {
    if (finished.current && !timerActive && (screen === "question" || screen === "feedback")) go("result", true);
  }, [go, screen, timerActive, lastResult]);

  const goHome = () => {
    if (timerActive) {
      setTimerActive(false);
      deadline.current = null;
      finished.current = true;
    }
    go("home");
  };

  const startGame = (nextCategory: string) => {
    const round = createRound(nextCategory);
    setCategory(nextCategory);
    setQuestions(round);
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    correctCountRef.current = 0;
    incorrectCountRef.current = 0;
    scoreRef.current = 0;
    answeredQuestions.current = new Set();
    finished.current = false;
    setTimeLeft(gameDurationSeconds);
    setFinishReason(null);
    setLastResult(null);
    deadline.current = Date.now() + gameDurationSeconds * 1000;
    setTimerActive(true);
    go("question");
  };

  const answer = (index: number) => {
    if (finished.current || answeredQuestions.current.has(questionIndex) || selected !== null) return;
    if (deadline.current !== null && Date.now() >= deadline.current) {
      finishGame("timeout");
      return;
    }
    answeredQuestions.current.add(questionIndex);
    setSelected(index);
    if (answerOptions[index] === questions[questionIndex].correct) {
      correctCountRef.current += 1;
      scoreRef.current += 100;
      setCorrectCount(correctCountRef.current);
      setScore(scoreRef.current);
    } else {
      incorrectCountRef.current += 1;
      setIncorrectCount(incorrectCountRef.current);
    }
    go("feedback");
  };

  const next = () => {
    if (finished.current || selected === null) return;
    if (questionIndex + 1 < questions.length) {
      setQuestionIndex((current) => current + 1);
      setSelected(null);
      go("question");
    } else {
      finishGame("completed");
    }
  };

  const currentQuestion = questions[questionIndex];
  const showQuestion = (screen === "question" || screen === "feedback") && selected === null;
  const showFeedback = screen === "feedback" || (screen === "question" && selected !== null);
  const currentPlayerMatches = savedMatches.filter((match) => match.player === (name.trim() || "Anónimo"));
  const totalPoints = currentPlayerMatches.reduce((total, match) => total + match.score, 0);

  return (
    <main className={`app screen-${screen}`}>
      {screen === "home" && <section className="dark-screen home-screen">
        <div className="sparkles" aria-hidden="true">✦ ♡ ✧</div>
        <div className="home-content">
          <div className="hero-avatars"><Avatar value="🐱" color="#ff4d86" /><Avatar value="🦉" color="#8d5cff" /><Avatar value="🦋" color="#26c6a1" /></div>
          <Logo />
          <p className="tagline">¿Cuánto sabés del arte de chamuyar?</p>
          <button className="primary jumbo" onClick={() => go("profile")}>Empezar a jugar <span aria-hidden="true">→</span></button>
          <div className="home-links">
            <button onClick={() => go("help")}>📖 ¿Cómo jugar?</button>
            <button onClick={() => go("ranking")}>🏆 Ranking local</button>
          </div>
        </div>
        <footer>V1.0 · Hecho con <b>♥</b> en Argentina</footer>
      </section>}

      {screen === "profile" && <section className="light-screen">
        <Back onClick={goHome} />
        <div className="panel profile-panel">
          <h1>Armá tu perfil chamuyero</h1>
          <p>Elegí cómo querés aparecer en el juego.</p>
          <div className="profile-preview"><Avatar value={avatar} color={color} /><div><strong>{name || "Tu nombre"}</strong><span>Aprendiz del chamuyo</span></div></div>
          <label htmlFor="player-name">Tu nombre</label>
          <input id="player-name" value={name} maxLength={16} onChange={(event) => setName(event.target.value)} placeholder="Tu nombre" />
          <fieldset><legend>Elegí tu avatar</legend><div className="choice-row">{avatars.map((option) => <button type="button" key={option} aria-label={`Avatar ${option}`} aria-pressed={avatar === option} className={avatar === option ? "chosen" : ""} onClick={() => setAvatar(option)}>{option}</button>)}</div></fieldset>
          <fieldset><legend>Elegí tu color</legend><div className="color-row">{colors.map((option) => <button type="button" aria-label={`Color ${option}`} aria-pressed={color === option} key={option} className={color === option ? "chosen" : ""} style={{ background: option }} onClick={() => setColor(option)} />)}</div></fieldset>
          <button className="primary full" onClick={() => go("mode")}>Continuar →</button>
        </div>
      </section>}

      {screen === "help" && <section className="light-screen">
        <Back onClick={() => go("home")} />
        <div className="panel help-panel">
          <div className="round-icon" aria-hidden="true">📖</div><h1>Cómo jugar</h1>
          <p>Demostrá cuánto sabés del arte de chamuyar.</p>
          <ol>{[
            ["Elegí una categoría", "Hay situaciones distintas para cada tema."],
            ["Respondé a tiempo", `Tenés ${gameDurationSeconds} segundos para toda la partida, también durante las devoluciones.`],
            ["Sumá puntos", "Cada respuesta correcta vale 100 puntos."],
            ["Aprendé y compará", "Después de cada respuesta vas a ver la solución y una explicación breve."],
          ].map(([title, detail], index) => <li key={title}><b>{index + 1}</b><div><strong>{title}</strong><span>{detail}</span></div></li>)}</ol>
          <div className="tip">💡 Las situaciones son para conversar y aprender: no hay respuestas perfectas para todos los vínculos.</div>
          <button className="primary full" onClick={() => go("profile")}>¡Entendido! Empezar</button>
        </div>
      </section>}

      {screen === "ranking" && <section className="dark-screen">
        <Back light onClick={() => go("home")} />
        <div className="ranking-content">
          <div className="trophy" aria-hidden="true">🏆</div><h1>Ranking local</h1>
          <p>Partidas reales guardadas en este navegador, ordenadas por puntaje.</p>
          {savedMatches.length === 0
            ? <div className="empty-ranking"><p>Todavía no hay partidas guardadas.</p><button className="primary" onClick={() => go("profile")}>Jugar la primera</button></div>
            : <div className="rank-list">{savedMatches.map((match, index) => <div key={match.id}>
              <b>#{index + 1}</b><Avatar value={match.avatar} color={match.color} small />
              <strong>{match.player} · {match.category}</strong>
              <span>{match.score} ⭐</span>
            </div>)}</div>}
        </div>
      </section>}

      {screen === "mode" && <section className="light-screen">
        <Back onClick={() => go("profile")} />
        <div className="user-chip"><Avatar value={avatar} color={color} small /><div><strong>{name || "Tu nombre"}</strong><span>{totalPoints} ⭐ acumuladas</span></div></div>
        <div className="selection">
          <h1>¿Cómo querés jugar?</h1><p>Una partida individual, a tu ritmo.</p>
          <div className="mode-grid"><button onClick={() => go("categories")}><span className="mode-icon">🎯</span><div><strong>Solo</strong><small>Poné a prueba tu chamuyo</small></div><b aria-hidden="true">→</b></button></div>
        </div>
      </section>}

      {screen === "categories" && <section className="dark-screen">
        <Back light onClick={() => go("mode")} />
        <div className="score-chip"><Avatar value={avatar} color={color} small /><span>{totalPoints} ⭐</span></div>
        <div className="category-content">
          <h1>¿Sobre qué te chamuyamos?</h1><p>Elegí una categoría para arrancar.</p>
          <div className="category-grid">{gameCategories.map(({ icon, title, description }) => <button key={title} onClick={() => startGame(title)}><span aria-hidden="true">{icon}</span><strong>{title}</strong><small>{description}</small></button>)}</div>
          <small className="game-note">10 preguntas · {gameDurationSeconds} segundos para toda la partida</small>
        </div>
      </section>}

      {showQuestion && <section className="dark-screen question-screen">
        <div className="game-top">
          <button aria-label="Salir de la partida" title="Salir de la partida" onClick={() => finishGame("abandoned")}>✕</button>
          <div><span>Pregunta {questionIndex + 1} de {questions.length}</span><div className="question-progress" role="progressbar" aria-valuenow={questionIndex + 1} aria-valuemin={1} aria-valuemax={questions.length}><i style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div></div>
          <div className="mini-score">⭐ {score}</div>
        </div>
        <div className="question-card">
          <div className="question-meta"><span>{category}</span><b aria-label={`Quedan ${timeLeft} segundos`}>⏱ {timeLeft}s</b></div>
          <h1>{currentQuestion.title}</h1>
          <div className="answers">{answerOptions.map((option, index) => <button key={option} onClick={() => answer(index)} disabled={selected !== null || timeLeft === 0}>
            <b aria-hidden="true">{option === "Chamuyo" ? "💬" : option === "Red flag" ? "🚩" : "💚"}</b><span>{option}</span>
          </button>)}</div>
        </div>
      </section>}

      {showFeedback && selected !== null && <section className={`dark-screen feedback-screen ${answerOptions[selected] === currentQuestion.correct ? "right" : "wrong"}`}>
        <div className="feedback-emoji" aria-hidden="true">{answerOptions[selected] === currentQuestion.correct ? "✨💚✨" : "💔😅"}</div>
        <div className="feedback-mark" aria-hidden="true">{answerOptions[selected] === currentQuestion.correct ? "✓" : "×"}</div>
        <h1>{answerOptions[selected] === currentQuestion.correct ? "¡Ese chamuyo suma!" : "Uy... te clavaron el visto"}</h1>
        <p>{answerOptions[selected] === currentQuestion.correct ? "+100 puntos" : "No pasa nada, el chamuyo se aprende con práctica."}</p>
        <div className="feedback-card"><strong>{currentQuestion.title}</strong><div className="answer-review">Respuesta correcta: <b>{currentQuestion.correct}</b></div><div className="fact"><b>💡 Dato chamuyero</b><span>{currentQuestion.tip}</span></div></div>
        <p className="feedback-timer" aria-live="polite">Quedan {timeLeft} segundos de la partida</p>
        <button className="primary" onClick={next} disabled={finished.current}>{questionIndex + 1 < questions.length ? "Siguiente pregunta →" : "Ver resultado →"}</button>
      </section>}

      {screen === "result" && <section className="dark-screen result-screen">
        <div className="result-emoji" aria-hidden="true">🎉🌱💞</div>
        <h1>
          {finishReason === "timeout"
            ? "¡Se terminó el tiempo!"
            : finishReason === "abandoned"
              ? "Saliste de la partida"
              : "¡Partida terminada!"}
        </h1>
        <p>
          {finishReason === "timeout"
            ? "El reloj llegó a cero. Acá está tu resultado."
            : finishReason === "abandoned"
              ? "La ronda se cerró y el tiempo se detuvo. Tus respuestas ya dadas se conservaron."
              : "Una ronda más para afinar el radar."}
        </p>
        <div className="final-score"><strong>{lastResult?.score ?? score}</strong><span>puntos</span></div>
        <div className="stats">
          <div><b>{lastResult?.correct ?? correctCount}</b><span>Correctas</span></div>
          <div><b>{lastResult?.incorrect ?? incorrectCount}</b><span>Incorrectas</span></div>
          <div><b>{lastResult?.average ?? (correctCount + incorrectCount === 0 ? 0 : Math.round((correctCount / (correctCount + incorrectCount)) * 100))}%</b><span>Promedio de aciertos</span></div>
          <div><b>{lastResult?.unanswered ?? Math.max(0, questions.length - correctCount - incorrectCount)}</b><span>Sin responder</span></div>
        </div>
        <div className="rank-earned"><span aria-hidden="true">🏅</span><div><small>Rango obtenido</small><strong>{lastResult?.rank ?? rankFor(score)}</strong></div></div>
        <div className="result-actions">
          <button className="primary" onClick={() => startGame(category)}>↻ Jugar de nuevo</button>
          <button onClick={async () => {
            try {
              await navigator.clipboard.writeText(`Hice ${lastResult?.score ?? score} puntos en Chamuyados`);
              setShareMessage("Resultado copiado para compartir.");
            } catch (error) {
              console.error("No se pudo copiar el resultado.", error);
              setShareMessage("No se pudo copiar. Podés anotar tu puntaje y compartirlo.");
            }
          }}>↗ Compartir resultado</button>
          <button onClick={goHome}>⌂ Inicio</button>
        </div>
        {shareMessage && <p role="status">{shareMessage}</p>}
      </section>}
      <Outlet />
    </main>
  );
}
