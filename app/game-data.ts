export const answerOptions = ["Chamuyo", "Red flag", "Green flag"] as const;
export type AnswerOption = (typeof answerOptions)[number];
export const iconModeCategory = "Modo íconos argentinos";

export type Question = {
  title: string;
  correct: AnswerOption;
  tip: string;
  attribution?: string;
  source?: string;
};

const regularQuestions: Question[] = [
  { title: "Te promete una escapada de finde hace un mes, pero cada vez que proponés fecha aparece una excusa nueva.", correct: "Chamuyo", tip: "Las promesas lindas pierden fuerza cuando nunca vienen acompañadas de acciones." },
  { title: "Te pregunta cómo te fue en una entrevista y después se acuerda de los detalles que le contaste.", correct: "Green flag", tip: "Escuchar con atención y acordarse de lo importante demuestra interés genuino." },
  { title: "Te pide la contraseña del celu para demostrarle que no tenés nada que ocultar.", correct: "Red flag", tip: "La confianza no requiere entregar claves ni renunciar a la privacidad." },
  { title: "Te manda un mensaje cada viernes de madrugada, pero nunca concreta un plan para verse.", correct: "Chamuyo", tip: "Aparecer cuando pinta no es lo mismo que sostener un vínculo con intención." },
  { title: "Le decís que hoy no querés un beso y te responde que está todo bien, sin insistir.", correct: "Green flag", tip: "Respetar un límite sin presionar es una señal clara de cuidado." },
  { title: "Se enoja cuando salís con tus amistades y te hace sentir culpable por ir.", correct: "Red flag", tip: "Intentar aislarte o controlar tus planes no es una muestra de amor." },
  { title: "Te dice que sos su persona favorita en la primera charla, pero ni te pregunta qué te gusta.", correct: "Chamuyo", tip: "Las declaraciones intensas no reemplazan el interés real por conocerte." },
  { title: "Si no entiende algo que dijiste, pregunta en vez de asumir o inventar una historia.", correct: "Green flag", tip: "Preguntar con claridad evita malos entendidos y muestra disposición a escuchar." },
  { title: "Te pide que le mandes tu ubicación en vivo cada vez que salís, aunque ya le dijiste que no.", correct: "Red flag", tip: "Insistir con el seguimiento después de un límite es una conducta de control." },
  { title: "Después de cancelar un plan, propone otro día concreto y se ocupa de organizarlo.", correct: "Green flag", tip: "Reprogramar con claridad muestra consideración y ganas de cumplir." },
  { title: "Te jura que cambió, pero vuelve a hacer lo mismo cada vez que se disculpa.", correct: "Chamuyo", tip: "Una disculpa sincera se nota en cambios sostenidos, no en repetir la promesa." },
  { title: "Se burla de cómo te vestís y después dice que era un chiste cuando te molesta.", correct: "Red flag", tip: "Descalificarte y esconderse detrás de una broma no es respeto." },
  { title: "Te cuenta qué busca en una relación y también te pregunta qué querés vos.", correct: "Green flag", tip: "Hablar de expectativas en ambas direcciones ayuda a construir algo claro." },
  { title: "Dice que nunca sintió algo igual, pero solo aparece cuando necesita un favor.", correct: "Chamuyo", tip: "Las palabras románticas no compensan una relación donde el interés es de una sola mano." },
  { title: "Se pone celoso si le das like a una foto y te exige que dejes de seguir a esa persona.", correct: "Red flag", tip: "Los celos no justifican decidir a quién podés seguir ni vigilar tus redes." },
  { title: "Te propone una primera cita, acuerda hora y lugar, y confirma el mismo día.", correct: "Green flag", tip: "La comunicación concreta hace que encontrarse sea fácil y considerado." },
  { title: "Te manda poemas copiados de internet y asegura que los escribió especialmente para vos.", correct: "Chamuyo", tip: "Fingir gestos personales para impresionar es menos honesto que hablar con autenticidad." },
  { title: "Cuando discutís, te deja de hablar por días para que aprendas la lección.", correct: "Red flag", tip: "Usar el silencio como castigo impide resolver el conflicto de manera respetuosa." },
  { title: "Reconoce que se equivocó, te escucha y cambia la conducta que te había hecho mal.", correct: "Green flag", tip: "Asumir responsabilidad y actuar distinto vale más que una disculpa automática." },
  { title: "Te dice que sos el amor de su vida, pero nunca encuentra diez minutos para llamarte.", correct: "Chamuyo", tip: "Una frase enorme sin tiempo ni presencia queda en promesa." },
  { title: "Revisa tus mensajes por encima del hombro y después te pregunta con quién hablás.", correct: "Red flag", tip: "Vigilar conversaciones ajenas invade la privacidad y busca controlar." },
  { title: "Te pregunta qué plan te entusiasma y propone una opción que les cierre a ambos.", correct: "Green flag", tip: "Tener en cuenta las preferencias de los dos es una buena base para un encuentro." },
  { title: "Asegura que va a pasar a saludarte, pero no confirma ni aparece y luego actúa como si nada.", correct: "Chamuyo", tip: "La falta de claridad y de cumplimiento también comunica poco compromiso." },
  { title: "Te apura para ponerle una etiqueta al vínculo aunque le pediste tiempo para pensarlo.", correct: "Red flag", tip: "Presionar para obtener una respuesta no respeta tus tiempos ni tu autonomía." },
  { title: "Te cuenta que necesita un rato a solas y respeta que vos también tengas tus espacios.", correct: "Green flag", tip: "Poder pedir espacio y respetarlo es parte de una relación equilibrada." },
];

