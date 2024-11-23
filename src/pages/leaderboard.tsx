import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Home, Smile } from "lucide-react"
import { useEffect } from "react"
import { PlayerScoreEntry } from "@/types"

interface LeaderboardProps {
  username: string
  score: number
  leaderboard: PlayerScoreEntry[]
  setLeaderboard: React.Dispatch<React.SetStateAction<PlayerScoreEntry[]>>
}

const Leaderboard = ({ setLeaderboard, leaderboard }: LeaderboardProps) => {
  const navigate = useNavigate()

  useEffect(() => {
    const savedLeaderboard = localStorage.getItem("quizLeaderboard")
    console.log(savedLeaderboard)
    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard))
    }
  }, [setLeaderboard])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center mb-4">Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        {leaderboard.length > 0 ? (
          <div className="space-y-4">
            {leaderboard.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-100 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold">{entry.username}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="font-bold">{entry.score} pts</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center space-y-4">
            <Smile className="w-10 h-10 mx-auto text-gray-500" />
            <p className="text-gray-600">
              No scores yet! Play a quiz to see your name here.
            </p>
            <Button onClick={() => navigate("/quiz")} className="mt-4">
              Start Quiz
            </Button>
          </div>
        )}
        <Button
          onClick={() => navigate("/")}
          className="mt-6 w-full"
          variant="outline"
        >
          <Home className="mr-2" />
          Back to Home
        </Button>
      </CardContent>
    </Card>
  )
}

export default Leaderboard
