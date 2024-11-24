import { Route, Routes, useNavigate } from "react-router-dom"
import "./App.css"
import { useState } from "react"
import Welcome from "./pages/welcome"
import Quiz from "./pages/quiz"
import Leaderboard from "./pages/leaderboard"
import { PlayerScoreEntry } from "./types"
import Results from "./pages/results"

function App() {
  const [username, setUsername] = useState("")
  const [score, setScore] = useState(0)
  const [leaderboard, setLeaderboard] = useState<PlayerScoreEntry[]>([])
  const [isTimerActive, setIsTimerActive] = useState(true)

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
    setIsTimerActive(true)
    navigate("/quiz")
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
    navigate("results")
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Welcome
            username={username}
            handleUsernameChange={handleUsernameChange}
            handleStartQuiz={handleStartQuiz}
          />
        }
      />
      <Route
        path="/quiz"
        element={
          <Quiz
            setScore={setScore}
            handleQuizComplete={handleQuizComplete}
            isTimerActive={isTimerActive}
            setIsTimerActive={setIsTimerActive}
          />
        }
      />
      <Route
        path="/leaderboard"
        element={
          <Leaderboard
            username={username}
            score={score}
            leaderboard={leaderboard}
            setLeaderboard={setLeaderboard}
          />
        }
      />
      <Route
        path="/results"
        element={<Results score={score} totalQuestions={10} />}
      />
    </Routes>
  )
}

export default App
