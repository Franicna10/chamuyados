export const answerOptions = ["Chamuyo", "Red flag", "Green flag"] as const;
export type AnswerOption = (typeof answerOptions)[number];
export const iconModeCategory = "Modo íconos argentinos";

export type Question = {
  title: string;
  correct: AnswerOption;
  tip: string;
};

export type GameCategory = {
  icon: string;
  title: string;
  description: string;
};

export const gameCategories: GameCategory[] = [
  { icon: "💬", title: "Chamuyo inicial", description: "Para romper el hielo" },
  { icon: "🚩", title: "Red o Green Flag", description: "Detectá las señales" },
  { icon: "📱", title: "Chat y redes", description: "Mensajes, vistos y likes" },
  { icon: "💘", title: "Primera cita", description: "El encuentro cara a cara" },
  { icon: "🤔", title: "¿Qué responderías?", description: "Elegí tu mejor jugada" },
  { icon: "🔥", title: "Frases chamuyeras", description: "Palabras y hechos" },
  { icon: "🇦🇷", title: iconModeCategory, description: "Humor y vínculos bien de acá" },
];

const question = (title: string, correct: AnswerOption, tip: string): Question => ({
  title,
  correct,
  tip,
});

const regularQuestions: Question[] = [
  question("Te promete una escapada de finde hace un mes, pero cada vez que proponés fecha aparece una excusa nueva.", "Chamuyo", "Las promesas lindas pierden fuerza cuando nunca vienen acompañadas de acciones."),
  question("Te pregunta cómo te fue en una entrevista y después se acuerda de los detalles que le contaste.", "Green flag", "Escuchar con atención y acordarse de lo importante demuestra interés genuino."),
  question("Te pide la contraseña del celu para demostrarle que no tenés nada que ocultar.", "Red flag", "La confianza no requiere entregar claves ni renunciar a la privacidad."),
  question("Te manda un mensaje cada viernes de madrugada, pero nunca concreta un plan para verse.", "Chamuyo", "Aparecer cuando pinta no es lo mismo que sostener un vínculo con intención."),
  question("Le decís que hoy no querés un beso y te responde que está todo bien, sin insistir.", "Green flag", "Respetar un límite sin presionar es una señal clara de cuidado."),
  question("Se enoja cuando salís con tus amistades y te hace sentir culpable por ir.", "Red flag", "Intentar aislarte o controlar tus planes no es una muestra de amor."),
  question("Te dice que sos su persona favorita en la primera charla, pero ni te pregunta qué te gusta.", "Chamuyo", "Las declaraciones intensas no reemplazan el interés real por conocerte."),
  question("Si no entiende algo que dijiste, pregunta en vez de asumir o inventar una historia.", "Green flag", "Preguntar con claridad evita malos entendidos y muestra disposición a escuchar."),
  question("Te pide que le mandes tu ubicación en vivo cada vez que salís, aunque ya le dijiste que no.", "Red flag", "Insistir con el seguimiento después de un límite es una conducta de control."),
  question("Después de cancelar un plan, propone otro día concreto y se ocupa de organizarlo.", "Green flag", "Reprogramar con claridad muestra consideración y ganas de cumplir."),
  question("Te jura que cambió, pero vuelve a hacer lo mismo cada vez que se disculpa.", "Chamuyo", "Una disculpa sincera se nota en cambios sostenidos, no en repetir la promesa."),
  question("Se burla de cómo te vestís y después dice que era un chiste cuando te molesta.", "Red flag", "Descalificarte y esconderse detrás de una broma no es respeto."),
  question("Te cuenta qué busca en una relación y también te pregunta qué querés vos.", "Green flag", "Hablar de expectativas en ambas direcciones ayuda a construir algo claro."),
  question("Dice que nunca sintió algo igual, pero solo aparece cuando necesita un favor.", "Chamuyo", "Las palabras románticas no compensan una relación donde el interés es de una sola mano."),
  question("Se pone celoso si le das like a una foto y te exige que dejes de seguir a esa persona.", "Red flag", "Los celos no justifican decidir a quién podés seguir ni vigilar tus redes."),
  question("Te propone una primera cita, acuerda hora y lugar, y confirma el mismo día.", "Green flag", "La comunicación concreta hace que encontrarse sea fácil y considerado."),
  question("Te manda poemas copiados de internet y asegura que los escribió especialmente para vos.", "Chamuyo", "Fingir gestos personales para impresionar es menos honesto que hablar con autenticidad."),
  question("Cuando discutís, te deja de hablar por días para que aprendas la lección.", "Red flag", "Usar el silencio como castigo impide resolver el conflicto de manera respetuosa."),
  question("Reconoce que se equivocó, te escucha y cambia la conducta que te había hecho mal.", "Green flag", "Asumir responsabilidad y actuar distinto vale más que una disculpa automática."),
  question("Te dice que sos el amor de su vida, pero nunca encuentra diez minutos para llamarte.", "Chamuyo", "Una frase enorme sin tiempo ni presencia queda en promesa."),
  question("Revisa tus mensajes por encima del hombro y después te pregunta con quién hablás.", "Red flag", "Vigilar conversaciones ajenas invade la privacidad y busca controlar."),
  question("Te pregunta qué plan te entusiasma y propone una opción que les cierre a ambos.", "Green flag", "Tener en cuenta las preferencias de los dos es una buena base para un encuentro."),
  question("Asegura que va a pasar a saludarte, pero no confirma ni aparece y luego actúa como si nada.", "Chamuyo", "La falta de claridad y de cumplimiento también comunica poco compromiso."),
  question("Te apura para ponerle una etiqueta al vínculo aunque le pediste tiempo para pensarlo.", "Red flag", "Presionar para obtener una respuesta no respeta tus tiempos ni tu autonomía."),
  question("Te cuenta que necesita un rato a solas y respeta que vos también tengas tus espacios.", "Green flag", "Poder pedir espacio y respetarlo es parte de una relación equilibrada."),
];

