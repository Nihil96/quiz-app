import { Route, Routes, useNavigate } from "react-router-dom"
import "./App.css"
import { useState } from "react"
import Welcome from "./pages/welcome"

function App() {
  const [username, setUsername] = useState("")
  const navigate = useNavigate()

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }

  const handleStartQuiz = () => {
    if (!username.trim()) {
      alert("Please enter a valid username")
      return
    }
    navigate("/quiz")
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
    </Routes>
  )
}

export default App
