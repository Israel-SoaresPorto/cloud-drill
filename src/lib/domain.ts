import type { DomainCode } from "@/types/domains"
import type { Question } from "@/types/question"

export function groupQuestionsByDomain(questions: Question[]) {
  const grouped: Record<DomainCode, Question[]> = {}

  questions.forEach((question) => {
    if (!grouped[question.domainCode]) {
      grouped[question.domainCode] = []
    }

    grouped[question.domainCode].push(question)
  })

  return grouped
}