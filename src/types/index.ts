export interface Language {
  name: string
}

export interface Continent {
  name: string
}

export interface Country {
  name: string
  capital: string
  continent: Continent
  languages: Language[]
}

export type CountriesResponse = {
  countries: Country[]
}

export type QuestionType = "capital" | "continent"

export interface Question {
  correctAnswer: string
  options: string[]
  question: string
  type: QuestionType
}
export interface PlayerScoreEntry {
  username: string
  score: number
  timestamp: string
}
