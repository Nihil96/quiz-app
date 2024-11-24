import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Timer,
  ChevronRight,
  ChevronLeft,
  Target,
  Map,
  Award,
} from "lucide-react"
import { AnsweredQuestions, Country, Question } from "@/types"
import { useCallback, useEffect, useState } from "react"
import { getRandomCapitals, getRandomContinents, shuffleArray } from "@/helpers"
import { useQuery } from "@apollo/client"
import { GET_COUNTRIES } from "@/graphql/queries/countriesQueries"

interface QuizProps {
  setScore: React.Dispatch<React.SetStateAction<number>>
  handleQuizComplete: () => void
  setIsTimerActive: React.Dispatch<React.SetStateAction<boolean>>
  isTimerActive: boolean
  setAnsweredQuestions: React.Dispatch<React.SetStateAction<AnsweredQuestions>>
  answeredQuestions: AnsweredQuestions
}

const Quiz = ({
  handleQuizComplete,
  setScore,
  setIsTimerActive,
  isTimerActive,
  setAnsweredQuestions,
  answeredQuestions,
}: QuizProps) => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [timeLeft, setTimeLeft] = useState(30)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>()
  const { data, loading, error } = useQuery(GET_COUNTRIES)

  const handleAnswerSelect = (answer: string) => {
    // Check if question has already been answered
    if (answeredQuestions[currentQuestionIndex] !== undefined) {
      return
    }

    setIsTimerActive(false)
    setSelectedAnswer(answer)
    const isCorrect = answer === questions[currentQuestionIndex].correctAnswer

    // Store the answer and whether it was correct
    setAnsweredQuestions((prev) => ({
      ...prev,
      [currentQuestionIndex]: {
        answer,
        isCorrect,
      },
    }))

    if (isCorrect) {
      setScore((prev) => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
      const prevAnswer = answeredQuestions[currentQuestionIndex - 1]
      setSelectedAnswer(prevAnswer ? prevAnswer.answer : null)
      setTimeLeft(30)
      setIsTimerActive(false)
    }
  }

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      const nextAnswer = answeredQuestions[currentQuestionIndex + 1]
      setSelectedAnswer(nextAnswer ? nextAnswer.answer : null)
      setTimeLeft(30)
      setIsTimerActive(true)
    } else {
      handleQuizComplete()
    }
  }, [
    currentQuestionIndex,
    questions.length,
    answeredQuestions,
    setIsTimerActive,
    handleQuizComplete,
  ])

  const generateQuestions = (countries: Country[]) => {
    const questionTypes = [
      // Capital city questions
      (country: Country) => ({
        type: "capital",
        question: `What is the capital of ${country.name}?`,
        correctAnswer: country.capital,
        options: shuffleArray([
          country.capital,
          ...getRandomCapitals(countries, country, 3),
        ]),
      }),
      // Continent questions
      (country: Country) => ({
        type: "continent",
        question: `Which continent is ${country.name} located in?`,
        correctAnswer: country.continent.name,
        options: shuffleArray([
          country.continent.name,
          ...getRandomContinents(countries, country, 3),
        ]),
      }),
    ]

    const generatedQuestions = []
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
    // TODO: fix types
    setQuestions(shuffleArray(generatedQuestions))
  }

  useEffect(() => {
    if (data?.countries) {
      generateQuestions(data.countries)
    }
  }, [data])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (timeLeft > 0 && isTimerActive) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0) {
      handleNextQuestion()
    }
  }, [timeLeft, isTimerActive, handleNextQuestion])

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex justify-center items-center h-48">
          <h1>Loading...</h1>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="text-center">
          <p className="text-red-500">
            Error loading quiz data. Please try again later.
          </p>
        </CardContent>
      </Card>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  if (!currentQuestion) return null

  const answeredQuestion = answeredQuestions[currentQuestionIndex]
  const currentAnswer = answeredQuestion
    ? answeredQuestion.answer
    : selectedAnswer

  const getQuestionIcon = () => {
    switch (currentQuestion.type) {
      case "capital":
        return <Target className="w-6 h-6 text-purple-500 animate-pulse" />
      case "continent":
        return <Map className="w-6 h-6 text-blue-500 animate-pulse" />
      default:
        return <Award className="w-6 h-6 text-amber-500 animate-pulse" />
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center from-background to-muted">
      <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-lg animate-slide-down">
        <CardHeader className="relative">
          <div className="flex justify-between items-center mb-4 animate-fade-in">
            <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 rounded-lg p-2 shadow-sm">
              <Timer
                className={`${
                  timeLeft <= 5
                    ? "text-red-500 animate-pulse"
                    : "text-slate-500"
                }`}
              />
              <span
                className={`font-mono text-lg ${
                  timeLeft <= 5 ? "text-red-500" : ""
                }`}
              >
                {timeLeft.toString().padStart(2, "0")}s
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 rounded-lg p-2 shadow-sm">
              <span className="text-sm font-medium">
                {currentQuestionIndex + 1}/{questions.length}
              </span>
            </div>
          </div>
          <Progress
            value={((currentQuestionIndex + 1) / questions.length) * 100}
            className="h-4 animate-slide-up-400"
          />
          <div className="flex items-center gap-3 mb-4 animate-slide-up-600">
            {getQuestionIcon()}
            <CardTitle className="text-xl">
              {currentQuestion.question}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option: string, index: number) => {
              return (
                <Button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  variant={currentAnswer === option ? "default" : "outline"}
                  className={`w-full justify-start ${
                    currentAnswer && option === currentQuestion.correctAnswer
                      ? "bg-green-500 hover:bg-green-600"
                      : currentAnswer === option &&
                        option !== currentQuestion.correctAnswer
                      ? "bg-red-500 hover:bg-red-600"
                      : ""
                  }`}
                >
                  {option}
                </Button>
              )
            })}
          </div>
          <div className="flex justify-between mt-6">
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              variant="outline"
            >
              <ChevronLeft className="mr-2" />
              Previous
            </Button>
            <Button onClick={handleNextQuestion} disabled={!currentAnswer}>
              {currentQuestionIndex === questions.length - 1
                ? "Finish"
                : "Next"}
              <ChevronRight className="ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Quiz
