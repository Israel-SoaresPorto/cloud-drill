import {
  Exams,
  type DomainCode,
  type DomainDistribution,
  type Exam,
} from "@/types/domains"
import type { Question, QuestionID } from "@/types/question"
import { groupQuestionsByDomain } from "./domain"

export const generateQuizSessionID = (): string => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID()
  }

  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffledArray = [...array]
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
  }
  return shuffledArray
}

export function selectExamQuestions(
  exam: Exam,
  allQuestions: Question[],
  distribution: DomainDistribution,
  count: number = 65
) {
  const examValue = Exams[exam]

  const filteredQuestions = allQuestions.filter((q) => q.exam === examValue)

  const examDomainValues = Object.entries(distribution).filter(([key]) =>
    key.startsWith(exam)
  ) as [DomainCode, number][]

  const selectedQuestions: Question[] = []
  const questionsByDomain = groupQuestionsByDomain(filteredQuestions)
  const selectedIndices = new Set<QuestionID>()

  for (const [domainCode, domainPercentage] of examDomainValues) {
    const domainQuestions = questionsByDomain[domainCode] || []
    const domainCount = Math.round(count * domainPercentage)

    const shuffledDomainQuestions = shuffleArray(domainQuestions)

    for (const question of shuffledDomainQuestions) {
      if (selectedQuestions.length >= count) break

      if (selectedIndices.has(question.id)) continue

      selectedQuestions.push(question)
      selectedIndices.add(question.id)

      const domainSelectedCount = selectedQuestions.filter(
        (q) => q.domainCode === domainCode
      ).length

      if (domainSelectedCount >= domainCount) break
    }
  }

  if (selectedQuestions.length < count) {
    const remainingQuestions = shuffleArray(filteredQuestions).filter(
      (q) => !selectedIndices.has(q.id)
    )

    selectedQuestions.push(
      ...remainingQuestions.slice(0, count - selectedQuestions.length)
    )
  }

  return shuffleArray(selectedQuestions).slice(0, count)
}
