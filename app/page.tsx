import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { BackButton as Back } from "@/components/BackButton";
import { PlayerAvatar as Avatar } from "@/components/PlayerAvatar";
import { answerOptions, createRound, gameCategories, quoteQuestions, type Question, type QuoteQuestion } from "./game-data";

type Screen = "home" | "profile" | "help" | "ranking" | "mode" | "categories" | "question" | "feedback" | "result";
type FinishReason = "completed" | "timeout" | "abandoned";
type GameMode = "classic" | "who-said";
type Difficulty = "Fácil" | "Difícil";
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
  gameMode: GameMode;
  difficulty: Difficulty | null;
};
type StoredMatchResult = Omit<MatchResult, "gameMode" | "difficulty"> & {
  gameMode?: GameMode;
  difficulty?: Difficulty | "Media" | null;
};

const avatars = ["🐱", "🦋", "🐸", "🦄", "🦉"];
const colors = ["#ff4d86", "#8d5cff", "#26c6a1", "#ffad32", "#42a5f5"];
const gameDurationSeconds = 75;
const difficulties: Difficulty[] = ["Fácil", "Difícil"];
const quoteGameTitle = "Farándula argentina: ¿quién lo dijo?";
const quoteRankingTitle = "¿Quién lo dijo?";
const classicGameTitle = "Juego clásico";
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

function isStoredMatchResult(value: unknown): value is StoredMatchResult {
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
    && typeof match.rank === "string"
    && (match.gameMode === undefined || match.gameMode === "classic" || match.gameMode === "who-said")
    && (match.difficulty === undefined || match.difficulty === null || match.difficulty === "Fácil" || match.difficulty === "Media" || match.difficulty === "Difícil");
}

function parseMatchResult(value: unknown): MatchResult | null {
  if (!isStoredMatchResult(value)) return null;
  const gameMode = value.gameMode ?? "classic";
  return {
    id: value.id,
    playedAt: value.playedAt,
    player: value.player,
    avatar: value.avatar,
    color: value.color,
    category: value.category,
    score: value.score,
    correct: value.correct,
    incorrect: value.incorrect,
    unanswered: value.unanswered,
    average: value.average,
    rank: value.rank,
    gameMode,
    difficulty: gameMode === "who-said"
      ? value.difficulty === "Fácil" ? "Fácil" : "Difícil"
      : null,
  };
}

