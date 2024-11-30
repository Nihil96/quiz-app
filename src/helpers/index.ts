import { Country, PlayerScoreEntry } from "@/types"

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export const getRandomCapitals = (
  countries: Country[],
  currentCountry: Country,
  count: number
) => {
  const capitals = countries
    .filter(
      (country) => country.capital && country.capital !== currentCountry.capital
    )
    .map((country) => country.capital)
  return shuffleArray<string>(capitals).slice(0, count)
}

export const getRandomContinents = (
  countries: Country[],
  currentCountry: Country,
  count: number
) => {
  const continents = [
    ...new Set(
      countries
        .filter(
          (country) => country.continent.name !== currentCountry.continent.name
        )
        .map((country) => country.continent.name)
    ),
  ]
  return shuffleArray<string>(continents).slice(0, count)
}

export const getInitialLeaderboard = (): PlayerScoreEntry[] => {
  const savedLeaderboard = localStorage.getItem("quizLeaderboard")
  return savedLeaderboard ? JSON.parse(savedLeaderboard) : []
}
