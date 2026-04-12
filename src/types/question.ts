import { Exams, type DomainCode, type ExamDomains } from "./domains"

export type QuestionID = `${keyof typeof Exams}-${string}`
export type OptionsID = "a" | "b" | "c" | "d" | "e"
export type QuestionType = "single" | "multiple"

export type QuestionOptions = {
  id: OptionsID
  text: string
}

export type QuestionExplanation = {
  general: string
  incorrects: Record<
    Exclude<OptionsID, Question["correctAnswers"][number]>,
    string
  >
}

export type Question = {
  id: QuestionID
  exam: (typeof Exams)[keyof typeof Exams]
  domain: ExamDomains[DomainCode]
  domainCode: DomainCode
  type: QuestionType
  question: string
  options: QuestionOptions[]
  correctAnswers: OptionsID[]
  explanation: QuestionExplanation
  references: string[]
  tags: string[]
}

export type QuestionAnswer = {
  id: QuestionID
  selectedOptionIds: OptionsID[]
  isCorrect: boolean
}

/* const questionSingle: Question = {
  id: "CLF_002-question-001",
  exam: "cloud-practitioner",
  domain: "Conceitos de nuvem",
  domainCode: "CLF_002-cloud-concepts",
  type: "single",
  question:
    "Uma startup quer evitar investimento inicial alto em servidores e pagar apenas quando usar recursos de TI. Qual principio economico da nuvem se aplica melhor?",
  options: [
    {
      id: "a",
      text: "Compra de hardware dedicado antecipada",
    },
    {
      id: "b",
      text: "Provisionamento fixo por 3 anos",
    },
    {
      id: "c",
      text: "Aquisicao de licencas perpetuas",
    },
    {
      id: "d",
      text: "Pagamento conforme o uso (pay-as-you-go)",
    },
  ],
  correctAnswers: ["d"],
  explanation: {
    general:
      "Na nuvem, a empresa troca gastos antecipados por cobranca baseada no consumo real.",
    incorrects: {
      a: "Incorreta. A compra de hardware exige alto investimento inicial (CapEx), o que a startup deseja exatamente evitar.",
      b: "Incorreta. O provisionamento fixo de infraestrutura pode gerar capacidade ociosa e não reflete o modelo de pagar apenas pelo que é consumido.",
      c: "Incorreta. Licenças perpétuas representam um custo inicial fixo e elevado, sendo o oposto do princípio de pagamento sob demanda da nuvem.",
    },
  },
  references: ["https://aws.amazon.com/what-is-cloud-computing/"],
  tags: ["cloud-economics", "pay-as-you-go"],
}

const questionMultiple: Question = {
    "id": "CLF_002-question-016",
    "exam": "cloud-practitioner",
    "domain": "Conceitos de nuvem",
    "domainCode": "CLF_002-cloud-concepts",
    "type": "multiple",
    "question": "Uma empresa quer melhorar resiliencia em nuvem. Quais praticas ajudam diretamente nesse objetivo? (Selecione DUAS.)",
    "options": [
      {
        "id": "a",
        "text": "Depender de servidor unico sem redundancia"
      },
      {
        "id": "b",
        "text": "Manter todos os componentes em uma unica AZ"
      },
      {
        "id": "c",
        "text": "Projetar recuperacao de falhas com testes periodicos"
      },
      {
        "id": "d",
        "text": "Desativar monitoramento para reduzir custo"
      },
      {
        "id": "e",
        "text": "Distribuir recursos em multiplas Zonas de Disponibilidade"
      }
    ],
    "correctAnswers": [
      "c",
      "e"
    ],
    "explanation": {
      "general": "Resiliencia exige redundancia e preparacao para falhas.",
      "incorrects": {
        "a": "Incorreta. Não possuir redundância deixa a arquitetura frágil e propensa a quedas totais no caso de qualquer anomalia na máquina.",
        "b": "Incorreta. Uma Zona de Disponibilidade (AZ) é um ou mais datacenters isolados; manter tudo em apenas uma deixa o negócio vulnerável a desastres localizados nessa AZ.",
        "d": "Incorreta. Sem o monitoramento adequado (ex: CloudWatch), a empresa não será capaz de identificar que uma falha ocorreu para agir ou acionar rotinas automatizadas de recuperação."
      }
    },
    "references": [
      "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html"
    ],
    "tags": [
      "reliability",
      "resilience"
    ]
  } */
