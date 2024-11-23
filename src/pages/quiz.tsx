import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Timer, ChevronRight, ChevronLeft } from "lucide-react"
import { Country, Question } from "@/types"
import { useCallback, useEffect, useState } from "react"
import { getRandomCapitals, getRandomContinents, shuffleArray } from "@/helpers"
import { useQuery } from "@apollo/client"
import { GET_COUNTRIES } from "@/graphql/queries/countriesQueries"

const Quiz = () => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [timeLeft, setTimeLeft] = useState(60)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>()
  const [score, setScore] = useState(0)
  const { data, loading, error } = useQuery(GET_COUNTRIES)

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore((prevScore) => prevScore + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevQuestion) => prevQuestion - 1)
      setSelectedAnswer(null)
      setTimeLeft(30)
    }
  }

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevQuestion) => prevQuestion + 1)
      setSelectedAnswer(null)
      setTimeLeft(30)
    } else {
      console.log("Quiz ended. Your score is: ", score)
      // TODO: Save score to leaderboard
    }
  }, [currentQuestionIndex, questions.length, score])

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
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0) {
      handleNextQuestion()
    }
  }, [handleNextQuestion, setTimeLeft, timeLeft])

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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Timer className="mr-2" />
            <span>{timeLeft}s</span>
          </div>
          <div>
            Question {currentQuestionIndex + 1}/{questions.length}
          </div>
        </div>
        <Progress
          value={((currentQuestionIndex + 1) / questions.length) * 100}
          className="mb-4"
        />
        <CardTitle className="text-xl mb-4">
          {currentQuestion.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {currentQuestion.options.map((option: string, index: number) => (
            <Button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              variant={selectedAnswer === option ? "default" : "outline"}
              className={`w-full justify-start ${
                selectedAnswer && option === currentQuestion.correctAnswer
                  ? "bg-green-500 hover:bg-green-600"
                  : selectedAnswer === option &&
                    option !== currentQuestion.correctAnswer
                  ? "bg-red-500 hover:bg-red-600"
                  : ""
              }`}
            >
              {option}
            </Button>
          ))}
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
          <Button onClick={handleNextQuestion} disabled={!selectedAnswer}>
            {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
            <ChevronRight className="ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Quiz
