import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Timer, ChevronRight, ChevronLeft } from "lucide-react"
import { useEffect } from "react"
import { getAnswerHighlightClass, getQuestionIcon } from "@/utils"
import { useQuery } from "@apollo/client"
import { GET_COUNTRIES } from "@/graphql/queries/countriesQueries"
import { useQuizContext } from "@/context/quiz/quiz.hook"
import QuizError from "@/components/quizError"
import Spinner from "@/components/spinner"

const Quiz = () => {
  const {
    generateQuestions,
    questions,
    currentQuestionIndex,
    answeredQuestions,
    selectedAnswer,
    timeLeft,
    isTimerActive,
    handleAnswerSelect,
    handleNextQuestion,
    handlePreviousQuestion,
    decrementTimeLeft,
  } = useQuizContext()
  const { data, loading, error } = useQuery(GET_COUNTRIES)

  useEffect(() => {
    if (data?.countries) {
      generateQuestions(data.countries)
    }
  }, [data, generateQuestions])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (timeLeft > 0 && isTimerActive) {
      timer = setInterval(() => {
        decrementTimeLeft()
      }, 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0) {
      handleNextQuestion()
    }
  }, [timeLeft, isTimerActive, decrementTimeLeft])

  if (loading) {
    return <Spinner />
  }

  if (error) {
    return <QuizError />
  }

  const currentQuestion = questions[currentQuestionIndex]
  if (!currentQuestion) return null

  const answeredQuestion = answeredQuestions[currentQuestionIndex]
  const currentAnswer = answeredQuestion
    ? answeredQuestion.answer
    : selectedAnswer

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
            className="h-4 opacity-0 animate-slide-up-400"
          />
          <div className="flex items-center gap-3 mb-4 opacity-0 animate-slide-up-800">
            {getQuestionIcon(currentQuestion)}
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
                  className={`w-full justify-start ${getAnswerHighlightClass(
                    option,
                    currentAnswer ?? null,
                    currentQuestion.correctAnswer
                  )}`}
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
