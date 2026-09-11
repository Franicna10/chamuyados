"use client";
import { useState } from "react";
import { Footer } from "@/components/Footer";
import { GameCard } from "@/components/GameCard";
import { Header } from "@/components/Header";

const questions = [
  { category: "Detectá la red flag", icon: "🚩", color: "#ff5c7a", question: "Te responde una historia después de ignorar tu mensaje por tres días. ¿Qué significa?", answers: ["Estaba muy ocupado", "Quiere llamar tu atención", "Se quedó sin WiFi", "Es el amor de tu vida"], correct: 1 },
  { category: "Chamuyo argentino", icon: "🧉", color: "#9b6cff", question: "¿Cuál de estas frases es el chamuyo más clásico?", answers: ["¿Siempre sos así de linda?", "Llegué temprano", "Después te confirmo", "Mandame el PDF"], correct: 0 },
  { category: "Primera cita", icon: "💘", color: "#ffb21d", question: "¿Qué detalle suma más puntos en una primera cita?", answers: ["Mirar el celular", "Hablar solo de su ex", "Escuchar y hacer preguntas", "Llegar una hora tarde"], correct: 2 },
];

export default function Home() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(120);
  const [lives, setLives] = useState(3);
  const [selected, setSelected] = useState<number | null>(null);
  const question = questions[questionIndex];
  function chooseAnswer(index: number) {
    if (selected !== null) return;
    setSelected(index);
    if (index === question.correct) setScore((value) => value + 50);
    else setLives((value) => Math.max(0, value - 1));
  }
  function nextQuestion() { setQuestionIndex((value) => (value + 1) % questions.length); setSelected(null); }
  return (
    <div className="app-shell">
      <Header score={score} lives={lives} />
      <main className="game-main">
        <section className="game-intro" aria-labelledby="game-title">
          <p className="eyebrow">Ronda rápida</p>
          <h1 id="game-title">¿Qué tan bueno es tu chamuyo?</h1>
          <p>Elegí la respuesta que más te represente y sumá puntos.</p>
        </section>
        <GameCard question={question} questionNumber={questionIndex + 1} totalQuestions={questions.length} selected={selected} onChoose={chooseAnswer} onNext={nextQuestion} />
      </main>
      <Footer />
    </div>
  );
}
