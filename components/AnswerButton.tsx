type Props = { label: string; index: number; selected: number | null; correct: number; onChoose: (index: number) => void };
const letters = ["A", "B", "C", "D"];
export function AnswerButton({ label, index, selected, correct, onChoose }: Props) {
  const revealed = selected !== null;
  const state = revealed && index === correct ? "correct" : revealed && index === selected ? "wrong" : "";
  return <button className={`answer-button ${state}`} onClick={() => onChoose(index)} disabled={revealed}>
    <span className="answer-letter">{letters[index]}</span><span>{label}</span>{state === "correct" && <span className="answer-result">✓</span>}{state === "wrong" && <span className="answer-result">×</span>}
  </button>;
}