const openingQuestions: Question[] = [
  question("En una juntada, alguien te pregunta qué canción te pone de buen humor y escucha la respuesta.", "Green flag", "Una pregunta sencilla y genuina abre una charla sin invadir."),
  question("Arranca con un cumplido amable y después deja espacio para que la conversación siga natural.", "Green flag", "El interés respetuoso no exige una respuesta ni una devolución."),
  question("Te dice que sos la persona más increíble que vio, aunque todavía no intercambiaron dos palabras.", "Chamuyo", "Un elogio exagerado sin conocerte puede sonar a libreto."),
  question("Te pregunta qué te gusta hacer y también comparte algo propio para encontrar un tema en común.", "Green flag", "La conversación fluye mejor cuando hay curiosidad de ambos lados."),
  question("Te insiste con que le des tu número después de que ya le dijiste que preferís no hacerlo.", "Red flag", "Un no claro no necesita ser negociado."),
  question("Te propone seguir hablando otro día y acepta con buena onda si no te interesa.", "Green flag", "Aceptar una respuesta sin presionar también es parte de un buen comienzo."),
  question("Abre la charla diciendo que sabe todo sobre vos porque estuvo mirando tus redes durante horas.", "Red flag", "La atención no debería sentirse como vigilancia."),
  question("Te manda un saludo simple y pregunta si te pinta charlar, sin reclamar respuesta inmediata.", "Green flag", "La invitación clara deja lugar para elegir."),
  question("Dice que nunca conectó así con nadie, pero cambia de tema cada vez que hablás de vos.", "Chamuyo", "La conexión se construye escuchando, no solo anunciándola."),
  question("Te invita a una actividad que mencionaste que te gusta y pregunta si te queda cómodo.", "Green flag", "Recordar un interés y consultar tus tiempos muestra consideración."),
];

const chatQuestions: Question[] = [
  question("Te manda veinte mensajes seguidos y se enoja si no respondés mientras estás trabajando.", "Red flag", "Cada persona puede responder a su ritmo; exigir disponibilidad constante es control."),
  question("Te escribe para preguntarte cómo salió algo importante que le habías contado.", "Green flag", "Retomar un detalle muestra atención genuina."),
  question("Te clava el visto por días y vuelve con un «hola perdida» como si nada, cada semana.", "Chamuyo", "La intermitencia puede ser una señal de poco interés sostenido."),
  question("Te pide que borres una foto porque alguien le puso un corazón.", "Red flag", "No corresponde controlar tus publicaciones por celos."),
  question("Si tarda en responder, después retoma la charla sin inventar excusas ni reclamarte.", "Green flag", "La comunicación no tiene que convertirse en una prueba permanente."),
  question("Te manda un audio larguísimo para evitar contestar una pregunta concreta sobre qué busca.", "Chamuyo", "Mucho mensaje no siempre significa claridad."),
  question("Comparte una captura privada de una conversación ajena para hacerte reír.", "Red flag", "La privacidad también se cuida cuando la otra persona no está presente."),
  question("Te pregunta si preferís seguir la charla por otro medio y respeta si decís que no.", "Green flag", "Pedir permiso y aceptar límites hace más segura la conversación."),
  question("Te responde solo con fueguitos durante semanas, pero asegura que está construyendo algo serio.", "Chamuyo", "Las reacciones no reemplazan una conversación honesta."),
  question("Te manda un meme relacionado con algo que hablaron y pregunta qué te pareció.", "Green flag", "Compartir algo con contexto puede ser una forma simple de conectar."),
];