const iconQuestions: Question[] = [
  { title: "Te trabás contando una anécdota y tu cita te dice «Si querés reír, reí» (frase de Moria Casán), se ríe con vos y te deja seguir a tu ritmo.", correct: "Green flag", tip: "La frase va acompañada de apoyo y cero presión: clasificamos el trato, no a quien la hizo famosa.", attribution: "Moria Casán", source: "https://www.minutouno.com/espectaculos/basta-llorar-moria-dice-si-queres-reir-rei-n122105" },
  { title: "Te promete una noche de película con reserva y limusina, pero hace tres semanas que no concreta ni un café.", correct: "Chamuyo", tip: "La producción puede ser espectacular; si nunca se convierte en un plan real, queda en puro verso." },
  { title: "En la primera salida quiere elegir tu ropa y se ofende cuando preferís ir como te sentís cómoda.", correct: "Red flag", tip: "Opinar sobre tu ropa como una orden y enojarse si no obedecés es control, no cariño." },
  { title: "Te dice que sos «la única persona que entiende su alma», pero solo te escribe cuando necesita que le resuelvas algo.", correct: "Chamuyo", tip: "Una frase de novela no compensa que el vínculo aparezca solo por conveniencia." },
  { title: "Te pide una foto de cada lugar al que vas y se enoja si tardás en contestar mientras estás con amistades.", correct: "Red flag", tip: "Exigir pruebas y respuestas inmediatas convierte la comunicación en vigilancia." },
  { title: "Arma una cita sencilla, te pregunta qué te gusta y te avisa de antemano cuánto cuesta el plan.", correct: "Green flag", tip: "La claridad y la consideración pueden ser más románticas que cualquier despliegue." },
  { title: "Te habla de un futuro juntos con casa en la costa y perro con nombre, pero esquiva acordar una segunda cita.", correct: "Chamuyo", tip: "Fantasear en grande no es lo mismo que dar un paso concreto para conocerse." },
  { title: "Le decís que no querés subir a su departamento después de cenar y te acompaña hasta tu transporte, sin insistir.", correct: "Green flag", tip: "Acepta tu decisión y prioriza que vuelvas bien, sin convertir el cuidado en una deuda." },
  { title: "Te pregunta con quién hablás cada vez que vibra el celular y te exige mostrarle la pantalla.", correct: "Red flag", tip: "Revisar tus conversaciones y pedir explicaciones constantes son señales de control." },
  { title: "Asegura que va a reservar el lugar más exclusivo de la ciudad, pero nunca define día ni horario.", correct: "Chamuyo", tip: "La promesa rimbombante no vale más que un plan concreto que sí se cumple." },
  { title: "Le contás que querés ir despacio y te responde que no hay apuro; después mantiene ese cuidado en los hechos.", correct: "Green flag", tip: "Escucha tu límite y sostiene el respeto más allá de la charla del momento." },
  { title: "Te pide que canceles un viaje con tus amigas porque dice que una pareja debería hacer todo junta.", correct: "Red flag", tip: "Buscar que abandones tus vínculos y actividades propias es una forma de control." },
  { title: "Te manda un audio diciendo que sos su destino, pero evita responder cuando preguntás qué tipo de vínculo busca.", correct: "Chamuyo", tip: "El lenguaje de película no reemplaza una conversación honesta sobre lo que quiere." },
  { title: "Para celebrar que se conocen, prepara una playlist con canciones que ambos nombraron y te pregunta si te gustó.", correct: "Green flag", tip: "Un gesto personal y atento, sin esperar que le debas nada, es una señal linda." },
  { title: "Se adjudica el derecho de decidir qué fotos podés subir y amenaza con dejarte si no las borrás.", correct: "Red flag", tip: "Amenazar para controlar tus redes cruza un límite; no es una prueba de amor." },
];

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

export function createRound(category: string): Question[] {
  const questions = category === iconModeCategory ? iconQuestions : regularQuestions;
  return shuffle(questions).slice(0, 10);
}