function readMatches(): MatchResult[] {
  try {
    const stored = window.localStorage.getItem(rankingStorageKey);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) throw new Error("El historial guardado no tiene el formato esperado.");
    const matches = parsed.map(parseMatchResult).filter((match): match is MatchResult => match !== null);
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

function normalizeAnswer(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("es")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function isAcceptedQuoteAnswer(question: QuoteQuestion, value: string): boolean {
  const answer = normalizeAnswer(value);
  return question.acceptedAnswers.some((accepted) => normalizeAnswer(accepted) === answer);
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
  const [quoteRound, setQuoteRound] = useState<QuoteQuestion[]>([]);
  const [gameMode, setGameMode] = useState<GameMode>("classic");
  const [modeChoice, setModeChoice] = useState<GameMode | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("Fácil");
  const [rankingMode, setRankingMode] = useState<GameMode>("classic");
  const [rankingDifficulty, setRankingDifficulty] = useState<Difficulty>("Fácil");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [quoteAnswer, setQuoteAnswer] = useState("");
  const [quoteAnswerCorrect, setQuoteAnswerCorrect] = useState<boolean | null>(null);
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
    const totalQuestions = gameMode === "who-said" ? quoteRound.length : questions.length;
    const unanswered = Math.max(0, totalQuestions - correct - incorrect);
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
      gameMode,
      difficulty: gameMode === "who-said" ? difficulty : null,
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
  }, [avatar, category, color, difficulty, gameMode, go, name, questions.length, quoteRound.length]);

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

  const startGame = (nextCategory: string, nextMode: GameMode, nextDifficulty: Difficulty = "Fácil") => {
    const round = nextMode === "classic" ? createRound(nextCategory) : [];
    setCategory(nextCategory);
    setQuestions(round);
    setQuoteRound(nextMode === "who-said" ? quoteQuestions : []);
    setGameMode(nextMode);
    setDifficulty(nextDifficulty);
    setQuestionIndex(0);
    setSelected(null);
    setQuoteAnswer("");
    setQuoteAnswerCorrect(null);
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

  const answerQuote = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const currentQuote = quoteRound[questionIndex];
    if (finished.current || !currentQuote || answeredQuestions.current.has(questionIndex) || !quoteAnswer.trim()) return;
    if (deadline.current !== null && Date.now() >= deadline.current) {
      finishGame("timeout");
      return;
    }
    answeredQuestions.current.add(questionIndex);
    const correct = isAcceptedQuoteAnswer(currentQuote, quoteAnswer);
    setQuoteAnswerCorrect(correct);
    if (correct) {
      correctCountRef.current += 1;
      scoreRef.current += difficulty === "Difícil" ? 200 : 100;
      setCorrectCount(correctCountRef.current);
      setScore(scoreRef.current);
    } else {
      incorrectCountRef.current += 1;
      setIncorrectCount(incorrectCountRef.current);
    }
    go("feedback");
  };

  const next = useCallback(() => {
    if (finished.current || (gameMode === "who-said" ? quoteAnswerCorrect === null : selected === null)) return;
    if (deadline.current !== null && Date.now() >= deadline.current) {
      finishGame("timeout");
      return;
    }
    const totalQuestions = gameMode === "who-said" ? quoteRound.length : questions.length;
    if (questionIndex + 1 < totalQuestions) {
      setQuestionIndex((current) => current + 1);
      setSelected(null);
      setQuoteAnswer("");
      setQuoteAnswerCorrect(null);
      go("question");
    } else {
      finishGame("completed");
    }
  }, [finishGame, gameMode, go, questionIndex, questions.length, quoteAnswerCorrect, quoteRound.length, selected]);

  useEffect(() => {
    if (gameMode !== "who-said" || screen !== "feedback" || quoteAnswerCorrect !== true) return undefined;
    const timeout = window.setTimeout(next, 1000);
    return () => window.clearTimeout(timeout);
  }, [gameMode, next, quoteAnswerCorrect, screen]);

  const currentQuestion = questions[questionIndex];
  const currentQuote = quoteRound[questionIndex];
  const totalQuestions = gameMode === "who-said" ? quoteRound.length : questions.length;
  const showQuestion = (screen === "question" || screen === "feedback")
    && (gameMode === "who-said" ? quoteAnswerCorrect === null : selected === null);
  const showFeedback = (screen === "feedback" || (screen === "question" && (gameMode === "who-said" ? quoteAnswerCorrect !== null : selected !== null)))
    && (gameMode === "who-said" ? quoteAnswerCorrect !== null : selected !== null);
  const currentPlayerMatches = savedMatches.filter((match) => match.player === (name.trim() || "Anónimo"));
  const selectedMode = modeChoice ?? gameMode;
  const totalPoints = currentPlayerMatches
    .filter((match) => match.gameMode === selectedMode
      && (selectedMode === "classic" || match.difficulty === difficulty))
    .reduce((total, match) => total + match.score, 0);
  const visibleRanking = savedMatches.filter((match) => match.gameMode === rankingMode
    && (rankingMode === "classic" || match.difficulty === rankingDifficulty));
  const itemName = gameMode === "who-said" ? "Frase" : "Pregunta";

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
          <p>Elegí entre el juego clásico y “¿Quién lo dijo?”.</p>
          <ol>{[
            ["Juego clásico", "Elegí una categoría y clasificá cada situación como Chamuyo, Red flag o Green flag."],
            ["¿Quién lo dijo?", "Escribí quién dijo cada frase; cada respuesta cuenta una sola vez."],
            ["Elegí dificultad", "Fácil muestra una pista sobre el ámbito de la frase. Difícil no muestra pistas y suma 200 puntos por acierto."],
            ["Respondé a tiempo", `Tenés ${gameDurationSeconds} segundos para toda la partida, también durante las devoluciones y sin reiniciar entre frases.`],
            ["Rankings separados", "Los puntajes se guardan por modo y, en “¿Quién lo dijo?”, también por dificultad."],
          ].map(([title, detail], index) => <li key={title}><b>{index + 1}</b><div><strong>{title}</strong><span>{detail}</span></div></li>)}</ol>
          <div className="tip">💡 Las situaciones son para conversar y aprender: no hay respuestas perfectas para todos los vínculos.</div>
          <button className="primary full" onClick={() => go("profile")}>¡Entendido! Empezar</button>
        </div>
      </section>}

      {screen === "ranking" && <section className="dark-screen">
        <Back light onClick={() => go("home")} />
        <div className="ranking-content">
          <div className="trophy" aria-hidden="true">🏆</div><h1>Ranking local</h1>
          <p>Partidas guardadas en este navegador, separadas por modo y dificultad.</p>
          <div className="tabs ranking-tabs" aria-label="Modo del ranking">
            <button className={rankingMode === "classic" ? "active" : ""} onClick={() => setRankingMode("classic")}>{classicGameTitle}</button>
            <button className={rankingMode === "who-said" ? "active" : ""} onClick={() => setRankingMode("who-said")}>{quoteRankingTitle}</button>
          </div>
          {rankingMode === "who-said" && <div className="tabs difficulty-tabs" aria-label="Dificultad del ranking">
            {difficulties.map((option) => <button key={option} className={rankingDifficulty === option ? "active" : ""} onClick={() => setRankingDifficulty(option)}>{option}</button>)}
          </div>}
          {visibleRanking.length === 0
            ? <div className="empty-ranking"><p>No hay partidas guardadas para esta selección.</p><button className="primary" onClick={() => go("mode")}>Jugar una partida</button></div>
            : <div className="rank-list">{visibleRanking.map((match, index) => <div key={match.id}>
              <b>#{index + 1}</b><Avatar value={match.avatar} color={match.color} small />
              <strong>{match.player} · {match.category}{match.gameMode === "who-said" && match.difficulty ? ` · ${match.difficulty}` : ""}</strong>
              <span>{match.score} ⭐</span>
            </div>)}</div>}
        </div>
      </section>}

      {screen === "mode" && <section className="light-screen">
        <Back onClick={() => go("profile")} />
        <div className="user-chip"><Avatar value={avatar} color={color} small /><div><strong>{name || "Tu nombre"}</strong><span>{totalPoints} ⭐ acumuladas</span></div></div>
        <div className="selection">
          <h1>¿Cómo querés jugar?</h1><p>Una partida individual, a tu ritmo.</p>
          <div className="mode-grid">
            <button onClick={() => { setModeChoice("classic"); go("categories"); }}>
              <span className="mode-icon">🎯</span><div><strong>{classicGameTitle}</strong><small>Clasificá situaciones como Chamuyo, Red flag o Green flag</small></div><b aria-hidden="true">→</b>
            </button>
            <button onClick={() => setModeChoice("who-said")} aria-expanded={modeChoice === "who-said"}>
              <span className="mode-icon">🎤</span><div><strong>{quoteGameTitle}</strong><small>Adiviná quién dijo frases argentinas</small></div><b aria-hidden="true">→</b>
            </button>
          </div>
          {modeChoice === "who-said" && <div className="difficulty-picker">
            <h2>Elegí la dificultad</h2>
            <div className="difficulty-options" role="group" aria-label="Dificultad">
              {difficulties.map((option) => <button type="button" key={option} className={difficulty === option ? "chosen" : ""} aria-pressed={difficulty === option} onClick={() => setDifficulty(option)}>
                <strong>{option}</strong><small>{option === "Fácil" ? "Con pista del ámbito · 100 puntos" : "Sin pistas · 200 puntos"}</small>
              </button>)}
            </div>
            <button className="primary full" onClick={() => startGame(quoteGameTitle, "who-said", difficulty)}>Empezar “¿Quién lo dijo?” →</button>
          </div>}
        </div>
      </section>}

      {screen === "categories" && <section className="dark-screen">
        <Back light onClick={() => go("mode")} />
        <div className="score-chip"><Avatar value={avatar} color={color} small /><span>{totalPoints} ⭐</span></div>
        <div className="category-content">
          <h1>¿Sobre qué te chamuyamos?</h1><p>Elegí una categoría para arrancar.</p>
          <div className="category-grid">{gameCategories.map(({ icon, title, description }) => <button key={title} onClick={() => startGame(title, "classic")}><span aria-hidden="true">{icon}</span><strong>{title}</strong><small>{description}</small></button>)}</div>
          <small className="game-note">10 preguntas · {gameDurationSeconds} segundos para toda la partida</small>
        </div>
      </section>}

      {showQuestion && <section className="dark-screen question-screen">
        <div className="game-top">
          <button aria-label="Salir de la partida" title="Salir de la partida" onClick={() => finishGame("abandoned")}>✕</button>
          <div><span>{itemName} {questionIndex + 1} de {totalQuestions}</span><div className="question-progress" role="progressbar" aria-valuenow={questionIndex + 1} aria-valuemin={1} aria-valuemax={totalQuestions}><i style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }} /></div></div>
          <div className="mini-score">⭐ {score}</div>
        </div>
        <div className="question-card">
          <div className="question-meta"><span>{gameMode === "who-said" ? quoteGameTitle : category}</span><b aria-label={`Quedan ${timeLeft} segundos`}>⏱ {timeLeft}s</b></div>
          {gameMode === "who-said" && currentQuote
            ? <>
              <h1>{currentQuote.title}</h1>
              {difficulty === "Fácil" && <p className="quote-clue">Pista: {currentQuote.clue}</p>}
              <form className="quote-answer-form" onSubmit={answerQuote}>
                <label htmlFor="quote-answer">¿Quién lo dijo?</label>
                <input id="quote-answer" autoComplete="off" value={quoteAnswer} onChange={(event) => setQuoteAnswer(event.target.value)} placeholder="Escribí el nombre" required disabled={timeLeft === 0} />
                <button className="primary" type="submit" disabled={!quoteAnswer.trim() || timeLeft === 0}>Confirmar respuesta</button>
              </form>
            </>
            : <>
              <h1>{currentQuestion.title}</h1>
              <div className="answers">{answerOptions.map((option, index) => <button key={option} onClick={() => answer(index)} disabled={selected !== null || timeLeft === 0}>
                <b aria-hidden="true">{option === "Chamuyo" ? "💬" : option === "Red flag" ? "🚩" : "💚"}</b><span>{option}</span>
              </button>)}</div>
            </>}
        </div>
      </section>}

      {showFeedback && <section className={`dark-screen feedback-screen ${(gameMode === "who-said" ? quoteAnswerCorrect : selected !== null && answerOptions[selected] === currentQuestion.correct) ? "right" : "wrong"}`}>
        {gameMode === "who-said" && quoteAnswerCorrect !== null && currentQuote
          ? <>
            <div className="game-top">
              <button aria-label="Salir de la partida" title="Salir de la partida" onClick={() => finishGame("abandoned")}>✕</button>
              <div><span>Frase {questionIndex + 1} de {totalQuestions}</span><div className="question-progress" role="progressbar" aria-valuenow={questionIndex + 1} aria-valuemin={1} aria-valuemax={totalQuestions}><i style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }} /></div></div>
              <div className="mini-score">⭐ {score}</div>
            </div>
            <div className="feedback-emoji" aria-hidden="true">{quoteAnswerCorrect ? "✨🎤✨" : "💔😅"}</div>
            <div className="feedback-mark" aria-hidden="true">{quoteAnswerCorrect ? "✓" : "×"}</div>
            <h1>{quoteAnswerCorrect ? "¡Correcto, era esa voz!" : "No era esa persona"}</h1>
            <p>{quoteAnswerCorrect ? `+${difficulty === "Difícil" ? 200 : 100} puntos` : "La respuesta cuenta como incorrecta."}</p>
            <div className="feedback-card"><strong>{currentQuote.title}</strong><div className="answer-review"><b>{currentQuote.speaker}</b></div></div>
            <button className="primary" onClick={next} disabled={finished.current}>{questionIndex + 1 < totalQuestions ? "Siguiente frase →" : "Ver resultado →"}</button>
          </>
          : selected !== null && currentQuestion && <>
            <div className="feedback-emoji" aria-hidden="true">{answerOptions[selected] === currentQuestion.correct ? "✨💚✨" : "💔😅"}</div>
            <div className="feedback-mark" aria-hidden="true">{answerOptions[selected] === currentQuestion.correct ? "✓" : "×"}</div>
            <h1>{answerOptions[selected] === currentQuestion.correct ? "¡Ese chamuyo suma!" : "Uy... te clavaron el visto"}</h1>
            <p>{answerOptions[selected] === currentQuestion.correct ? "+100 puntos" : "No pasa nada, el chamuyo se aprende con práctica."}</p>
            <div className="feedback-card"><strong>{currentQuestion.title}</strong><div className="answer-review">Respuesta correcta: <b>{currentQuestion.correct}</b></div><div className="fact"><b>💡 Dato chamuyero</b><span>{currentQuestion.tip}</span></div></div>
            <button className="primary" onClick={next} disabled={finished.current}>{questionIndex + 1 < totalQuestions ? "Siguiente pregunta →" : "Ver resultado →"}</button>
          </>}
        <p className="feedback-timer" aria-live="polite">Quedan {timeLeft} segundos de la partida</p>
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
        <p className="result-mode">{lastResult?.gameMode === "who-said" ? `${quoteGameTitle} · ${lastResult.difficulty}` : classicGameTitle}</p>
        <div className="stats">
          <div><b>{lastResult?.correct ?? correctCount}</b><span>Correctas</span></div>
          <div><b>{lastResult?.incorrect ?? incorrectCount}</b><span>Incorrectas</span></div>
          <div><b>{lastResult?.average ?? (correctCount + incorrectCount === 0 ? 0 : Math.round((correctCount / (correctCount + incorrectCount)) * 100))}%</b><span>Promedio de aciertos</span></div>
          <div><b>{lastResult?.unanswered ?? Math.max(0, questions.length - correctCount - incorrectCount)}</b><span>Sin responder</span></div>
        </div>
        <div className="rank-earned"><span aria-hidden="true">🏅</span><div><small>Rango obtenido</small><strong>{lastResult?.rank ?? rankFor(score)}</strong></div></div>
        <div className="result-actions">
          <button className="primary" onClick={() => { setModeChoice(null); go("mode"); }}>↻ Jugar de nuevo</button>
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