const dateQuestions: Question[] = [
  question("Antes de encontrarse, te pregunta qué zona te queda cómoda y acuerdan un lugar público.", "Green flag", "Planificar en conjunto y elegir un lugar donde estés cómoda suma tranquilidad."),
  question("Elige todo por vos y dice que no hace falta que opines porque ya pensó el plan perfecto.", "Red flag", "Una cita compartida también tiene que incluir tus preferencias."),
  question("Te promete una cena inolvidable, pero nunca propone día ni horario.", "Chamuyo", "Una invitación concreta vale más que una promesa grandiosa."),
  question("La conversación se traba un poco y propone cambiar de tema sin hacerte sentir mal.", "Green flag", "No hace falta que todo salga perfecto para pasarla bien."),
  question("Insiste en llevarte a su casa aunque dijiste que preferís volver por tu cuenta.", "Red flag", "Tu decisión sobre cómo volver debe respetarse sin discusión."),
  question("Se retrasa y te avisa con tiempo, se disculpa y consulta si todavía te sirve el plan.", "Green flag", "Avisar y hacerse cargo cuida el tiempo de ambas personas."),
  question("Pasa la cita hablando de sus conquistas anteriores y te compara con ellas.", "Red flag", "Comparar para impresionar o incomodar no crea un encuentro respetuoso."),
  question("Propone dividir la cuenta o invita, pero te pregunta qué opción preferís.", "Green flag", "Hablarlo con naturalidad evita suposiciones y deja elegir."),
  question("Te dice que la cita fue increíble y que van a repetir, pero después desaparece sin explicación.", "Chamuyo", "La continuidad se nota en hechos y comunicación, no solo en el cierre."),
  question("Al final pregunta si llegaste bien y no espera que ese gesto implique algo a cambio.", "Green flag", "El cuidado es valioso cuando no se usa como moneda de cambio."),
];

const responseQuestions: Question[] = [
  question("Te preguntan algo personal, decís que preferís no hablar de eso y aceptan tu respuesta.", "Green flag", "Podés poner un límite sin justificarlo; que lo respeten suma."),
  question("Te cancelan por tercera vez sin proponer otra fecha y pedís claridad sobre si quieren seguir viéndose.", "Green flag", "Una pregunta directa ayuda a salir de las suposiciones."),
  question("Alguien te pide la clave del teléfono y le decís que la privacidad también es parte de la confianza.", "Green flag", "No hace falta compartir contraseñas para demostrar interés."),
  question("Recibís un mensaje romántico enorme, pero cuando preguntás qué vínculo busca no responde.", "Chamuyo", "La intensidad no reemplaza una conversación clara sobre las intenciones."),
  question("En una cita no te sentís cómoda con un beso, lo decís y la otra persona no insiste.", "Green flag", "El consentimiento se respeta sin negociar ni enojarse."),
  question("Te reclaman por salir con amistades y respondés que cuidar esos vínculos también es importante.", "Green flag", "Mantener espacios propios es compatible con compartir un vínculo."),
  question("Te dicen «si me quisieras, lo harías» para que cambies una decisión que ya tomaste.", "Red flag", "Usar culpa para conseguir algo es presión, no consentimiento."),
  question("Te proponen un plan y preguntan qué alternativa te queda cómoda antes de decidir.", "Green flag", "Consultar antes de elegir por vos demuestra consideración."),
  question("Te elogian mucho, pero siguen insistiendo cuando pedís bajar el ritmo.", "Red flag", "El respeto a tus límites importa más que cualquier elogio."),
  question("Alguien reconoce que se equivocó, te escucha y pregunta cómo reparar el daño.", "Green flag", "Responsabilizarse y escuchar puede abrir una conversación útil."),
];

const phraseQuestions: Question[] = [
  question("«Sos mi destino»; después evita cualquier conversación sobre qué quiere construir.", "Chamuyo", "La frase romántica no reemplaza la claridad."),
  question("«Me encanta cómo pensás» y luego te pregunta más sobre una idea que compartiste.", "Green flag", "El interés se confirma cuando la otra persona escucha y sigue conversando."),
  question("«Yo soy así, bancátela» cada vez que le señalás algo que te lastima.", "Red flag", "Una frase no debería servir para esquivar responsabilidad."),
  question("«Cuando quieras, sin presión» y acepta que hoy no te venga bien.", "Green flag", "La invitación es respetuosa cuando el no también tiene lugar."),
  question("«Te voy a llevar a lugares increíbles» desde hace meses, pero nunca concreta.", "Chamuyo", "Las promesas repetidas necesitan acciones para volverse reales."),
  question("«No necesito tus contraseñas; confío en vos» y actúa de acuerdo con eso.", "Green flag", "La confianza se muestra respetando la privacidad."),
  question("«Si salís con tus amigas, no me querés de verdad» para que canceles.", "Red flag", "El afecto no se demuestra abandonando tus vínculos."),
  question("«Perdón, estuve mal» y después cambia la conducta que te había afectado.", "Green flag", "Una disculpa gana sentido cuando viene acompañada de cambios."),
  question("«Nunca conocí a nadie igual» aparece cada vez que necesita un favor.", "Chamuyo", "La intensidad interesada no es lo mismo que reciprocidad."),
  question("«¿Te puedo dar un beso?» y recibe un no con naturalidad.", "Green flag", "Preguntar y respetar la respuesta cuida el consentimiento."),
];

