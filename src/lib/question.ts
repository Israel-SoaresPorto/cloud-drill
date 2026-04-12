import CLF_002_QUESTIONS from "@/data/clf_002_questions.json"
import type { Exam } from "@/types/domains"
import type { Question } from "@/types/question"

export function loadQuestionsForExam(exam: Exam): Question[] {
  switch (exam) {
    case "CLF_002":
      return CLF_002_QUESTIONS as Question[]
    default:
      return []
  }
}
