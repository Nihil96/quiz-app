import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Home, Smile } from "lucide-react"
import { useEffect } from "react"
import { PlayerScoreEntry } from "@/types"
import { ROUTES } from "@/constants/routes"
import { getAnimationDelay, getRankIcon } from "@/utils"

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
    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard))
    }
  }, [setLeaderboard])

  return (
    <div className="min-h-screen flex items-center justify-center from-background to-muted mt-6">
      <Card className="w-full max-w-2xl mx-auto shadow-lg opacity-0 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-3xl text-center mb-4 opacity-0 animate-slide-down">
            🏆 Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          {leaderboard.length > 0 ? (
            <div className="space-y-4">
              {leaderboard.map((entry, index) => (
                <div
                  key={index}
                  style={getAnimationDelay(index)}
                  className={`
                    flex items-center justify-between p-4 
                    rounded-lg hover:scale-105 transition-transform
                    ${
                      index === 0
                        ? "bg-yellow-50"
                        : index === 1
                        ? "bg-gray-50"
                        : index === 2
                        ? "bg-amber-50"
                        : "bg-muted"
                    }
                  `}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center font-bold">
                      {getRankIcon(index) || index + 1}
                    </div>
                    <div className="ml-4">
                      <div className="font-semibold">{entry.username}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    {entry.score} pts
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center space-y-4 opacity-0 animate-slide-up-400">
              <Smile className="w-16 h-16 mx-auto text-gray-500 animate-bounce" />
              <p className="text-gray-600 text-lg">
                No scores yet! Play a quiz to see your name here.
              </p>
            </div>
          )}
          <Button
            onClick={() => navigate(ROUTES.WELCOME)}
            className="mt-8 w-full opacity-0 animate-slide-up-1000 hover:scale-105 transition-transform"
            variant="outline"
          >
            <Home className="mr-2 group-hover:animate-pulse" />
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Leaderboard
