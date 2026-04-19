import { CheckCircle, CircleX } from "lucide-react"
import type { Question, QuestionAnswer } from "@/types/question"

type QuizExplanationProps = {
  question: Question
  answer: QuestionAnswer
}

export default function QuizExplanation({
  question,
  answer,
}: QuizExplanationProps) {
  const isCorrect = answer.isCorrect

  return (
    <section
      data-answer-is-correct={isCorrect}
      className="group rounded-md border-2 bg-card p-4 answer-is-correct:border-correct answer-is-incorrect:border-wrong"
      aria-live="polite"
      aria-describedby="explanation-title"
      aria-label="Explicação da questão"
    >
      <div className="mb-4 flex items-center gap-2">
        {isCorrect ? (
          <CheckCircle className="size-5 text-correct" />
        ) : (
          <CircleX className="size-5 text-wrong" />
        )}
        <h3
          className="text-xl font-semibold group-answer-is-correct:text-correct group-answer-is-incorrect:text-wrong"
          id="explanation-title"
        >
          {isCorrect ? "Resposta Correta!" : "Resposta Incorreta!"}
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <h4
            className="mb-1 text-xs font-bold tracking-[0.08em] text-primary-tx uppercase"
            id="explanation-general"
          >
            Explicação
          </h4>
          <p
            aria-describedby="explanation-general"
            className="text-sm leading-6 text-secondary-tx"
          >
            {question.explanation.general}
          </p>
        </div>

        <div className="h-px w-full bg-muted-foreground" />

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-primary-tx">
            Por que as outras estão incorretas?
          </h4>

          <ul>
            {(
              Object.entries(question.explanation.incorrects) as Array<
                [string, string]
              >
            ).map(([optionId, reason]) => (
              <li
                key={optionId}
                className="text-sm leading-6 text-secondary-tx"
              >
                <strong className="mr-1 font-semibold text-wrong uppercase">
                  {optionId}:
                </strong>
                {reason}
              </li>
            ))}
          </ul>
        </div>

        <div className="h-px w-full bg-muted-foreground" />

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-primary-tx">
            Referências:
          </h4>
          {question.references.map((reference, index) => (
            <a
              key={index}
              href={reference}
              target="_blank"
              className="text-secondary-tx hover:text-accent-cyan"
            >
              {reference}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
