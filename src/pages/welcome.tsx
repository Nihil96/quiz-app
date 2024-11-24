import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useEffect, useRef } from "react"

interface WelcomeProps {
  username: string
  handleUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleStartQuiz: () => void
}

const Welcome = ({
  username,
  handleUsernameChange,
  handleStartQuiz,
}: WelcomeProps) => {
  const navigate = useNavigate()
  const usernameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    usernameInputRef.current?.focus()
  }, [])

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg shadow-gray-400/50">
      <CardHeader>
        <CardTitle className="text-3xl text-center mb-4">
          World Geography Quiz
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center text-lg mb-8">
          Test your knowledge of countries, capitals, and continents!
        </div>
        <div className="flex flex-col items-center space-y-4">
          <input
            ref={usernameInputRef}
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => handleUsernameChange(e)}
            className="px-4 py-2 border rounded-md w-64"
          />
          <Button onClick={handleStartQuiz} className="w-64">
            Start Quiz
          </Button>
          <Button
            onClick={() => navigate("/leaderboard")}
            variant="outline"
            className="w-64"
          >
            View Leaderboard
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Welcome
