export type Exam = "CLF_002"

export const Exams = {
  CLF_002: "cloud-practitioner",
} satisfies Record<Exam, string>

export type DomainCode = `${keyof typeof Exams}-${string}`

export type ExamDomains = Record<DomainCode, string>

export type DomainDistribution = Record<DomainCode, number>

export type DomainBreakdownCount = {
  correct: number
  total: number
}

export type DomainBreakdown = Record<
  ExamDomains[DomainCode],
  DomainBreakdownCount
>

export const CLF_002_DOMAINS: ExamDomains = {
  "CLF_002-cloud-concepts": "Conceitos de Nuvem",
  "CLF_002-security-and-compliance": "Segurança e Conformidade",
  "CLF_002-aws-technologies": "Tecnologia e Serviços de Nuvem",
  "CLF_002-billing-and-pricing": "Cobranças, Preços e Suporte",
}

export const CLF_002_DISTRIBUTION: DomainDistribution = {
  "CLF_002-cloud-concepts": 0.28,
  "CLF_002-security-and-compliance": 0.24,
  "CLF_002-aws-technologies": 0.36,
  "CLF_002-billing-and-pricing": 0.12,
}
