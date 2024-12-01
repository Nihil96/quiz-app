import { ROUTES } from "@/constants/routes"
import {
  getInitialLeaderboard,
  getRandomCapitals,
  getRandomContinents,
  shuffleArray,
} from "@/helpers"
import { AnsweredQuestions, Country, PlayerScoreEntry, Question } from "@/types"
import { createContext, useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"

interface QuizContextType {
  // State
  username: string
  score: number
  isTimerActive: boolean
  answeredQuestions: AnsweredQuestions
  questions: Question[]
  timeLeft: number
  currentQuestionIndex: number
  selectedAnswer: string | null
  leaderboard: PlayerScoreEntry[]

  // Methods
  handleStartQuiz: () => void
  handleAnswerSelect: (answer: string) => void
  handlePreviousQuestion: () => void
  handleNextQuestion: () => void
  generateQuestions: (countries: Country[]) => void
  handleUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  decrementTimeLeft: () => void
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>
  setScore: React.Dispatch<React.SetStateAction<number>>
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

const QuizProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [score, setScore] = useState(0)
  const [isTimerActive, setIsTimerActive] = useState(true)
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestions>(
    {}
  )
  const [questions, setQuestions] = useState<Question[]>([])
  const [timeLeft, setTimeLeft] = useState(30)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [leaderboard, setLeaderboard] = useState<PlayerScoreEntry[]>(
    getInitialLeaderboard
  )

  const handleStartQuiz = () => {
    if (!username.trim()) {
      alert("Please enter a valid username")
      return
    }

    setScore(0)
    setAnsweredQuestions({})
    setIsTimerActive(true)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setQuestions([])
    setTimeLeft(30)
    navigate(ROUTES.QUIZ)
  }

  const handleQuizComplete = useCallback(() => {
    const newLeaderboardEntry = {
      username,
      score,
      timestamp: new Date().toISOString(),
    }

    const updatedLeaderboard = [...leaderboard, newLeaderboardEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)

    setLeaderboard(updatedLeaderboard)
    localStorage.setItem("quizLeaderboard", JSON.stringify(updatedLeaderboard))
    navigate(ROUTES.RESULT)
  }, [username, score, leaderboard, navigate])

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }

  const handleIncrementScore = (value: number = 1) => {
    setScore((prev) => prev + value)
  }

  const handleToggleTimer = useCallback((state: boolean) => {
    setIsTimerActive(state)
  }, [])

  const handleUpdateAnsweredQuestions = (
    questionIndex: number,
    answer: string,
    isCorrect: boolean
  ) => {
    setAnsweredQuestions((prev) => ({
      ...prev,
      [questionIndex]: { answer, isCorrect },
    }))
  }

  const handleAnswerSelect = (answer: string) => {
    // Check if question has already been answered
    if (answeredQuestions[currentQuestionIndex] !== undefined) {
      return
    }

    handleToggleTimer(false)
    setSelectedAnswer(answer)
    const isCorrect = answer === questions[currentQuestionIndex].correctAnswer

    // Store the answer and whether it was correct
    handleUpdateAnsweredQuestions(currentQuestionIndex, answer, isCorrect)

    if (isCorrect) {
      handleIncrementScore()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
      const prevAnswer = answeredQuestions[currentQuestionIndex - 1]
      setSelectedAnswer(prevAnswer ? prevAnswer.answer : null)
      setTimeLeft(30)
      handleToggleTimer(false)
    }
  }

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      const nextAnswer = answeredQuestions[currentQuestionIndex + 1]
      setSelectedAnswer(nextAnswer ? nextAnswer.answer : null)
      setTimeLeft(30)
      handleToggleTimer(true)
    } else {
      handleQuizComplete()
    }
  }, [
    currentQuestionIndex,
    questions.length,
    answeredQuestions,
    handleToggleTimer,
    handleQuizComplete,
  ])

  const generateQuestions = useCallback(
    (countries: Country[]) => {
      const questionTypes = [
        // Capital city questions
        (country: Country) => ({
          type: "capital" as const,
          question: `What is the capital of ${country.name}?`,
          correctAnswer: country.capital,
          options: shuffleArray([
            country.capital,
            ...getRandomCapitals(countries, country, 3),
          ]),
        }),
        // Continent questions
        (country: Country) => ({
          type: "continent" as const,
          question: `Which continent is ${country.name} located in?`,
          correctAnswer: country.continent.name,
          options: shuffleArray([
            country.continent.name,
            ...getRandomContinents(countries, country, 3),
          ]),
        }),
      ]

      const generatedQuestions: Question[] = []
      const usedCountries = new Set()

      while (
        generatedQuestions.length < 10 &&
        usedCountries.size < countries.length
      ) {
        const country = countries[Math.floor(Math.random() * countries.length)]
        if (!usedCountries.has(country.name) && country.capital) {
          usedCountries.add(country.name)
          const questionType =
            questionTypes[Math.floor(Math.random() * questionTypes.length)]
          generatedQuestions.push(questionType(country))
        }
      }
      setQuestions(shuffleArray(generatedQuestions))
    },
    [setQuestions]
  )

  const decrementTimeLeft = useCallback(() => {
    setTimeLeft((prevTime) => {
      // If time is already 0, return 0 to prevent negative values
      if (prevTime <= 0) {
        return 0
      }

      // Decrement time by 1
      return prevTime - 1
    })
  }, [])

  const contextValue: QuizContextType = {
    // State
    username,
    score,
    isTimerActive,
    answeredQuestions,
    questions,
    timeLeft,
    currentQuestionIndex,
    selectedAnswer,
    leaderboard,

    // Methods
    handleStartQuiz,
    handleAnswerSelect,
    handlePreviousQuestion,
    handleNextQuestion,
    generateQuestions,
    handleUsernameChange,
    decrementTimeLeft,

    // Additional utilities
    setQuestions,
    setScore,
  }

  return (
    <QuizContext.Provider value={contextValue}>{children}</QuizContext.Provider>
  )
}

export { QuizProvider, QuizContext }
