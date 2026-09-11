import { ArrowRight } from "lucide-react";
import { AnswerButton } from "./AnswerButton";
type Question = { category: string; icon: string; color: string; question: string; answers: string[]; correct: number };
type Props = { question: Question; questionNumber: number; totalQuestions: number; selected: number | null; onChoose: (index: number) => void; onNext: () => void };
export function GameCard({ question, questionNumber, totalQuestions, selected, onChoose, onNext }: Props) {
  const wasCorrect = selected === question.correct;
  return <article className="game-card">
    <div className="card-topline"><span className="category" style={{ backgroundColor: question.color }}><span aria-hidden="true">{question.icon}</span> {question.category}</span><span className="counter">{questionNumber} / {totalQuestions}</span></div>
    <div className="progress-track" aria-label={`Pregunta ${questionNumber} de ${totalQuestions}`}><span style={{ width: `${(questionNumber / totalQuestions) * 100}%`, backgroundColor: question.color }} /></div>
    <h2>{question.question}</h2>
    <div className="answers-grid">{question.answers.map((answer, index) => <AnswerButton key={answer} label={answer} index={index} selected={selected} correct={question.correct} onChoose={onChoose} />)}</div>
    <div className={`feedback ${selected === null ? "hidden" : ""}`} aria-live="polite"><div><strong>{wasCorrect ? "¡Esa es! +50 puntos" : "Casi, pero era otra"}</strong><p>{wasCorrect ? "Tenés buen radar para el chamuyo." : "No pasa nada, hasta el mejor chamuyero se confunde."}</p></div><button className="next-button" onClick={onNext}>Siguiente <ArrowRight size={18} /></button></div>
  </article>;
}
