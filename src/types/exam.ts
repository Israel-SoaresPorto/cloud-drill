export const Exams = {
  CLF_002: "AWS Certified Cloud Practitioner (CLF-C02)",
} as const

export type DomainCode = `${keyof typeof Exams}-${string}`

export type ExamDomains = Record<DomainCode, string>

export const CLF_002_DOMAINS: ExamDomains = {
  "CLF_002-cloud-concepts": "Conceitos de Nuvem",
  "CLF_002-security-and-compliance": "Segurança e Conformidade",
  "CLF_002-aws-technologies": "Tecnologia e Serviços de Nuvem",
  "CLF_002-billing-and-pricing": "Cobranças, Preços e Suporte",
}
