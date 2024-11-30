import { Route, Routes, useNavigate } from "react-router-dom"
import "./App.css"
import { useState } from "react"
import Welcome from "./pages/welcome"
import Quiz from "./pages/quiz"
import Leaderboard from "./pages/leaderboard"
import { AnsweredQuestions, PlayerScoreEntry } from "./types"
import Results from "./pages/results"
import PageNotFound from "./pages/pageNotFound"
import { ROUTES } from "./constants/routes"
import { getInitialLeaderboard } from "./helpers"

function App() {
  const [username, setUsername] = useState("")
  const [score, setScore] = useState(0)
  const [leaderboard, setLeaderboard] = useState<PlayerScoreEntry[]>(
    getInitialLeaderboard
  )
  const [isTimerActive, setIsTimerActive] = useState(true)
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestions>(
    {}
  )
  const navigate = useNavigate()

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }

  const handleStartQuiz = () => {
    if (!username.trim()) {
      alert("Please enter a valid username")
      return
    }
    setScore(0)
    setAnsweredQuestions({})
    setIsTimerActive(true)
    navigate(ROUTES.QUIZ)
  }

  const handleQuizComplete = () => {
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
  }

  const handleIncrementScore = (value: number = 1) => {
    setScore((prev) => prev + value)
  }

  const handleToggleTimer = (state: boolean) => {
    setIsTimerActive(state)
  }

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

  return (
    <div className="min-h-full w-full px-2">
      <Routes>
        <Route
          path={ROUTES.WELCOME}
          element={
            <Welcome
              username={username}
              handleUsernameChange={handleUsernameChange}
              handleStartQuiz={handleStartQuiz}
            />
          }
        />
        <Route
          path={ROUTES.QUIZ}
          element={
            <Quiz
              handleQuizComplete={handleQuizComplete}
              isTimerActive={isTimerActive}
              handleToggleTimer={handleToggleTimer}
              answeredQuestions={answeredQuestions}
              handleUpdateAnsweredQuestions={handleUpdateAnsweredQuestions}
              handleIncrementScore={handleIncrementScore}
            />
          }
        />
        <Route
          path={ROUTES.LEADERBOARD}
          element={
            <Leaderboard
              username={username}
              score={score}
              leaderboard={leaderboard}
            />
          }
        />
        <Route
          path={ROUTES.RESULT}
          element={<Results score={score} totalQuestions={10} />}
        />
        <Route path={ROUTES.PAGE_NOT_FOUND} element={<PageNotFound />} />
      </Routes>
    </div>
  )
}

export default App