const iconQuestions: Question[] = [
  question("En una juntada, te trabás contando una anécdota y tu cita se ríe con vos, sin apurarte ni exponerte.", "Green flag", "El humor compartido suma cuando no se usa para burlarse ni presionar."),
  question("Te promete una noche de película con reserva y limusina, pero hace tres semanas que no concreta ni un café.", "Chamuyo", "La producción puede ser espectacular; si nunca se convierte en un plan real, queda en puro verso."),
  question("En la primera salida quiere elegir tu ropa y se ofende cuando preferís ir como te sentís cómoda.", "Red flag", "Opinar sobre tu ropa como una orden y enojarse si no obedecés es control, no cariño."),
  question("Te dice que sos «la única persona que entiende su alma», pero solo te escribe cuando necesita que le resuelvas algo.", "Chamuyo", "Una frase de novela no compensa que el vínculo aparezca solo por conveniencia."),
  question("Te pide una foto de cada lugar al que vas y se enoja si tardás en contestar mientras estás con amistades.", "Red flag", "Exigir pruebas y respuestas inmediatas convierte la comunicación en vigilancia."),
  question("Arma una cita sencilla, te pregunta qué te gusta y te avisa de antemano cuánto cuesta el plan.", "Green flag", "La claridad y la consideración pueden ser más románticas que cualquier despliegue."),
  question("Te habla de un futuro juntos con casa en la costa y perro con nombre, pero esquiva acordar una segunda cita.", "Chamuyo", "Fantasear en grande no es lo mismo que dar un paso concreto para conocerse."),
  question("Le decís que no querés subir a su departamento después de cenar y te acompaña hasta tu transporte, sin insistir.", "Green flag", "Acepta tu decisión y prioriza que vuelvas bien, sin convertir el cuidado en una deuda."),
  question("Te pregunta con quién hablás cada vez que vibra el celular y te exige mostrarle la pantalla.", "Red flag", "Revisar tus conversaciones y pedir explicaciones constantes son señales de control."),
  question("Asegura que va a reservar el lugar más exclusivo de la ciudad, pero nunca define día ni horario.", "Chamuyo", "La promesa rimbombante no vale más que un plan concreto que sí se cumple."),
  question("Le contás que querés ir despacio y te responde que no hay apuro; después mantiene ese cuidado en los hechos.", "Green flag", "Escucha tu límite y sostiene el respeto más allá de la charla del momento."),
  question("Te pide que canceles un viaje con tus amigas porque dice que una pareja debería hacer todo junta.", "Red flag", "Buscar que abandones tus vínculos y actividades propias es una forma de control."),
  question("Te manda un audio diciendo que sos su destino, pero evita responder cuando preguntás qué tipo de vínculo busca.", "Chamuyo", "El lenguaje de película no reemplaza una conversación honesta sobre lo que quiere."),
  question("Para celebrar que se conocen, prepara una playlist con canciones que ambos nombraron y te pregunta si te gustó.", "Green flag", "Un gesto personal y atento, sin esperar que le debas nada, es una señal linda."),
  question("Se adjudica el derecho de decidir qué fotos podés subir y amenaza con dejarte si no las borrás.", "Red flag", "Amenazar para controlar tus redes cruza un límite; no es una prueba de amor."),
];

const categoryPools: Record<string, Question[]> = {
  "Chamuyo inicial": openingQuestions,
  "Red o Green Flag": regularQuestions,
  "Chat y redes": chatQuestions,
  "Primera cita": dateQuestions,
  "¿Qué responderías?": responseQuestions,
  "Frases chamuyeras": phraseQuestions,
  [iconModeCategory]: iconQuestions,
};

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

export function createRound(category: string): Question[] {
  const pool = categoryPools[category];
  if (!pool || pool.length < 10) {
    throw new Error(`La categoría "${category}" no tiene suficientes preguntas.`);
  }
  return shuffle(pool).slice(0, 10);
}
